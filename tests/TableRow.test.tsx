/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint-disable react/button-has-type */
/* eslint-disable @typescript-eslint/no-explicit-any */

import './__mocks__/mui.mock';
import './__mocks__/nordic-shared.mock';
import '@testing-library/jest-dom';

import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

// Import the component under test
import Row, { EditRowWrapper, RowProps } from '../src/app/Components/TableRow';

// Completely suppress React validateDOMNesting warnings
const originalConsoleError = console.error;
beforeAll(() => {
    console.error = (...args) => {
        if (
            args[0] &&
            typeof args[0] === 'string' &&
            args[0].includes('validateDOMNesting')
        ) {
            // Do nothing, suppressing the validateDOMNesting warnings
            return;
        }
        originalConsoleError(...args);
    };
});

afterAll(() => {
    console.error = originalConsoleError; // Restore original console.error
});

describe('TableRow component', () => {
    // Test data
    const mockEditBox = ({
        element,
        open,
        onSave,
        onCancel,
    }: EditRowWrapper<any>) =>
        open ? (
            <div data-testid="edit-box">
                <input
                    data-testid="edit-input"
                    value={element.value || ''}
                    onChange={() => {
                        // Mock input change
                    }}
                />
                <button
                    data-testid="save-button"
                    onClick={() => onSave({ ...element, value: 'updated' })}
                >
                    Save
                </button>
                <button data-testid="cancel-button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        ) : null;

    const createRowProps = (
        isNew = false
    ): RowProps<{ id: number; value: string }> => ({
        cells: [
            'Cell 1',
            'Cell 2',
            true,
            <span key="custom-cell" data-testid="custom-cell">
                Custom Cell
            </span>,
        ],
        detailsBox: <div data-testid="details-box">Details Content</div>,
        updateValues: jest.fn(),
        editBox: mockEditBox,
        removeRow: jest.fn(),
        $: {
            id: 1,
            element: { id: 1, value: 'test' },
            isNew,
        },
    });

    let props: RowProps<{ id: number; value: string }>;

    beforeEach(() => {
        props = createRowProps();
        jest.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders correctly with basic props', () => {
        render(
            <table>
                <tbody>
                    <Row {...props} />
                </tbody>
            </table>
        );
        // Use getAllByRole since there are multiple rows
        const rows = screen.getAllByRole('row');
        expect(rows.length).toBeGreaterThan(0);
    });

    it('renders boolean cell as Toggle component', () => {
        render(
            <table>
                <tbody>
                    <Row {...props} />
                </tbody>
            </table>
        );
        // Find the Toggle component
        const toggle = screen.getByTestId('nrf-toggle');
        expect(toggle).toBeInTheDocument();
        expect(toggle.getAttribute('data-toggled')).toBe('true');
    });

    it('renders custom React element cells correctly', () => {
        render(
            <table>
                <tbody>
                    <Row {...props} />
                </tbody>
            </table>
        );

        // Find the custom cell
        const customCell = screen.getByTestId('custom-cell');
        expect(customCell).toBeInTheDocument();
        expect(customCell.textContent).toBe('Custom Cell');
    });

    it('expands details when expand button is clicked', () => {
        render(
            <table>
                <tbody>
                    <Row {...props} />
                </tbody>
            </table>
        );

        // Initially details should not be visible
        expect(screen.queryByTestId('details-box')).not.toBeInTheDocument();

        // Click the expand button (first button in the row)
        const expandButton = screen.getByLabelText('expand row');
        fireEvent.click(expandButton);

        // Now details should be visible
        expect(screen.getByTestId('details-box')).toBeInTheDocument();
        expect(screen.getByTestId('details-box').textContent).toBe(
            'Details Content'
        );
    });

    it('opens edit box when edit button is clicked', () => {
        render(
            <table>
                <tbody>
                    <Row {...props} />
                </tbody>
            </table>
        );

        // Initially edit box should not be visible
        expect(screen.queryByTestId('edit-box')).not.toBeInTheDocument();

        // Click the edit button
        const editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        // Now edit box should be visible
        expect(screen.getByTestId('edit-box')).toBeInTheDocument();
        expect(screen.getByTestId('edit-input')).toBeInTheDocument();
    });

    it('calls updateValues when edit is saved', () => {
        render(
            <table>
                <tbody>
                    <Row {...props} />
                </tbody>
            </table>
        );

        // Open the edit box
        const editButton = screen.getByLabelText('edit');
        fireEvent.click(editButton);

        // Click save button in the edit box
        const saveButton = screen.getByTestId('save-button');
        fireEvent.click(saveButton);

        // Check if updateValues was called with the correct arguments
        expect(props.updateValues).toHaveBeenCalledTimes(1);
        expect(props.updateValues).toHaveBeenCalledWith(1, {
            id: 1,
            value: 'updated',
        });
    });

    it('calls removeRow when delete is confirmed', () => {
        render(
            <table>
                <tbody>
                    <Row {...props} />
                </tbody>
            </table>
        );

        // Click the delete button to open confirmation popover
        const deleteButton = screen.getByLabelText('remove');
        fireEvent.click(deleteButton);

        // Confirmation message should be displayed
        expect(
            screen.getByText('Are you sure you want to delete this row?')
        ).toBeInTheDocument();

        // Find all buttons in the document
        const buttons = screen.getAllByRole('button');

        // Find the confirm button by looking at the last button in the popover
        // This is more reliable than trying to query by icon
        const confirmButton = buttons[buttons.length - 1];
        fireEvent.click(confirmButton);

        // Check if removeRow was called with the correct argument
        expect(props.removeRow).toHaveBeenCalledTimes(1);
        expect(props.removeRow).toHaveBeenCalledWith(1);
    });

    it('automatically opens edit box for new rows', () => {
        // Create props with isNew = true
        const newRowProps = createRowProps(true);

        render(
            <table>
                <tbody>
                    <Row {...newRowProps} />
                </tbody>
            </table>
        );

        // Edit box should be automatically visible for new rows
        expect(screen.getByTestId('edit-box')).toBeInTheDocument();
    });

    it('calls removeRow when canceling a new row', () => {
        // Create props with isNew = true
        const newRowProps = createRowProps(true);

        render(
            <table>
                <tbody>
                    <Row {...newRowProps} />
                </tbody>
            </table>
        );

        // Click cancel button in the edit box
        const cancelButton = screen.getByTestId('cancel-button');
        fireEvent.click(cancelButton);

        // Check if removeRow was called with the correct argument
        expect(newRowProps.removeRow).toHaveBeenCalledTimes(1);
        expect(newRowProps.removeRow).toHaveBeenCalledWith(1);
    });
});
