import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Accordion } from '@/components/ui/Accordion';

const ITEMS = [
    { title: 'What is payment orchestration?', content: 'A layer between your app and providers.' },
    { title: 'Is it a payment gateway?', content: 'It is an orchestration layer.' },
];

describe('Accordion', () => {
    it('opens the first item and hides the rest', () => {
        render(<Accordion items={ITEMS} />);

        expect(screen.getByRole('button', { name: ITEMS[0].title })).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('button', { name: ITEMS[1].title })).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByText(ITEMS[0].content)).toBeVisible();
        expect(screen.queryByText(ITEMS[1].content)).not.toBeVisible();
    });

    it('opens a panel by keyboard and closes the previous one', async () => {
        render(<Accordion items={ITEMS} />);

        const second = screen.getByRole('button', { name: ITEMS[1].title });
        second.focus();
        await userEvent.keyboard('{Enter}');

        expect(second).toHaveAttribute('aria-expanded', 'true');
        expect(screen.getByRole('button', { name: ITEMS[0].title })).toHaveAttribute('aria-expanded', 'false');
        expect(screen.getByText(ITEMS[1].content)).toBeVisible();
    });

    it('links each panel back to its header', async () => {
        render(<Accordion items={ITEMS} />);

        const header = screen.getByRole('button', { name: ITEMS[0].title });
        const region = screen.getByRole('region', { name: ITEMS[0].title });

        expect(header.getAttribute('aria-controls')).toBe(region.id);
    });
});
