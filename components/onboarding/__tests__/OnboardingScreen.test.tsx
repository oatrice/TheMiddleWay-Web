import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { OnboardingScreen } from '../OnboardingScreen';
import '@testing-library/jest-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock next/image
vi.mock('next/image', () => ({
    __esModule: true,
    default: (props: any) => {
        // eslint-disable-next-line @next/next/no-img-element
        return <img {...props} alt={props.alt} />;
    },
}));

// Mock Lucide icons
vi.mock('lucide-react', () => ({
    ArrowRight: () => <div data-testid="arrow-right" />,
    Check: () => <div data-testid="check" />,
}));

describe('OnboardingScreen', () => {
    const mockOnComplete = vi.fn();
    const mockSlides = [
        {
            id: "1",
            title: "Slide 1",
            body: "Body 1",
            image: "/img1.png",
        },
        {
            id: "2",
            title: "Slide 2",
            body: "Body 2",
            image: "/img2.png",
            isFinal: true,
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the first slide correctly', () => {
        render(<OnboardingScreen onComplete={mockOnComplete} slides={mockSlides} />);
        expect(screen.getByText('Slide 1')).toBeInTheDocument();
        expect(screen.getByText('Body 1')).toBeInTheDocument();
    });

    it('navigates to next slide on click', async () => {
        render(<OnboardingScreen onComplete={mockOnComplete} slides={mockSlides} />);

        fireEvent.click(screen.getByText('Next'));

        expect(await screen.findByText('Slide 2')).toBeInTheDocument();
    });

    it('calls onComplete when clicking finish on last slide', async () => {
        render(<OnboardingScreen onComplete={mockOnComplete} slides={mockSlides} />);

        // Go to last slide
        fireEvent.click(screen.getByText('Next'));

        // Wait for transition
        const finishButton = await screen.findByText('Begin Your Journey');
        fireEvent.click(finishButton);

        expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it('calls onComplete when clicking Skip on first slide', () => {
        render(<OnboardingScreen onComplete={mockOnComplete} slides={mockSlides} />);

        fireEvent.click(screen.getByText('Skip'));

        expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });

    it('handles empty slides array safely', () => {
        const { container } = render(<OnboardingScreen onComplete={mockOnComplete} slides={[]} />);
        expect(container).toBeEmptyDOMElement();
        expect(mockOnComplete).not.toHaveBeenCalled();
    });

    it('calls onComplete only once on rapid clicks on final slide', async () => {
        render(<OnboardingScreen onComplete={mockOnComplete} slides={mockSlides} />);

        // Go to last slide
        fireEvent.click(screen.getByText('Next'));

        const finishButton = await screen.findByText('Begin Your Journey');

        // Click multiple times rapidly
        fireEvent.click(finishButton);
        fireEvent.click(finishButton);
        fireEvent.click(finishButton);

        expect(mockOnComplete).toHaveBeenCalledTimes(1);
    });
});
