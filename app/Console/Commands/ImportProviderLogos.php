<?php

namespace App\Console\Commands;

use App\Models\Provider;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;

/**
 * Installs approved provider brand assets in one step.
 *
 * Point it at a folder of files named after each provider slug and it copies
 * them into public/brand/providers and sets logo_path on the matching records:
 *
 *     php artisan providers:import-logos ~/Downloads/psp-brand-kits
 *
 * Only use assets the provider has given you permission to display. This command
 * deliberately does not fetch anything from the internet.
 */
class ImportProviderLogos extends Command
{
    // Braces are the signature's own syntax, so the help text avoids them.
    protected $signature = 'providers:import-logos
                            {source : Folder of files named after each provider slug, e.g. sslcommerz.svg}
                            {--dry-run : Show what would change without writing anything}';

    protected $description = 'Install approved provider logo assets from a local folder';

    private const EXTENSIONS = ['svg', 'png', 'webp'];

    public function handle(): int
    {
        $source = rtrim((string) $this->argument('source'), '/');

        if (! File::isDirectory($source)) {
            $this->error("Not a directory: {$source}");

            return self::FAILURE;
        }

        $destination = public_path('brand/providers');
        File::ensureDirectoryExists($destination);

        $dryRun = (bool) $this->option('dry-run');
        $matched = 0;
        $unmatched = [];

        foreach (Provider::orderBy('sort_order')->get() as $provider) {
            $file = collect(self::EXTENSIONS)
                ->map(fn (string $extension) => "{$source}/{$provider->slug}.{$extension}")
                ->first(fn (string $path) => File::exists($path));

            if (! $file) {
                $unmatched[] = $provider->slug;

                continue;
            }

            $filename = $provider->slug.'.'.File::extension($file);
            $relative = "brand/providers/{$filename}";

            if (! $dryRun) {
                File::copy($file, "{$destination}/{$filename}");
                $provider->update(['logo_path' => $relative]);
            }

            $this->line("  <fg=green>✓</> {$provider->name} → {$relative}");
            $matched++;
        }

        $this->newLine();
        $this->info($dryRun
            ? "{$matched} logo(s) would be installed."
            : "{$matched} logo(s) installed.");

        if ($unmatched !== []) {
            $this->newLine();
            $this->comment('Still using a neutral text mark (no file found):');
            $this->line('  '.implode(', ', $unmatched));
            $this->newLine();
            $this->line('Name each file after the provider slug, e.g. <fg=cyan>sslcommerz.svg</>.');
        }

        return self::SUCCESS;
    }
}
