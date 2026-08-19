import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { CodeBlock } from '@/components/developer/CodeBlock';
import { CREATE_PAYMENT_SNIPPETS } from '@/lib/snippets';

const CODE = 'curl https://api.example.com/v1/payments';

describe('CodeBlock', () => {
    it('copies the exact source, not the highlighted markup', async () => {
        const writeText = vi.fn().mockResolvedValue(undefined);
        Object.assign(navigator, { clipboard: { writeText } });

        render(<CodeBlock code={CODE} language="bash" label="cURL example" />);

        await userEvent.click(screen.getByRole('button', { name: 'Copy cURL example' }));

        expect(writeText).toHaveBeenCalledWith(CODE);
        expect(await screen.findByRole('button', { name: 'cURL example copied' })).toBeInTheDocument();
    });

    it('keeps the snippet reachable by keyboard', () => {
        render(<CodeBlock code={CODE} language="bash" label="cURL example" />);

        expect(document.querySelector('pre')).toHaveAttribute('tabindex', '0');
    });
});

describe('example snippets', () => {
    it('contain no real credentials', () => {
        for (const snippet of CREATE_PAYMENT_SNIPPETS) {
            expect(snippet.code).not.toMatch(/pr_live_(?!x)[A-Za-z0-9]{6,}/);
            expect(snippet.code).not.toMatch(/pr_test_(?!x)[A-Za-z0-9]{6,}/);
        }
    });
});
