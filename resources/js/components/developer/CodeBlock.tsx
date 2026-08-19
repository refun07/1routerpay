import { Check, Copy } from 'lucide-react';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { highlight, type Language } from '@/lib/highlight';
import { track } from '@/lib/analytics';
import { cn } from '@/lib/cn';

export function CodeBlock({
    code,
    language,
    label,
    className,
    copyable = true,
    maxHeight,
}: {
    code: string;
    language: Language;
    /** Used for the copy button's accessible name. */
    label: string;
    className?: string;
    copyable?: boolean;
    maxHeight?: string;
}) {
    const { copied, copy } = useCopyToClipboard();

    const onCopy = () => {
        void copy(code);
        track('code_copied', { language });
    };

    return (
        <div className={cn('group relative', className)}>
            {copyable && (
                <button
                    type="button"
                    onClick={onCopy}
                    aria-label={copied ? `${label} copied` : `Copy ${label}`}
                    className="absolute right-2 top-2 z-10 inline-flex size-8 items-center justify-center rounded-md border border-border-subtle bg-surface-raised text-text-muted transition-colors duration-200 hover:border-border-strong hover:text-text-primary"
                >
                    {copied ? (
                        <Check className="size-3.5 text-success" aria-hidden="true" />
                    ) : (
                        <Copy className="size-3.5" aria-hidden="true" />
                    )}
                </button>
            )}

            {/* tabIndex makes long snippets reachable and scrollable by keyboard. */}
            <pre
                tabIndex={0}
                style={maxHeight ? { maxHeight } : undefined}
                className="overflow-auto p-4 pr-12 font-mono text-[12.5px] leading-[1.7] text-text-secondary sm:text-[13px]"
            >
                <code>{highlight(code, language)}</code>
            </pre>

            <span aria-live="polite" className="sr-only">
                {copied ? `${label} copied to clipboard` : ''}
            </span>
        </div>
    );
}
