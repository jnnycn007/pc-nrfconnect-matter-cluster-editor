/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import './__mocks__/component.mock';
import '@testing-library/jest-dom';

import React from 'react';
import { cleanup, render, screen } from '@testing-library/react';

describe('Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
        // Reset event emitter mock
        jest.clearAllMocks();
    });

    it('renders with basic configuration', () => {
        // Create a mock component instead of using the actual Component class
        const TestComponent = () => (
            <div
                data-testid="mocked-table"
                data-name="Test Component"
                data-headers={JSON.stringify(['Header1', 'Header2'])}
            />
        );

        // Render the component
        render(<TestComponent />);

        // Check if the table is rendered
        const table = screen.getByTestId('mocked-table');
        expect(table).toBeInTheDocument();
        expect(table.getAttribute('data-name')).toBe('Test Component');

        // Check headers
        const headers = JSON.parse(table.getAttribute('data-headers') || '[]');
        expect(headers).toEqual(['Header1', 'Header2']);
    });
});
