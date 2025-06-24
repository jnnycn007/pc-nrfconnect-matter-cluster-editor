/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import '@testing-library/jest-dom';
import './__mocks__/component.mock';
import './__mocks__/mui.mock';

import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

import ListPropertiesDetails from '../src/app/Components/Details/ListPropertiesDetails';

/**
 * @jest-environment jsdom
 */
describe('ListPropertiesDetails component', () => {
    // Sample test data
    const sampleText = 'Test Items:';
    const sampleStringItems = ['Item 1', 'Item 2', 'Item 3'];
    const sampleNumberItems = [1, 2, 3];
    const sampleMixedItems = ['Item 1', 2, 'Item 3'];
    const sampleWithNullItems = ['Item 1', null, 'Item 3'];

    // Clean up after each test
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('renders with the correct text header', () => {
        render(
            <ListPropertiesDetails
                textToDisplay={sampleText}
                items={sampleStringItems}
            />
        );

        expect(screen.getByText('Test Items:')).toBeInTheDocument();
    });

    it('renders all string items correctly', () => {
        render(
            <ListPropertiesDetails
                textToDisplay={sampleText}
                items={sampleStringItems}
            />
        );

        // Check for each item
        sampleStringItems.forEach(item => {
            expect(screen.getByText(item)).toBeInTheDocument();
        });

        // Check number of DetailsItem elements (should be 1 parent + 3 children)
        const detailsItems = screen.getAllByTestId('details-item-mock');
        expect(detailsItems.length).toBe(4);
    });

    it('renders all number items correctly', () => {
        render(
            <ListPropertiesDetails
                textToDisplay={sampleText}
                items={sampleNumberItems}
            />
        );

        // Check for each item
        sampleNumberItems.forEach(item => {
            expect(screen.getByText(item.toString())).toBeInTheDocument();
        });
    });

    it('renders mixed string and number items correctly', () => {
        render(
            <ListPropertiesDetails
                textToDisplay={sampleText}
                items={sampleMixedItems}
            />
        );

        // Check for each item
        sampleMixedItems.forEach(item => {
            expect(screen.getByText(item.toString())).toBeInTheDocument();
        });
    });

    it('skips null items correctly', () => {
        render(
            <ListPropertiesDetails
                textToDisplay={sampleText}
                items={sampleWithNullItems}
            />
        );

        // Only non-null items should be present
        expect(screen.getByText('Item 1')).toBeInTheDocument();
        expect(screen.getByText('Item 3')).toBeInTheDocument();

        // Check number of DetailsItem elements (should be 1 parent + 2 children for non-null items)
        const detailsItems = screen.getAllByTestId('details-item-mock');
        expect(detailsItems.length).toBe(3);
    });

    it('renders correctly with an empty items array', () => {
        render(<ListPropertiesDetails textToDisplay={sampleText} items={[]} />);

        // Header text should still be present
        expect(screen.getByText('Test Items:')).toBeInTheDocument();

        // Should only have the parent DetailsItem
        const detailsItems = screen.getAllByTestId('details-item-mock');
        expect(detailsItems.length).toBe(1);
    });

    it('renders correctly with all null items', () => {
        render(
            <ListPropertiesDetails
                textToDisplay={sampleText}
                items={[null, null, null]}
            />
        );

        // Header text should still be present
        expect(screen.getByText('Test Items:')).toBeInTheDocument();

        // Should only have the parent DetailsItem
        const detailsItems = screen.getAllByTestId('details-item-mock');
        expect(detailsItems.length).toBe(1);
    });

    it('maintains the order of items', () => {
        render(
            <ListPropertiesDetails
                textToDisplay={sampleText}
                items={sampleStringItems}
            />
        );

        // Get all the text nodes for the items
        const itemNodes = screen.getAllByTestId('details-item-mock').slice(1); // Skip the parent

        // Check if they are in the correct order
        expect(itemNodes[0].textContent).toBe(sampleStringItems[0]);
        expect(itemNodes[1].textContent).toBe(sampleStringItems[1]);
        expect(itemNodes[2].textContent).toBe(sampleStringItems[2]);
    });
});
