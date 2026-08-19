import { useEffect, useRef } from 'react';

/**
 * Reveals an element on scroll with a very small translate.
 * Under `prefers-reduced-motion` the element is simply visible from the start.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
    const ref = useRef<T>(null);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (reducedMotion || !('IntersectionObserver' in window)) {
            node.dataset.visible = 'true';
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        (entry.target as HTMLElement).dataset.visible = 'true';
                        observer.unobserve(entry.target);
                    }
                });
            },
            { rootMargin: '0px 0px -8% 0px', threshold: 0.05 },
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return ref;
}
