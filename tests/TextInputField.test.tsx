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

// Import the component
import TextInputField from '../src/app/Components/Edit/TextInputField';
import { HexString } from '../src/app/defines';

/**
 * @jest-environment jsdom
 */

describe('TextInputField component', () => {
    // Setup test variables
    const testField = 'Test Field';
    const testValue = 'Test Value';
    const onChangeMock = jest.fn();

    // Custom validator that only accepts values longer than 3 chars
    const validatorFn = jest.fn(value => String(value).length > 3);

    // Clean up after each test
    afterEach(() => {
        cleanup();
        jest.clearAllMocks();
    });

    it('renders MUI TextField with the provided field name and value', () => {
        render(
            <TextInputField
                field={testField}
                value={testValue}
                onChange={onChangeMock}
            />
        );

        const tooltip = screen.getByTestId('mui-tooltip');
        expect(tooltip).toBeInTheDocument();

        const textField = screen.getByTestId('mui-text-field');
        expect(textField).toBeInTheDocument();
        expect(textField).toHaveAttribute('data-label', testField);
        expect(textField).toHaveAttribute('data-required', 'false');
        expect(textField).toHaveAttribute('data-disabled', 'false');

        const textInput = screen.getByTestId('mui-text-field');
        expect(textInput).toHaveValue(testValue);
    });

    it('calls onChange when MUI TextField input changes', () => {
        render(
            <TextInputField
                field={testField}
                value={testValue}
                onChange={onChangeMock}
            />
        );

        const textInput = screen.getByTestId('mui-text-field');
        const newValue = 'New Value';

        // Simulate input change using fireEvent without unnecessary act
        fireEvent.change(textInput, { target: { value: newValue } });

        // Check if onChange was called with the new value
        expect(onChangeMock).toHaveBeenCalledWith(newValue);
    });

    it('renders InlineInput when useNrfconnect is true', () => {
        render(
            <TextInputField
                field={testField}
                value={testValue}
                onChange={onChangeMock}
                useNrfconnect
            />
        );

        const inlineInput = screen.getByTestId('nrf-inline-input');
        expect(inlineInput).toBeInTheDocument();
        expect(inlineInput).toHaveValue(testValue);

        const typography = screen.getByTestId('mui-typography');
        expect(typography).toBeInTheDocument();
        expect(typography.textContent).toBe(`${testField} :`);
    });

    it('calls onChange when InlineInput changes', () => {
        render(
            <TextInputField
                field={testField}
                value={testValue}
                onChange={onChangeMock}
                useNrfconnect
            />
        );

        const inlineInput = screen.getByTestId('nrf-inline-input');
        const newValue = 'New Value';

        // Simulate input change using fireEvent without unnecessary act
        fireEvent.change(inlineInput, { target: { value: newValue } });

        // Check if onChange was called with the new value
        expect(onChangeMock).toHaveBeenCalledWith(newValue);
    });

    it('handles HexString values with 0x prefix', () => {
        const hexValue = new HexString(0x1234);
        render(
            <TextInputField
                field={testField}
                value={hexValue}
                onChange={onChangeMock}
            />
        );

        const textInput = screen.getByTestId('mui-text-field');
        // With real HexString implementation, the value should be 0x1234
        expect(textInput).toHaveValue('0x1234');
    });

    it('sanitizes hex strings when treatAsHex is true', () => {
        // Create a spy on the static sanitizeHexString method
        const sanitizeSpy = jest.spyOn(HexString, 'sanitizeHexString');

        render(
            <TextInputField
                field={testField}
                value="0x1234"
                onChange={onChangeMock}
                treatAsHex
            />
        );

        const textInput = screen.getByTestId('mui-text-field');
        const newValue = 'abcd'; // Hex value without 0x prefix

        // Simulate input change using fireEvent without unnecessary act
        fireEvent.change(textInput, { target: { value: newValue } });

        // Check if sanitizeHexString was called and onChange received the sanitized value
        expect(sanitizeSpy).toHaveBeenCalledWith(newValue);
        // The sanitized value should be "0xabcd" with the real implementation
        expect(onChangeMock).toHaveBeenCalledWith('0xabcd');

        // Clean up the spy
        sanitizeSpy.mockRestore();
    });

    it('respects the required prop', () => {
        render(
            <TextInputField
                field={testField}
                value={testValue}
                onChange={onChangeMock}
                required
            />
        );

        const textField = screen.getByTestId('mui-text-field');
        expect(textField).toHaveAttribute('data-required', 'true');
    });

    it('respects the disabled prop', () => {
        render(
            <TextInputField
                field={testField}
                value={testValue}
                onChange={onChangeMock}
                disabled
            />
        );

        const textField = screen.getByTestId('mui-text-field');
        expect(textField).toHaveAttribute('data-disabled', 'true');
    });

    it('respects the fullWidth prop', () => {
        render(
            <TextInputField
                field={testField}
                value={testValue}
                onChange={onChangeMock}
                fullWidth
            />
        );

        const textField = screen.getByTestId('mui-text-field');
        expect(textField).toHaveAttribute('data-full-width', 'true');
    });

    it('passes minSize to InlineInput when useNrfconnect is true', () => {
        const minSize = 20;
        render(
            <TextInputField
                field={testField}
                value={testValue}
                onChange={onChangeMock}
                useNrfconnect
                minSize={minSize}
            />
        );

        const inlineInput = screen.getByTestId('nrf-inline-input');
        expect(inlineInput).toHaveAttribute('data-min-size', String(minSize));
    });

    it('uses the isValid function for validation when useNrfconnect is true', () => {
        render(
            <TextInputField
                field={testField}
                value={testValue}
                onChange={onChangeMock}
                useNrfconnect
                isValid={validatorFn}
            />
        );

        const inlineInput = screen.getByTestId('nrf-inline-input');
        expect(inlineInput).toHaveAttribute('data-is-valid', 'true'); // 'Test Value' is > 3 chars
        expect(validatorFn).toHaveBeenCalledWith(testValue);
    });

    it('adds required asterisk when required is true and useNrfconnect is true', () => {
        render(
            <TextInputField
                field={testField}
                value={testValue}
                onChange={onChangeMock}
                useNrfconnect
                required
            />
        );

        const typography = screen.getByTestId('mui-typography');
        expect(typography.textContent).toBe(`${testField} *:`);
    });

    it('adds optional class to InlineInput when required is false', () => {
        render(
            <TextInputField
                field={testField}
                value={testValue}
                onChange={onChangeMock}
                useNrfconnect
                required={false}
            />
        );

        const inlineInput = screen.getByTestId('nrf-inline-input');
        expect(inlineInput).toHaveClass('optional');
    });
});
