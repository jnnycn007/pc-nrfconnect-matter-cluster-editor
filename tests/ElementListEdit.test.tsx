/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

// Replace triple-slash references with imports
import '@testing-library/jest-dom';
import './__mocks__/component.mock';
import './__mocks__/mui.mock';
import './__mocks__/nordic-shared.mock';
import './__mocks__/mui-icons.mock';

import React from 'react';
import {
    cleanup,
    fireEvent,
    render,
    screen,
    within,
} from '@testing-library/react';

// Import the component
import ElementListEdit from '../src/app/Components/Edit/ElementListEdit';

/**
 * @jest-environment jsdom
 */

describe('ElementListEdit component', () => {
    // Setup test data
    const testElement = { testArray: ['Item 1', 'Item 2', 'Item 3'] };
    const onElementChangeMock = jest.fn();

    // Clean up after each test
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('renders with correct badge count', () => {
        render(
            <ElementListEdit
                element={testElement}
                onElementChange={onElementChangeMock}
                arrayName="testArray"
                buttonLabel="Edit Items"
            />
        );

        const button = screen.getByTestId('inner-button');
        expect(button).toBeInTheDocument();
        expect(button).toHaveAttribute('data-badge-content', '3');
        expect(button).toHaveAttribute('data-label', 'Edit Items');
    });

    it('opens dialog when button is clicked', () => {
        render(
            <ElementListEdit
                element={testElement}
                onElementChange={onElementChangeMock}
                arrayName="testArray"
                buttonLabel="Edit Items"
            />
        );

        const button = screen.getByTestId('inner-button');

        // Click the button
        fireEvent.click(button);

        // Check if dialog is open
        const dialog = screen.getByTestId('nrf-dialog');
        expect(dialog).toHaveAttribute('data-visible', 'true');
    });

    it('displays list items from the array', () => {
        render(
            <ElementListEdit
                element={testElement}
                onElementChange={onElementChangeMock}
                arrayName="testArray"
                buttonLabel="Edit Items"
            />
        );

        // Open dialog
        fireEvent.click(screen.getByTestId('inner-button'));

        // Check if all items are displayed
        const inputs = screen.getAllByTestId('text-input-field');
        expect(inputs).toHaveLength(3);
        expect(inputs[0]).toHaveAttribute('data-value', 'Item 1');
        expect(inputs[1]).toHaveAttribute('data-value', 'Item 2');
        expect(inputs[2]).toHaveAttribute('data-value', 'Item 3');
    });

    it('saves changes when save button is clicked', () => {
        render(
            <ElementListEdit
                element={testElement}
                onElementChange={onElementChangeMock}
                arrayName="testArray"
                buttonLabel="Edit Items"
            />
        );

        // Open dialog
        fireEvent.click(screen.getByTestId('inner-button'));

        // Find Save button and click it
        const saveButton = screen.getByText('Save');

        if (saveButton) {
            fireEvent.click(saveButton);
        }

        // Should save the existing array values
        expect(onElementChangeMock).toHaveBeenCalledWith('testArray', [
            'Item 1',
            'Item 2',
            'Item 3',
        ]);

        // Dialog should close
        const dialog = screen.getByTestId('nrf-dialog');
        expect(dialog).toHaveAttribute('data-visible', 'false');
    });

    it('adds new items when add button is clicked', () => {
        render(
            <ElementListEdit
                element={testElement}
                onElementChange={onElementChangeMock}
                arrayName="testArray"
                buttonLabel="Edit Items"
            />
        );

        // Open dialog
        fireEvent.click(screen.getByTestId('inner-button'));

        // Initial count
        const initialInputs = screen.getAllByTestId('text-input-field').length;

        // Find the Add button by finding an icon-button with the primary color and add-icon inside
        const dialogContent = screen.getByTestId('mui-dialog-content');
        const buttons = within(dialogContent).getAllByTestId('mui-icon-button');
        const addButton = buttons.find(
            (button: HTMLElement) =>
                button.getAttribute('data-color') === 'primary' &&
                within(button).queryByTestId('add-icon')
        );

        if (!addButton) {
            throw new Error('Add button not found');
        }

        // Click add button
        fireEvent.click(addButton);

        // Should have one more input
        const newInputs = screen.getAllByTestId('text-input-field');
        expect(newInputs.length).toBe(initialInputs + 1);
        expect(newInputs[newInputs.length - 1]).toHaveAttribute(
            'data-value',
            ''
        );
    });
});
