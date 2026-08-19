import { brand } from '@/lib/brand';
import { cn } from '@/lib/cn';
import type { Provider } from '@/types/provider';

/**
 * Provider identity mark.
 *
 * Renders the approved brand asset when one has been supplied (`logo_path` —
 * see `php artisan providers:import-logos`). Otherwise it renders a designed
 * initial lockup: a single letter on a tinted plate with a soft gradient.
 *
 * The lockup is a deliberate treatment, not a broken image. It uses the
 * provider's name — nominative use, which needs no licence — and never imitates
 * anyone's logo, colours, or typeface.
 */

const TINTS = [
    { from: 'from-brand/20', text: 'text-brand', ring: 'ring-brand/25' },
    { from: 'from-info/20', text: 'text-info', ring: 'ring-info/25' },
    { from: 'from-success/20', text: 'text-success', ring: 'ring-success/25' },
    { from: 'from-danger/20', text: 'text-danger', ring: 'ring-danger/25' },
    { from: 'from-warning/20', text: 'text-warning', ring: 'ring-warning/25' },
    { from: 'from-[#A78BFA]/20', text: 'text-[#A78BFA]', ring: 'ring-[#A78BFA]/25' },
];

/** Stable per-slug tint — the same provider always looks the same. */
function tintFor(slug: string) {
    let hash = 0;
    for (let index = 0; index < slug.length; index++) {
        hash = (hash * 31 + slug.charCodeAt(index)) >>> 0;
    }

    return TINTS[hash % TINTS.length];
}

/** One strong letter reads better at 24px than two cramped ones. */
function initial(name: string): string {
    const word = name
        .replace(/\b(limited|ltd|plc|company|services|technology|information|solution|fintech)\b/gi, '')
        .trim()
        .split(/\s+/)
        .filter(Boolean)[0];

    return (word?.[0] ?? name[0] ?? '?').toUpperCase();
}

export function ProviderMark({
    provider,
    className,
}: {
    provider: Pick<Provider, 'slug' | 'name' | 'logo_path'>;
    className?: string;
}) {
    if (provider.logo_path) {
        return (
            <span
                className={cn(
                    'flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-[11px] border border-border-subtle bg-white/[0.04]',
                    className,
                )}
            >
                <img
                    src={provider.logo_path}
                    alt={`${provider.name} logo`}
                    loading="lazy"
                    decoding="async"
                    width={40}
                    height={40}
                    className="size-full object-contain p-1.5"
                />
            </span>
        );
    }

    // Some brands would rather show nothing than a stand-in.
    if (brand.providerMarkFallback === 'none') return null;

    const tint = tintFor(provider.slug);

    return (
        <span
            aria-hidden="true"
            className={cn(
                'flex size-10 shrink-0 items-center justify-center rounded-[11px] bg-gradient-to-br to-transparent',
                'font-semibold leading-none tracking-tight ring-1 ring-inset',
                'text-[17px]',
                tint.from,
                tint.text,
                tint.ring,
                className,
            )}
        >
            {initial(provider.name)}
        </span>
    );
}
