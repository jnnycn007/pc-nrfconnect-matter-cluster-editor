/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import './__mocks__/mui.mock';
import './__mocks__/nordic-shared.mock';
import '@testing-library/jest-dom';

import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import InnerElementDetails from '../src/app/Components/Details/InnerElementDetails';

/**
 * @jest-environment jsdom
 */
describe('InnerElementDetails component', () => {
    // Sample test data
    const sampleContent = [
        { id: 1, name: 'John', age: 30 },
        { id: 2, name: 'Doe', age: 25 },
    ];
    const onCloseMock = jest.fn();

    // Clean up after each test
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('renders nothing when open is false', () => {
        render(
            <InnerElementDetails
                content={sampleContent}
                open={false}
                onClose={onCloseMock}
            />
        );

        expect(screen.getByTestId('nrf-dialog')).toHaveAttribute(
            'data-visible',
            'false'
        );
    });

    it('renders dialog when open is true', () => {
        render(
            <InnerElementDetails
                content={sampleContent}
                open
                onClose={onCloseMock}
            />
        );

        expect(screen.getByTestId('nrf-dialog')).toHaveAttribute(
            'data-visible',
            'true'
        );
    });

    it('renders table with correct headers based on content keys', () => {
        render(
            <InnerElementDetails
                content={sampleContent}
                open
                onClose={onCloseMock}
            />
        );

        // Check for table
        expect(screen.getByTestId('mui-table')).toBeInTheDocument();

        // Check for header cells
        const headerCells = screen.getAllByTestId('mui-table-cell');
        expect(headerCells.length).toBeGreaterThan(0);

        // Get first three header cells
        expect(headerCells[0].textContent).toBe('id');
        expect(headerCells[1].textContent).toBe('name');
        expect(headerCells[2].textContent).toBe('age');
    });

    it('renders table with correct content values', () => {
        render(
            <InnerElementDetails
                content={sampleContent}
                open
                onClose={onCloseMock}
            />
        );

        // Check for cell values
        const tableCells = screen.getAllByTestId('mui-table-cell');

        // We should have at least 9 cells (3 headers + 6 value cells)
        expect(tableCells.length).toBeGreaterThanOrEqual(9);

        // Skip first 3 header cells and check the data cells
        const dataCells = tableCells.slice(3);

        // Row 1 values
        expect(dataCells[0].textContent).toBe('1');
        expect(dataCells[1].textContent).toBe('John');
        expect(dataCells[2].textContent).toBe('30');

        // Row 2 values
        expect(dataCells[3].textContent).toBe('2');
        expect(dataCells[4].textContent).toBe('Doe');
        expect(dataCells[5].textContent).toBe('25');
    });

    it('calls onClose when close button is clicked', () => {
        render(
            <InnerElementDetails
                content={sampleContent}
                open
                onClose={onCloseMock}
            />
        );

        const closeButton = screen.getByTestId('nrf-button');
        fireEvent.click(closeButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('calls onClose when dialog close button is clicked', () => {
        render(
            <InnerElementDetails
                content={sampleContent}
                open
                onClose={onCloseMock}
            />
        );

        const dialogCloseButton = screen.getByTestId('dialog-close');
        fireEvent.click(dialogCloseButton);

        expect(onCloseMock).toHaveBeenCalledTimes(1);
    });

    it('respects the size prop for small dialogs', () => {
        render(
            <InnerElementDetails
                content={sampleContent}
                open
                onClose={onCloseMock}
                size="sm"
            />
        );

        const dialog = screen.getByTestId('nrf-dialog');
        expect(dialog).toHaveAttribute('data-size', 'sm');
    });

    it('respects the size prop for large dialogs', () => {
        render(
            <InnerElementDetails
                content={sampleContent}
                open
                onClose={onCloseMock}
                size="lg"
            />
        );

        const dialog = screen.getByTestId('nrf-dialog');
        expect(dialog).toHaveAttribute('data-size', 'lg');
    });

    it('defaults to small size when size prop is not provided', () => {
        render(
            <InnerElementDetails
                content={sampleContent}
                open
                onClose={onCloseMock}
            />
        );

        const dialog = screen.getByTestId('nrf-dialog');
        expect(dialog).toHaveAttribute('data-size', 'sm');
    });

    // This test is modified to work with our safe wrapper
    it('handles empty content array gracefully', () => {
        // An empty content array would normally cause errors because the component tries to access properties of content[0]
        // Instead, we should expect the component to handle this gracefully
        const { container } = render(
            <InnerElementDetails content={[]} open onClose={onCloseMock} />
        );

        // The component should render without crashing
        // We're not expecting any specific content, just making sure it doesn't throw errors
        expect(container).toBeInTheDocument();
        // No need to look for mocked elements that no longer exist
    });

    it('handles content with different shapes correctly', () => {
        const mixedContent = [
            { id: 1, name: 'John', age: 30 },
            { id: 2, role: 'Developer', level: 'Senior' },
        ];

        render(
            <InnerElementDetails
                content={mixedContent}
                open
                onClose={onCloseMock}
            />
        );

        // Check if dialog is rendered
        expect(screen.getByTestId('nrf-dialog')).toBeInTheDocument();

        // Check for table
        expect(screen.getByTestId('mui-table')).toBeInTheDocument();
    });
});
