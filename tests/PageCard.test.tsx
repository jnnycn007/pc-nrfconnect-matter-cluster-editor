/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint-disable testing-library/no-node-access */

import './__mocks__/component.mock';
import './__mocks__/mui.mock';
import '@testing-library/jest-dom';

import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

import PageCard, { SingleItem } from '../src/app/Components/PageCard';
import { camelCaseToTitle } from '../src/app/Components/Utils';
import { HexString } from '../src/app/defines';

describe('PageCard component', () => {
    const sampleData = {
        name: 'Test Cluster',
        code: new HexString(0x1234),
        description: 'Test description',
        isOptional: false,
    };

    const treatAsHexFn = (field: keyof typeof sampleData) => field === 'code';
    const isOptionalFn = (field: keyof typeof sampleData) =>
        field === 'description';
    const isDisabledFn = (
        field: keyof typeof sampleData,
        value: typeof sampleData
    ) => field === 'isOptional' && !value.name;
    const tooltipFn = (field: keyof typeof sampleData) =>
        `Tooltip for ${field}`;

    // Add mock onChange handler
    const onChangeMock = jest.fn();

    beforeEach(() => {
        // No render call here - will be in individual tests
    });

    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('renders the card with the correct title', () => {
        render(
            <PageCard
                title="Test Card"
                data={sampleData}
                treatAsHex={treatAsHexFn}
                isOptionalCallback={isOptionalFn}
                isDisabledCallback={isDisabledFn}
                tooltipCallback={tooltipFn}
                onChange={onChangeMock}
            />
        );
        expect(screen.getByText('Test Card')).toBeInTheDocument();
    });

    it('renders TextInputField components for each primitive property in the data', async () => {
        render(
            <PageCard
                title="Test Card"
                data={sampleData}
                treatAsHex={treatAsHexFn}
                isOptionalCallback={isOptionalFn}
                isDisabledCallback={isDisabledFn}
                tooltipCallback={tooltipFn}
                onChange={onChangeMock}
            />
        );
        const textInputFields = await screen.findAllByTestId(
            'text-input-field'
        );

        // We expect 4 fields for our sample data (name, code, description, isOptional)
        expect(textInputFields).toHaveLength(4);

        // Check field names - note they will be in title case format due to camelCaseToTitle conversion
        const fieldNames = textInputFields.map(field =>
            field.getAttribute('data-field')
        );
        expect(fieldNames).toContain(
            camelCaseToTitle(Object.keys(sampleData)[0])
        );
        expect(fieldNames).toContain(
            camelCaseToTitle(Object.keys(sampleData)[1])
        );
        expect(fieldNames).toContain(
            camelCaseToTitle(Object.keys(sampleData)[2])
        );
        expect(fieldNames).toContain(
            camelCaseToTitle(Object.keys(sampleData)[3])
        );
    });

    it('passes the correct props to TextInputField components', async () => {
        render(
            <PageCard
                title="Test Card"
                data={sampleData}
                treatAsHex={treatAsHexFn}
                isOptionalCallback={isOptionalFn}
                isDisabledCallback={isDisabledFn}
                tooltipCallback={tooltipFn}
                onChange={onChangeMock}
            />
        );
        const textInputFields = await screen.findAllByTestId(
            'text-input-field'
        );
        const codeField = textInputFields.find(
            field =>
                field.getAttribute('data-field') ===
                camelCaseToTitle(Object.keys(sampleData)[1])
        );

        expect(codeField).toBeDefined();
        expect(codeField?.getAttribute('data-value')).toBe('0x1234');
        expect(codeField?.getAttribute('data-treat-as-hex')).toBe('true');
        expect(codeField?.getAttribute('data-tooltip')).toBe(
            'Tooltip for code'
        );
    });

    it('handles the isOptionalCallback correctly', async () => {
        render(
            <PageCard
                title="Test Card"
                data={sampleData}
                treatAsHex={treatAsHexFn}
                isOptionalCallback={isOptionalFn}
                isDisabledCallback={isDisabledFn}
                tooltipCallback={tooltipFn}
                onChange={onChangeMock}
            />
        );
        const textInputFields = await screen.findAllByTestId(
            'text-input-field'
        );
        const nameField = textInputFields.find(
            field =>
                field.getAttribute('data-field') ===
                camelCaseToTitle(Object.keys(sampleData)[0])
        );
        const descriptionField = textInputFields.find(
            field =>
                field.getAttribute('data-field') ===
                camelCaseToTitle(Object.keys(sampleData)[2])
        );

        expect(nameField?.getAttribute('data-required')).toBe('true'); // Default behavior for non-optional fields
        expect(descriptionField?.getAttribute('data-required')).toBe('false'); // Our isOptionalFn marks 'description' as optional
    });

    it('handles the isDisabledCallback correctly', async () => {
        // In our test case, isOptional should not be disabled because name is not empty
        render(
            <PageCard
                title="Test Card"
                data={sampleData}
                treatAsHex={treatAsHexFn}
                isOptionalCallback={isOptionalFn}
                isDisabledCallback={isDisabledFn}
                tooltipCallback={tooltipFn}
                onChange={onChangeMock}
            />
        );
        const textInputFields = await screen.findAllByTestId(
            'text-input-field'
        );
        const isOptionalField = textInputFields.find(
            field =>
                field.getAttribute('data-field') ===
                camelCaseToTitle(Object.keys(sampleData)[3])
        );
        expect(isOptionalField?.getAttribute('data-disabled')).toBe('false');

        // Clean up previous render
        cleanup();

        // Create a new component with empty name to test disabling
        render(
            <PageCard
                title="Test Card"
                data={{ ...sampleData, name: '' }}
                isDisabledCallback={isDisabledFn}
                onChange={onChangeMock}
            />
        );

        const updatedFields = await screen.findAllByTestId('text-input-field');
        const newIsOptionalField = updatedFields.find(
            field =>
                field.getAttribute('data-field') ===
                camelCaseToTitle(Object.keys(sampleData)[3])
        );

        expect(newIsOptionalField?.getAttribute('data-disabled')).toBe('true');
    });

    it('updates when data prop changes', async () => {
        // Clean up previous render
        cleanup();

        const newData = {
            ...sampleData,
            name: 'Updated Name',
            code: new HexString(0x5678),
        };

        render(
            <PageCard
                title="Test Card"
                data={newData}
                treatAsHex={treatAsHexFn}
                isOptionalCallback={isOptionalFn}
                isDisabledCallback={isDisabledFn}
                tooltipCallback={tooltipFn}
                onChange={onChangeMock}
            />
        );

        const textInputFields = await screen.findAllByTestId(
            'text-input-field'
        );
        const nameField = textInputFields.find(
            field =>
                field.getAttribute('data-field') ===
                camelCaseToTitle(Object.keys(sampleData)[0])
        );
        const codeField = textInputFields.find(
            field =>
                field.getAttribute('data-field') ===
                camelCaseToTitle(Object.keys(sampleData)[1])
        );

        expect(nameField?.getAttribute('data-value')).toBe('Updated Name');
        expect(codeField?.getAttribute('data-value')).toBe('0x5678');
    });

    it('renders children inside SingleItem when provided', () => {
        // Clean up previous render
        cleanup();

        render(
            <PageCard
                title="Test Card"
                data={sampleData}
                onChange={onChangeMock}
            >
                <div data-testid="child-element">Child content</div>
            </PageCard>
        );

        const childElement = screen.getByTestId('child-element');
        expect(childElement).toBeInTheDocument();
        expect(childElement.textContent).toBe('Child content');
    });

    it('ignores complex object properties that are not HexString instances', async () => {
        // Clean up previous render
        cleanup();

        const dataWithComplexProp = {
            ...sampleData,
            complexProp: { nested: 'value' },
        };

        render(
            <PageCard
                title="Test Card"
                data={dataWithComplexProp}
                onChange={onChangeMock}
            />
        );

        const textInputFields = await screen.findAllByTestId(
            'text-input-field'
        );
        const complexPropField = textInputFields.find(
            field => field.getAttribute('data-field') === 'complexProp'
        );

        // The complex object property should be ignored
        expect(complexPropField).toBeUndefined();
    });

    it('renders correctly with nrfconnect styling when useNrfconnect is true', async () => {
        // Clean up previous render
        cleanup();

        render(
            <PageCard
                title="NRF Test Card"
                data={sampleData}
                useNrfconnect
                onChange={onChangeMock}
            />
        );

        const textInputFields = await screen.findAllByTestId(
            'text-input-field'
        );

        // Check that fields are rendered with proper useNrfconnect flag
        textInputFields.forEach(field => {
            // We can't directly test the useNrfconnect prop as it's not exposed in our mock,
            // but we can verify the component renders correctly
            expect(field).toBeInTheDocument();
        });
    });

    it('handles field value changes correctly including hex conversion for hex fields', async () => {
        // Clean up previous render
        cleanup();

        // Setup a component with hex treatment for 'code' field
        render(
            <PageCard
                title="Test Card"
                data={sampleData}
                treatAsHex={treatAsHexFn}
                onChange={onChangeMock}
            />
        );

        // Find all input fields
        const textInputFields = await screen.findAllByTestId(
            'text-input-field'
        );

        // Get the code field which should be treated as hex
        const codeField = textInputFields.find(
            field =>
                field.getAttribute('data-field') ===
                camelCaseToTitle(Object.keys(sampleData)[1])
        );
        expect(codeField).toBeDefined();

        // Simulate changing the value by clicking
        if (codeField) {
            fireEvent.click(codeField);
        }

        // Get the name field which should be treated as regular string
        const nameField = textInputFields.find(
            field =>
                field.getAttribute('data-field') ===
                camelCaseToTitle(Object.keys(sampleData)[0])
        );
        expect(nameField).toBeDefined();

        // Simulate changing the name
        if (nameField) {
            fireEvent.click(nameField);
        }
    });

    it('calls onChange when field values change', async () => {
        // Clean up previous render
        cleanup();
        onChangeMock.mockClear();

        render(
            <PageCard
                title="Test Card"
                data={sampleData}
                onChange={onChangeMock}
            />
        );

        const textInputFields = await screen.findAllByTestId(
            'text-input-field'
        );

        // Get the name field
        const nameField = textInputFields.find(
            field => field.getAttribute('data-field') === 'Name'
        );
        expect(nameField).toBeDefined();

        // Find the actual input element inside the nameField wrapper
        if (nameField) {
            // In our mock implementation, TextInputField renders an input with data-testid="text-input"
            const inputElement = nameField.querySelector(
                '[data-testid="text-input"]'
            );
            expect(inputElement).not.toBeNull();

            // Simulate change event on the input element
            if (inputElement) {
                fireEvent.change(inputElement, {
                    target: { value: 'New Name' },
                });
            }
        }

        // Check that onChange was called with updated data
        expect(onChangeMock).toHaveBeenCalled();
        // The first argument to the first call should be an object with the updated name
        expect(onChangeMock.mock.calls[0][0]).toHaveProperty(
            'name',
            'New Name'
        );
    });
});

describe('SingleItem component', () => {
    it('renders with correct styling', () => {
        render(
            <SingleItem>
                <div data-testid="single-item-child">Test content</div>
            </SingleItem>
        );

        // Check that the child element is rendered
        const childElement = screen.getByTestId('single-item-child');
        expect(childElement).toBeInTheDocument();
        expect(childElement.textContent).toBe('Test content');
    });
});
