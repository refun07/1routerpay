<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#090B0D">

    <title>{{ $meta['title'] }}</title>
    <meta name="description" content="{{ $meta['description'] }}">
    <link rel="canonical" href="{{ $meta['canonical'] }}">

    <meta property="og:type" content="website">
    <meta property="og:site_name" content="{{ $brand['productName'] }}">
    <meta property="og:title" content="{{ $meta['title'] }}">
    <meta property="og:description" content="{{ $meta['description'] }}">
    <meta property="og:url" content="{{ $meta['canonical'] }}">

    {{-- Twitter/X card is only emitted when a real account is configured. --}}
    @isset($brand['social']['x'])
        <meta name="twitter:card" content="summary_large_image">
        <meta name="twitter:title" content="{{ $meta['title'] }}">
        <meta name="twitter:description" content="{{ $meta['description'] }}">
    @endisset

    {{-- Brand config, not secrets. Nonce keeps production CSP free of `unsafe-inline`. --}}
    <script @isset($cspNonce) nonce="{{ $cspNonce }}" @endisset>window.__PAYROUTER__ = @json($brand);</script>

    @vite(['resources/css/app.css', 'resources/js/app.tsx'])
</head>
<body class="bg-background text-text-primary antialiased">
    <div id="app"></div>

    <noscript>
        <div style="max-width:720px;margin:0 auto;padding:48px 24px;font-family:system-ui,sans-serif;color:#F5F7F8">
            <h1 style="font-size:32px;line-height:1.15;margin:0 0 16px">The unified layer for every payment</h1>
            <p style="color:#9CA6AF;line-height:1.6">
                {{ $brand['productName'] }} connects payment providers through one API. Route transactions
                with more control, monitor provider health, and reconcile payment operations from one dashboard.
                JavaScript is required for the interactive parts of this site.
            </p>
        </div>
    </noscript>
</body>
</html>
