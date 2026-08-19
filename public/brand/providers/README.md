# Approved provider brand assets

Drop an **approved** logo here as `{provider-slug}.svg` (or `.png`/`.webp`), then set
the matching `logo_path` on the provider record, e.g.:

    php artisan tinker
    >>> App\Models\Provider::where('slug','sslcommerz')->update(['logo_path' => 'brand/providers/sslcommerz.svg'])

Rules:

- Use only assets the provider has given you permission to display, in the form they
  supplied. Do not scrape, trace, or recreate an official logo.
- Prefer SVG. Target a 40x40 render; give the asset a transparent background.
- Until `logo_path` is set, the UI renders a neutral initials mark. That is a valid
  permanent state, not a placeholder you must fill.
