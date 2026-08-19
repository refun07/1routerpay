import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';

export type AccordionItem = {
    title: string;
    content: string;
};

/**
 * Disclosure-pattern accordion. Each header is a real button with
 * `aria-expanded` / `aria-controls`, and closed panels are removed from the
 * accessibility tree via `hidden`.
 */
export function Accordion({ items, className }: { items: AccordionItem[]; className?: string }) {
    const baseId = useId();
    const [open, setOpen] = useState<number | null>(0);

    return (
        <div className={cn('divide-y divide-border-subtle border-y border-border-subtle', className)}>
            {items.map((item, index) => {
                const expanded = open === index;

                return (
                    <div key={item.title}>
                        <h3>
                            <button
                                type="button"
                                id={`${baseId}-header-${index}`}
                                aria-expanded={expanded}
                                aria-controls={`${baseId}-panel-${index}`}
                                onClick={() => setOpen(expanded ? null : index)}
                                className="flex w-full items-center justify-between gap-6 py-5 text-left transition-colors duration-200 hover:text-brand"
                            >
                                <span className="text-[15px] font-medium sm:text-base">{item.title}</span>
                                <ChevronDown
                                    aria-hidden="true"
                                    className={cn(
                                        'size-4 shrink-0 text-text-muted transition-transform duration-200',
                                        expanded && 'rotate-180 text-brand',
                                    )}
                                />
                            </button>
                        </h3>

                        <div
                            id={`${baseId}-panel-${index}`}
                            role="region"
                            aria-labelledby={`${baseId}-header-${index}`}
                            hidden={!expanded}
                            className="pb-5 pr-10"
                        >
                            <p className="max-w-[68ch] text-[15px] leading-relaxed text-text-secondary">
                                {item.content}
                            </p>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
