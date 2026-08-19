import { Link } from 'react-router-dom';
import { brand } from '@/lib/brand';
import { cn } from '@/lib/cn';

/**
 * Original mark: the numeral "1" as a trunk, with two routes branching off it.
 *
 * It reads as the product name and the product idea at once — one integration,
 * several ways a payment can travel. Drawn as geometry rather than a glyph so it
 * stays crisp at 16px and never depends on an installed font.
 */
export function LogoMark({ className }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className={cn('size-6 text-brand', className)}
        >
            {/* The "1": flag, stem, and foot. */}
            <path
                d="M3.9 7 6.8 4.6v14.8"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M3.8 19.4h6"
                stroke="currentColor"
                strokeWidth="2.1"
                strokeLinecap="round"
            />

            {/* Two routes leaving the trunk, clear of the numeral. */}
            <path
                d="M11.2 12h1.9c1.9 0 1.9-4.4 3.8-4.4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M11.2 12h1.9c1.9 0 1.9 4.4 3.8 4.4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.55"
            />

            <circle cx="18.6" cy="7.6" r="1.7" fill="currentColor" />
            <circle cx="18.6" cy="16.4" r="1.7" fill="currentColor" opacity="0.55" />
        </svg>
    );
}

export function Logo({ className }: { className?: string }) {
    return (
        <Link
            to="/"
            className={cn('flex items-center gap-2.5 text-[15px] font-medium tracking-[-0.01em]', className)}
        >
            <LogoMark />
            <span>{brand.productName}</span>
        </Link>
    );
}
