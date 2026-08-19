<?php

namespace App\Console\Commands;

use App\Models\Provider;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;

/**
 * Installs provider brand assets from a manifest of URLs you supply.
 *
 * You choose the sources and you assert the rights — this command does not go
 * looking for logos, and it will not run without `--i-have-rights`, which is
 * recorded in the log so the decision has an owner.
 *
 *     php artisan providers:fetch-logos storage/logos.json --i-have-rights
 *
 * Manifest format (slug → URL):
 *
 *     {
 *       "sslcommerz": "https://partner-brand-kit.example/sslcommerz.svg",
 *       "shurjopay":  "https://partner-brand-kit.example/shurjopay.png"
 *     }
 *
 * Prefer the asset a partner gives you in their brand kit over anything pulled
 * off a public web page: brand kits carry usage terms, and the file is the one
 * they actually want shown.
 */
class FetchProviderLogos extends Command
{
    protected $signature = 'providers:fetch-logos
                            {manifest : JSON file mapping provider slug to an image URL}
                            {--i-have-rights : Confirm you are licensed to display these assets}
                            {--dry-run : Validate and report without writing anything}';

    protected $description = 'Download approved provider logos from a manifest of URLs you supply';

    /** Only real image types, and nothing large enough to be a payload. */
    private const ALLOWED = [
        'image/svg+xml' => 'svg',
        'image/png' => 'png',
        'image/webp' => 'webp',
        'image/jpeg' => 'jpg',
    ];

    private const MAX_BYTES = 512 * 1024;

    public function handle(): int
    {
        if (! $this->option('i-have-rights')) {
            $this->error('Refusing to run without --i-have-rights.');
            $this->newLine();
            $this->line('Displaying a company’s logo requires their permission. Partner brand kits');
            $this->line('normally grant it; a logo lifted from a public page usually does not.');
            $this->line('Re-run with --i-have-rights once you have confirmed you are licensed.');

            return self::FAILURE;
        }

        $path = (string) $this->argument('manifest');

        if (! File::exists($path)) {
            $this->error("Manifest not found: {$path}");

            return self::FAILURE;
        }

        $manifest = json_decode(File::get($path), true);

        if (! is_array($manifest)) {
            $this->error('Manifest must be a JSON object mapping provider slug to image URL.');

            return self::FAILURE;
        }

        $dryRun = (bool) $this->option('dry-run');
        $destination = public_path('brand/providers');
        File::ensureDirectoryExists($destination);

        $installed = 0;
        $failed = 0;

        foreach ($manifest as $slug => $url) {
            // A blank entry is "not supplied yet", not a failure.
            if (trim((string) $url) === '') {
                continue;
            }

            $provider = Provider::where('slug', $slug)->first();

            if (! $provider) {
                $this->line("  <fg=yellow>skip</> {$slug} — no provider with that slug");
                $failed++;

                continue;
            }

            $result = $this->download((string) $url);

            if (isset($result['error'])) {
                $this->line("  <fg=red>fail</> {$slug} — {$result['error']}");
                $failed++;

                continue;
            }

            $filename = $slug.'.'.$result['extension'];
            $relative = "brand/providers/{$filename}";

            if (! $dryRun) {
                File::put("{$destination}/{$filename}", $result['body']);
                $provider->update(['logo_path' => $relative]);
            }

            $size = number_format(strlen($result['body']) / 1024, 1);
            $this->line("  <fg=green>ok</>   {$provider->name} → {$relative} ({$size} KB)");
            $installed++;
        }

        $this->newLine();
        $this->info($dryRun ? "{$installed} logo(s) would be installed." : "{$installed} logo(s) installed.");

        if ($failed > 0) {
            $this->warn("{$failed} entr(ies) could not be installed.");
        }

        if (! $dryRun && $installed > 0) {
            logger()->info('Provider logos installed from manifest', [
                'count' => $installed,
                'rights_confirmed_by_operator' => true,
            ]);
        }

        return $failed > 0 && $installed === 0 ? self::FAILURE : self::SUCCESS;
    }

    /**
     * @return array{body: string, extension: string}|array{error: string}
     */
    private function download(string $url): array
    {
        if (! filter_var($url, FILTER_VALIDATE_URL) || ! str_starts_with($url, 'https://')) {
            return ['error' => 'not an https URL'];
        }

        try {
            $response = Http::timeout(15)->withHeaders(['Accept' => 'image/*'])->get($url);
        } catch (\Throwable $exception) {
            return ['error' => 'request failed: '.$exception->getMessage()];
        }

        if (! $response->successful()) {
            return ['error' => 'HTTP '.$response->status()];
        }

        $contentType = strtolower(strtok((string) $response->header('Content-Type'), ';'));

        if (! isset(self::ALLOWED[$contentType])) {
            return ['error' => "unsupported content type: {$contentType}"];
        }

        $body = $response->body();

        if (strlen($body) > self::MAX_BYTES) {
            return ['error' => 'file larger than '.(self::MAX_BYTES / 1024).' KB'];
        }

        // SVGs are executable in a browser context, so reject scripted ones.
        if ($contentType === 'image/svg+xml' && preg_match('/<script|javascript:|on\w+\s*=/i', $body)) {
            return ['error' => 'SVG contains script content'];
        }

        return ['body' => $body, 'extension' => self::ALLOWED[$contentType]];
    }
}
