import { useId, useRef, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type TabItem = {
    id: string;
    label: string;
    panel: ReactNode;
};

/**
 * WAI-ARIA tabs with roving focus: Left/Right move between tabs, Home/End jump
 * to the ends, and only the active tab is in the tab order.
 */
export function Tabs({
    items,
    activeId,
    onChange,
    label,
    className,
    tabsClassName,
}: {
    items: TabItem[];
    activeId: string;
    onChange: (id: string) => void;
    label: string;
    className?: string;
    tabsClassName?: string;
}) {
    const baseId = useId();
    const listRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
        if (!keys.includes(event.key)) return;

        event.preventDefault();
        const index = items.findIndex((item) => item.id === activeId);

        const next =
            event.key === 'ArrowLeft'
                ? (index - 1 + items.length) % items.length
                : event.key === 'ArrowRight'
                  ? (index + 1) % items.length
                  : event.key === 'Home'
                    ? 0
                    : items.length - 1;

        onChange(items[next].id);
        listRef.current
            ?.querySelector<HTMLButtonElement>(`#${CSS.escape(`${baseId}-tab-${items[next].id}`)}`)
            ?.focus();
    };

    const active = items.find((item) => item.id === activeId) ?? items[0];

    return (
        <div className={className}>
            <div
                ref={listRef}
                role="tablist"
                aria-label={label}
                onKeyDown={handleKeyDown}
                className={cn('flex items-center gap-1', tabsClassName)}
            >
                {items.map((item) => {
                    const selected = item.id === active.id;

                    return (
                        <button
                            key={item.id}
                            id={`${baseId}-tab-${item.id}`}
                            role="tab"
                            type="button"
                            aria-selected={selected}
                            aria-controls={item.panel !== null ? `${baseId}-panel-${item.id}` : undefined}
                            tabIndex={selected ? 0 : -1}
                            onClick={() => onChange(item.id)}
                            className={cn(
                                'rounded-md px-3 py-1.5 font-mono text-xs transition-colors duration-200',
                                selected
                                    ? 'bg-surface-soft text-text-primary'
                                    : 'text-text-muted hover:text-text-secondary',
                            )}
                        >
                            {item.label}
                        </button>
                    );
                })}
            </div>

            {/* Callers that render the panel themselves pass `panel: null`. */}
            {active.panel !== null && (
                <div
                    id={`${baseId}-panel-${active.id}`}
                    role="tabpanel"
                    aria-labelledby={`${baseId}-tab-${active.id}`}
                    tabIndex={0}
                    className="mt-3 focus-visible:outline-2 focus-visible:outline-brand"
                >
                    {active.panel}
                </div>
            )}
        </div>
    );
}
