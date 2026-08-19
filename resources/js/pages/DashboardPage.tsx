import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { AlertTriangle, Check, Copy, KeyRound } from 'lucide-react';
import { PageHeader } from '@/components/layout/PageHeader';
import { PageContainer } from '@/components/layout/PageContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Field, Input } from '@/components/ui/Input';
import { EmptyState, ErrorState, Skeleton } from '@/components/ui/AsyncState';
import { useAuth } from '@/app/AuthProvider';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
import { apiKeys, type ApiKeySummary } from '@/lib/auth-api';
import { ApiError } from '@/lib/api';
import { brand } from '@/lib/brand';
import { formatTime } from '@/lib/format';
import { cn } from '@/lib/cn';
import { usePageMeta } from '@/app/usePageMeta';

/** Shown once, immediately after creation. There is no way to see it again. */
function RevealedKey({ plaintext, onDismiss }: { plaintext: string; onDismiss: () => void }) {
    const { copied, copy } = useCopyToClipboard();

    return (
        <Card raised className="border-brand/40 p-5">
            <div className="flex items-start gap-3">
                <AlertTriangle aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
                <div className="min-w-0 flex-1">
                    <p className="text-[14px] font-medium">Copy this key now</p>
                    <p className="mt-1 text-[13px] leading-relaxed text-text-secondary">
                        We store only a hash, so this is the one and only time it can be shown. If you lose it,
                        revoke the key and create another.
                    </p>

                    <div className="mt-4 flex items-center gap-2 rounded-[10px] border border-border-subtle bg-background px-3 py-2.5">
                        <code className="min-w-0 flex-1 truncate font-mono text-[13px] text-brand">
                            {plaintext}
                        </code>
                        <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => void copy(plaintext)}
                            aria-label={copied ? 'API key copied' : 'Copy API key'}
                        >
                            {copied ? (
                                <Check aria-hidden="true" className="size-3.5 text-success" />
                            ) : (
                                <Copy aria-hidden="true" className="size-3.5" />
                            )}
                        </Button>
                    </div>

                    <Button variant="ghost" size="sm" className="mt-3" onClick={onDismiss}>
                        I have saved it
                    </Button>
                </div>
            </div>
        </Card>
    );
}

function KeyRow({ apiKey, onRevoke }: { apiKey: ApiKeySummary; onRevoke: (id: number) => void }) {
    const revoked = apiKey.revoked_at !== null;

    return (
        <li
            className={cn(
                'flex flex-wrap items-center justify-between gap-4 px-5 py-4',
                revoked && 'opacity-55',
            )}
        >
            <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[14px] font-medium">{apiKey.label}</p>
                    <Badge tone={apiKey.environment === 'live' ? 'brand' : 'neutral'} mono>
                        {apiKey.environment}
                    </Badge>
                    {revoked && <Badge tone="danger">Revoked</Badge>}
                </div>

                <p className="mt-1 font-mono text-[12px] text-text-muted">{apiKey.prefix}</p>

                <p className="mt-1 text-[12px] text-text-muted">
                    Created {formatTime(apiKey.created_at)} · Last used{' '}
                    {apiKey.last_used_at ? formatTime(apiKey.last_used_at) : 'never'}
                </p>
            </div>

            {!revoked && (
                <Button variant="secondary" size="sm" onClick={() => onRevoke(apiKey.id)}>
                    Revoke
                </Button>
            )}
        </li>
    );
}

