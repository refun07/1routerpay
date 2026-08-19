import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RoutingVisualizer } from '@/components/home/RoutingVisualizer';

describe('RoutingVisualizer', () => {
    it('starts in smart mode recommending Provider A', () => {
        render(<RoutingVisualizer />);

        expect(screen.getByRole('radio', { name: 'Smart' })).toBeChecked();
        expect(screen.getByText('Recommended').closest('li')).toHaveTextContent('Provider A');
    });

    it('moves the recommendation when the mode changes', async () => {
        render(<RoutingVisualizer />);

        await userEvent.click(screen.getByRole('radio', { name: 'Lowest Cost' }));

        expect(screen.getByRole('radio', { name: 'Lowest Cost' })).toBeChecked();
        expect(screen.getByRole('radio', { name: 'Smart' })).not.toBeChecked();
        expect(screen.getByText('Recommended').closest('li')).toHaveTextContent('Provider B');
    });

    it('never recommends a degraded provider', async () => {
        render(<RoutingVisualizer />);

        for (const mode of ['Smart', 'Lowest Cost', 'Highest Availability', 'Merchant Priority']) {
            await userEvent.click(screen.getByRole('radio', { name: mode }));
            expect(screen.getByText('Recommended').closest('li')).not.toHaveTextContent('Provider C');
        }
    });

    it('labels the demo as illustrative rather than live routing', () => {
        render(<RoutingVisualizer />);

        expect(screen.getByText(/Illustrative interface/i)).toBeInTheDocument();
    });
});
