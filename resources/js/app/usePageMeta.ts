import { useEffect } from 'react';

/**
 * Keeps the document title/description in sync during client-side navigation.
 * The first render always gets its metadata server-side from Laravel, so this
 * only covers subsequent in-app route changes.
 */
export function usePageMeta(title: string, description?: string) {
    useEffect(() => {
        document.title = title;

        if (!description) return;
        document.querySelector('meta[name="description"]')?.setAttribute('content', description);
    }, [title, description]);
}
