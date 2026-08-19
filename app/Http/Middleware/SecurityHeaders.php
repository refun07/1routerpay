<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Baseline security headers for every public response.
 *
 * The CSP is deliberately strict: no third-party script hosts, because the site
 * ships no third-party scripts. Add a source here — never widen to `unsafe-*`.
 */
class SecurityHeaders
{
    public function handle(Request $request, Closure $next): Response
    {
        $nonce = base64_encode(random_bytes(16));
        $request->attributes->set('csp_nonce', $nonce);
        view()->share('cspNonce', $nonce);

        $response = $next($request);

        $response->headers->set('X-Content-Type-Options', 'nosniff');
        $response->headers->set('X-Frame-Options', 'DENY');
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');
        $response->headers->set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
        $response->headers->set('Cross-Origin-Opener-Policy', 'same-origin');

        if ($request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // The one inline script (brand config) carries a per-request nonce, so
        // production never needs `unsafe-inline`. Vite's dev client does.
        $nonce = $request->attributes->get('csp_nonce');

        $viteDevSrc = "http://localhost:* http://127.0.0.1:*";

        $scriptSrc = app()->environment('local')
            ? "'self' 'unsafe-inline' 'unsafe-eval' {$viteDevSrc}"
            : "'self' 'nonce-{$nonce}'";

        $styleSrc = app()->environment('local')
            ? "'self' 'unsafe-inline' {$viteDevSrc}"
            : "'self' 'unsafe-inline'";

        $connectSrc = app()->environment('local') ? "'self' ws: http: https:" : "'self'";

        $response->headers->set('Content-Security-Policy', implode('; ', [
            "default-src 'self'",
            "script-src {$scriptSrc}",
            "style-src {$styleSrc}",
            "img-src 'self' data:",
            "font-src 'self' data:",
            "connect-src {$connectSrc}",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'",
            "object-src 'none'",
        ]));

        return $response;
    }
}
