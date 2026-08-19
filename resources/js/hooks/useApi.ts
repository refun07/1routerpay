import { useCallback, useEffect, useState } from 'react';

type State<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
};

/**
 * Minimal request hook giving every public data surface an explicit
 * loading / error / empty state, as required by the definition of done.
 */
export function useApi<T>(fetcher: () => Promise<T>, deps: unknown[] = []) {
    const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });

    // The fetcher is intentionally keyed by caller-supplied deps.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const run = useCallback(fetcher, deps);

    const load = useCallback(() => {
        let active = true;
        setState((previous) => ({ ...previous, loading: true, error: null }));

        run()
            .then((data) => active && setState({ data, loading: false, error: null }))
            .catch((error: Error) =>
                active && setState({ data: null, loading: false, error: error.message }),
            );

        return () => {
            active = false;
        };
    }, [run]);

    useEffect(load, [load]);

    return { ...state, reload: load };
}
