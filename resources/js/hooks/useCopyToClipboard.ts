import { useCallback, useEffect, useRef, useState } from 'react';

export function useCopyToClipboard(resetAfter = 2000) {
    const [copied, setCopied] = useState(false);
    const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);

    useEffect(() => () => clearTimeout(timeout.current), []);

    const copy = useCallback(
        async (value: string) => {
            try {
                await navigator.clipboard.writeText(value);
            } catch {
                // Clipboard API can be blocked; fall back to a temporary selection.
                const area = document.createElement('textarea');
                area.value = value;
                area.setAttribute('readonly', '');
                area.style.position = 'fixed';
                area.style.opacity = '0';
                document.body.appendChild(area);
                area.select();
                document.execCommand('copy');
                document.body.removeChild(area);
            }

            setCopied(true);
            clearTimeout(timeout.current);
            timeout.current = setTimeout(() => setCopied(false), resetAfter);
        },
        [resetAfter],
    );

    return { copied, copy };
}
