/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

import '@testing-library/jest-dom';

import React from 'react';
import { render } from '@testing-library/react';

// Directly import the component without mocks
import ClusterTable from '../src/app/Components/Table';
import { EditRowWrapper, RowProps } from '../src/app/Components/TableRow';

// Reset all mocks to ensure we test the actual implementation
jest.unmock('../src/app/Components/Table');

describe('ClusterTable Validation', () => {
    // Define test data
    const mockEditBox = ({
        element,
        open,
        onSave,
        onCancel,
    }: EditRowWrapper<any>) =>
        open ? (
            <div>
                <button type="button" onClick={() => onSave(element)}>
                    Save
                </button>
                <button type="button" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        ) : null;

    const createMockRows = (count: number, cellCount: number): RowProps[] =>
        Array.from({ length: count }, (_, i) => ({
            cells: Array.from({ length: cellCount }, j => `Cell ${i}-${j}`),
            detailsBox: <div>Details for row {i}</div>,
            updateValues: jest.fn(),
            editBox: mockEditBox,
            removeRow: jest.fn(),
            $: {
                id: i,
                element: { id: i, value: `test-${i}` },
            },
        }));

    const mockName = 'Validation Test Table';
    const mockAddRow = jest.fn();

    it('should throw an error when headers length does not match cells length', () => {
        // Set up mismatched headers and rows
        const mockHeaders = ['Header 1', 'Header 2'];
        const invalidRows = createMockRows(2, 3); // 3 cells per row, but only 2 headers

        // Test that the error is thrown
        expect(() => {
            render(
                ClusterTable(mockName, mockHeaders, invalidRows, mockAddRow)
            );
        }).toThrow(
            `Headers length does not match the number of cells in rows for table: ${mockName}`
        );
    });

    it('should render correctly when headers length matches cells length', () => {
        // Set up matching headers and rows
        const mockHeaders = ['Header 1', 'Header 2', 'Header 3'];
        const validRows = createMockRows(2, 3); // 3 cells per row, 3 headers

        // This should not throw
        expect(() => {
            render(ClusterTable(mockName, mockHeaders, validRows, mockAddRow));
        }).not.toThrow();
    });
});
