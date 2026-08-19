import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/** Client-side navigation should behave like a page load, minus the reload. */
export function ScrollToTop() {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        if (hash) {
            document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' });
            return;
        }
        window.scrollTo({ top: 0 });
    }, [pathname, hash]);

    return null;
}
