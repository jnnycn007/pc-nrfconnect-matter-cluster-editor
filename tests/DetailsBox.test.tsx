/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import './__mocks__/mui.mock';
import './__mocks__/nordic-shared.mock';
import './__mocks__/component.mock';
import '@testing-library/jest-dom';

import React from 'react';
import {
    cleanup,
    fireEvent,
    render,
    screen,
    within,
} from '@testing-library/react';

import DetailsBox from '../src/app/Components/Details/DetailsBox';

describe('DetailsBox component', () => {
    // Sample test data
    const sampleInnerElements = [
        {
            name: 'Element',
            element: [
                { id: 1, name: 'John', age: 30 },
                { id: 2, name: 'Doe', age: 25 },
            ],
            size: 'sm' as const,
        },
        {
            name: 'EmptyElement',
            element: [],
            size: 'lg' as const,
        },
    ];

    // Clean up after each test
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('renders the component with title and description', () => {
        render(
            <DetailsBox description="Test description">
                <div data-testid="custom-children">Test child content</div>
            </DetailsBox>
        );

        // Check for title
        const titleElement = screen.getByTestId('mui-typography');
        expect(titleElement).toHaveTextContent('Details');

        // Check for description
        const descriptionElement = screen.getByTestId('mui-paper');
        expect(descriptionElement).toHaveTextContent(
            'Description: Test description'
        );

        // Check for children
        const childElement = screen.getByTestId('custom-children');
        expect(childElement).toBeInTheDocument();
        expect(childElement).toHaveTextContent('Test child content');
    });

    it('renders without description when not provided', () => {
        render(
            <DetailsBox>
                <div data-testid="custom-children">Test child content</div>
            </DetailsBox>
        );

        // Check if description is not rendered
        const papers = screen.queryAllByTestId('mui-paper');
        expect(papers.length).toBe(0); // No paper elements when no description

        // Alternatively, verify no text containing "Description:" exists
        const descriptionText = screen.queryByText(/Description:/);
        expect(descriptionText).not.toBeInTheDocument();

        // Check if children are still rendered
        const childElement = screen.getByTestId('custom-children');
        expect(childElement).toBeInTheDocument();
    });

    it('renders inner elements correctly', () => {
        render(<DetailsBox innerElements={sampleInnerElements} />);

        // Check if inner elements are rendered
        const papers = screen.getAllByTestId('mui-paper');
        expect(papers.length).toBe(1); // Only one element with items should be rendered

        // Check if element count is displayed correctly
        const elementPaper = papers[0];
        expect(elementPaper).toHaveTextContent('2 Elements set.');

        // Check if button is rendered
        const button = within(elementPaper).getByTestId('nrf-button');
        expect(button).toHaveTextContent('Elements');
    });

    it('does not render inner elements when empty array is provided', () => {
        render(<DetailsBox innerElements={[]} />);

        // Check that no inner elements are rendered
        const papers = screen.queryAllByTestId('mui-paper');
        expect(papers.length).toBe(0);
    });

    it('opens InnerElementDetails when button is clicked', () => {
        render(<DetailsBox innerElements={sampleInnerElements} />);

        // Initially, InnerElementDetails should not be visible
        expect(
            screen.queryByTestId('inner-element-details-mock')
        ).not.toBeInTheDocument();

        // Click the button to show InnerElementDetails
        const button = screen.getByTestId('nrf-button');
        fireEvent.click(button);

        // Check if InnerElementDetails is now visible
        const innerElementDetails = screen.getByTestId(
            'inner-element-details-mock'
        );
        expect(innerElementDetails).toBeInTheDocument();

        // Check if content and size props are passed correctly
        expect(innerElementDetails.getAttribute('data-content-length')).toBe(
            '2'
        );
        expect(innerElementDetails.getAttribute('data-size')).toBe('sm');
    });

    it('closes InnerElementDetails when close button is clicked', () => {
        render(<DetailsBox innerElements={sampleInnerElements} />);

        // Click the button to show InnerElementDetails
        const button = screen.getByTestId('nrf-button');
        fireEvent.click(button);

        // Check if InnerElementDetails is visible
        expect(
            screen.getByTestId('inner-element-details-mock')
        ).toBeInTheDocument();

        // Click the close button
        const closeButton = screen.getByTestId(
            'inner-element-details-close-button'
        );
        fireEvent.click(closeButton);

        // Check if InnerElementDetails is no longer visible
        expect(
            screen.queryByTestId('inner-element-details-mock')
        ).not.toBeInTheDocument();
    });

    it('uses the second element when first element is empty', () => {
        // Create sample data with first element empty
        const testInnerElements = [
            {
                name: 'EmptyElement',
                element: [], // Empty element
                size: 'sm' as const,
            },
            {
                name: 'Element',
                element: [
                    { id: 1, name: 'John', age: 30 },
                    { id: 2, name: 'Doe', age: 25 },
                ],
                size: 'lg' as const,
            },
        ];

        render(<DetailsBox innerElements={testInnerElements} />);

        // Click the button to show InnerElementDetails
        const button = screen.getByTestId('nrf-button');
        fireEvent.click(button);

        // Check if InnerElementDetails uses the second element (with size lg)
        const innerElementDetails = screen.getByTestId(
            'inner-element-details-mock'
        );
        expect(innerElementDetails.getAttribute('data-size')).toBe('lg');
    });

    it('does not render anything when all elements are empty', () => {
        // Create sample data with all elements empty
        const emptyInnerElements = [
            {
                name: 'EmptyElement1',
                element: [],
                size: 'sm' as const,
            },
            {
                name: 'EmptyElement2',
                element: [],
                size: 'lg' as const,
            },
        ];

        render(<DetailsBox innerElements={emptyInnerElements} />);

        // Check that no inner elements are rendered
        const papers = screen.queryAllByTestId('mui-paper');
        expect(papers.length).toBe(0);

        // Check that no buttons are rendered
        const buttons = screen.queryAllByTestId('nrf-button');
        expect(buttons.length).toBe(0);
    });
});
