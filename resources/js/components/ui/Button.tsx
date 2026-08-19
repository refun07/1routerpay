import { Link } from 'react-router-dom';
import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'link';
type Size = 'sm' | 'md' | 'lg';

const VARIANTS: Record<Variant, string> = {
    primary:
        'bg-brand text-background hover:bg-brand-hover active:bg-brand-dark font-medium shadow-[0_0_0_1px_rgba(223,254,82,0.2)]',
    secondary:
        'bg-surface-raised text-text-primary border border-border-subtle hover:border-border-strong hover:bg-surface-soft',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-raised',
    link: 'text-text-primary hover:text-brand underline-offset-4 px-0',
};

const SIZES: Record<Size, string> = {
    sm: 'h-9 px-3 text-sm rounded-lg',
    md: 'h-11 px-4 text-sm rounded-[10px]',
    lg: 'h-12 px-5 text-[15px] rounded-[10px]',
};

type BaseProps = {
    variant?: Variant;
    size?: Size;
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    children: ReactNode;
    className?: string;
};

function classes({ variant = 'primary', size = 'md', className }: BaseProps): string {
    return cn(
        'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors duration-200',
        'disabled:pointer-events-none disabled:opacity-50',
        VARIANTS[variant],
        variant === 'link' ? 'h-auto' : SIZES[size],
        className,
    );
}

function content({ icon, iconPosition = 'right', children }: BaseProps) {
    return (
        <>
            {icon && iconPosition === 'left' ? icon : null}
            {children}
            {icon && iconPosition === 'right' ? icon : null}
        </>
    );
}

export function Button(props: BaseProps & Omit<ComponentProps<'button'>, keyof BaseProps>) {
    const { variant, size, icon, iconPosition, children, className, ...rest } = props;

    return (
        <button className={classes(props)} {...rest}>
            {content(props)}
        </button>
    );
}

export function ButtonLink(
    props: BaseProps & { to: string } & Omit<ComponentProps<typeof Link>, keyof BaseProps | 'to'>,
) {
    const { variant, size, icon, iconPosition, children, className, to, ...rest } = props;

    // External links and hash targets bypass the client router.
    if (/^(https?:|mailto:|#)/.test(to)) {
        return (
            <a href={to} className={classes(props)} {...(rest as ComponentProps<'a'>)}>
                {content(props)}
            </a>
        );
    }

    return (
        <Link to={to} className={classes(props)} {...rest}>
            {content(props)}
        </Link>
    );
}
