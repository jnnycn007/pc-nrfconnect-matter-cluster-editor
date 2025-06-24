/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import '@testing-library/jest-dom';
import './__mocks__/nordic-shared.mock';

import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

// Import the component
import NameBar from '../src/app/Components/NameBar/NameBar';

/**
 * @jest-environment jsdom
 */

describe('NameBar component', () => {
    // Setup test variables
    const testName = 'Test Device';
    const onChangeMock = jest.fn();

    // Clean up after each test
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('renders with the provided name', () => {
        render(<NameBar name={testName} onChange={onChangeMock} />);

        const input = screen.getByTestId('nrf-inline-input');
        expect(input).toBeInTheDocument();
        expect(input).toHaveValue(testName);
        expect(input).toHaveClass('NameBar');
    });

    it('calls onChange when the name is edited', () => {
        render(<NameBar name={testName} onChange={onChangeMock} />);

        const input = screen.getByTestId('nrf-inline-input');
        const newName = 'Updated Device';

        // Simulate a direct change to the input value instead of typing
        fireEvent.change(input, { target: { value: newName } });
        // Fire the onChange directly
        input.dispatchEvent(new Event('change', { bubbles: true }));
        // Need to manually set the value since we're triggering the event directly
        Object.defineProperty(input, 'value', {
            value: newName,
            writable: true,
        });
        // Now dispatch the change event with the value
        input.dispatchEvent(
            new InputEvent('input', { bubbles: true, data: newName })
        );
        // Fire onChange again to ensure handlers are called
        input.dispatchEvent(new Event('change', { bubbles: true }));

        // Check if onChange was called with the new value at least once
        expect(onChangeMock).toHaveBeenCalledWith(newName);
    });

    it('renders children components when provided', () => {
        render(
            <NameBar name={testName} onChange={onChangeMock}>
                <button data-testid="child-button" type="button">
                    Click me
                </button>
            </NameBar>
        );

        const input = screen.getByTestId('nrf-inline-input');
        const button = screen.getByTestId('child-button');

        expect(input).toBeInTheDocument();
        expect(button).toBeInTheDocument();
        expect(button).toHaveTextContent('Click me');
    });

    it('applies the correct className to the InlineInput', () => {
        render(<NameBar name={testName} onChange={onChangeMock} />);

        const input = screen.getByTestId('nrf-inline-input');
        expect(input).toHaveClass('NameBar');
    });

    it('handles empty name input correctly', () => {
        render(<NameBar name="" onChange={onChangeMock} />);

        const input = screen.getByTestId('nrf-inline-input');
        expect(input).toHaveValue('');
    });

    it('handles complex child components', () => {
        render(
            <NameBar name={testName} onChange={onChangeMock}>
                <div data-testid="complex-children">
                    <button
                        data-testid="nested-button-1"
                        onClick={() => {}}
                        type="button"
                    >
                        Button 1
                    </button>
                    <button
                        data-testid="nested-button-2"
                        onClick={() => {}}
                        type="button"
                    >
                        Button 2
                    </button>
                </div>
            </NameBar>
        );

        expect(screen.getByTestId('complex-children')).toBeInTheDocument();
        expect(screen.getByTestId('nested-button-1')).toBeInTheDocument();
        expect(screen.getByTestId('nested-button-2')).toBeInTheDocument();
    });

    it('updates when name prop changes', () => {
        const { rerender } = render(
            <NameBar name={testName} onChange={onChangeMock} />
        );

        let input = screen.getByTestId('nrf-inline-input');
        expect(input).toHaveValue(testName);

        // Update the component with a new name
        const updatedName = 'New Device Name';
        rerender(<NameBar name={updatedName} onChange={onChangeMock} />);

        input = screen.getByTestId('nrf-inline-input');
        expect(input).toHaveValue(updatedName);
    });
});