export function DashboardPage() {
    usePageMeta(`Dashboard — ${brand.productName}`);

    const { user, loading: authLoading } = useAuth();

    const [keys, setKeys] = useState<ApiKeySummary[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [creating, setCreating] = useState(false);
    const [revealed, setRevealed] = useState<string | null>(null);
    const [formError, setFormError] = useState<string | null>(null);

    const load = useCallback(() => {
        apiKeys
            .list()
            .then((data) => {
                setKeys(data);
                setError(null);
            })
            .catch((cause: Error) => setError(cause.message));
    }, []);

    useEffect(() => {
        if (user) load();
    }, [user, load]);

    if (authLoading) {
        return (
            <PageContainer wide className="py-16">
                <Skeleton className="h-[160px]" />
            </PageContainer>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const onCreate = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setCreating(true);
        setFormError(null);

        const form = new FormData(event.currentTarget);

        try {
            const created = await apiKeys.create({
                label: String(form.get('label') ?? ''),
                environment: (form.get('environment') as 'test' | 'live') ?? 'test',
            });

            setRevealed(created.plaintext);
            (event.target as HTMLFormElement).reset();
            load();
        } catch (cause) {
            setFormError(
                cause instanceof ApiError
                    ? (Object.values(cause.errors)[0]?.[0] ?? cause.message)
                    : 'Could not create the key.',
            );
        } finally {
            setCreating(false);
        }
    };

    const onRevoke = async (id: number) => {
        await apiKeys.revoke(id).catch(() => null);
        load();
    };

    return (
        <>
            <PageHeader
                eyebrow={user.organization?.name ?? 'Dashboard'}
                title="API keys"
                description="Separate credentials for sandbox and production. Secrets are hashed at rest and shown once, at creation."
            />

            <PageContainer wide className="py-10 sm:py-12">
                <div className="grid gap-5 lg:grid-cols-[1fr_1.6fr] lg:items-start">
                    <Card className="p-6">
                        <div className="flex items-center gap-2.5">
                            <KeyRound aria-hidden="true" className="size-[18px] text-brand" />
                            <h2 className="text-[17px] font-medium">Create a key</h2>
                        </div>

                        <form onSubmit={onCreate} className="mt-5 space-y-4">
                            {formError && (
                                <p role="alert" className="rounded-[10px] border border-danger/30 bg-danger/10 px-3 py-2 text-[13px] text-danger">
                                    {formError}
                                </p>
                            )}

                            <Field label="Label" htmlFor="label" hint="What this key is for, e.g. “Checkout server”.">
                                <Input id="label" name="label" required maxLength={80} />
                            </Field>

                            <fieldset>
                                <legend className="mb-1.5 text-sm font-medium text-text-secondary">
                                    Environment
                                </legend>
                                <div className="flex gap-2">
                                    {(['test', 'live'] as const).map((environment, index) => (
                                        <label
                                            key={environment}
                                            className="flex flex-1 cursor-pointer items-center gap-2 rounded-[10px] border border-border-subtle bg-surface-raised px-3 py-2.5 text-[13.5px] transition-colors hover:border-border-strong has-[:checked]:border-brand/50 has-[:checked]:bg-brand/[0.07]"
                                        >
                                            <input
                                                type="radio"
                                                name="environment"
                                                value={environment}
                                                defaultChecked={index === 0}
                                                className="size-3.5 accent-brand"
                                            />
                                            <span className="font-mono">pr_{environment}_</span>
                                        </label>
                                    ))}
                                </div>
                            </fieldset>

                            <Button type="submit" className="w-full" disabled={creating}>
                                {creating ? 'Creating…' : 'Create key'}
                            </Button>
                        </form>
                    </Card>

                    <div className="space-y-5">
                        {revealed && <RevealedKey plaintext={revealed} onDismiss={() => setRevealed(null)} />}

                        <Card className="overflow-hidden">
                            <div className="border-b border-border-subtle bg-surface-raised/40 px-5 py-3">
                                <h2 className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-muted">
                                    Your keys
                                </h2>
                            </div>

                            {error ? (
                                <ErrorState message={error} onRetry={load} className="border-0" />
                            ) : keys === null ? (
                                <div className="p-5">
                                    <Skeleton className="h-20" />
                                </div>
                            ) : keys.length === 0 ? (
                                <EmptyState
                                    className="border-0"
                                    title="No keys yet"
                                    description="Create a sandbox key to make your first request."
                                />
                            ) : (
                                <ul className="divide-y divide-border-subtle">
                                    {keys.map((apiKey) => (
                                        <KeyRow key={apiKey.id} apiKey={apiKey} onRevoke={onRevoke} />
                                    ))}
                                </ul>
                            )}
                        </Card>
                    </div>
                </div>
            </PageContainer>
        </>
    );
}
