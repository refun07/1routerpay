import { useState } from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Tabs } from '@/components/ui/Tabs';

function Harness() {
    const [active, setActive] = useState('curl');

    return (
        <Tabs
            label="Language"
            activeId={active}
            onChange={setActive}
            items={[
                { id: 'curl', label: 'cURL', panel: <p>curl example</p> },
                { id: 'js', label: 'JavaScript', panel: <p>js example</p> },
                { id: 'php', label: 'PHP', panel: <p>php example</p> },
            ]}
        />
    );
}

describe('Tabs', () => {
    it('exposes a labelled tablist with one selected tab', () => {
        render(<Harness />);

        expect(screen.getByRole('tablist', { name: 'Language' })).toBeInTheDocument();
        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent('cURL');
        expect(screen.getByRole('tabpanel')).toHaveTextContent('curl example');
    });

    it('switches panels on click', async () => {
        render(<Harness />);

        await userEvent.click(screen.getByRole('tab', { name: 'PHP' }));

        expect(screen.getByRole('tabpanel')).toHaveTextContent('php example');
    });

    it('moves between tabs with arrow keys and wraps at the ends', async () => {
        render(<Harness />);

        await userEvent.tab();
        expect(screen.getByRole('tab', { name: 'cURL' })).toHaveFocus();

        await userEvent.keyboard('{ArrowRight}');
        expect(screen.getByRole('tab', { name: 'JavaScript' })).toHaveFocus();
        expect(screen.getByRole('tabpanel')).toHaveTextContent('js example');

        await userEvent.keyboard('{ArrowLeft}{ArrowLeft}');
        expect(screen.getByRole('tab', { name: 'PHP' })).toHaveFocus();
    });

    it('keeps only the active tab in the tab order', () => {
        render(<Harness />);

        expect(screen.getByRole('tab', { name: 'cURL' })).toHaveAttribute('tabindex', '0');
        expect(screen.getByRole('tab', { name: 'PHP' })).toHaveAttribute('tabindex', '-1');
    });
});
