/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint-disable react/button-has-type */

/* eslint-disable testing-library/no-node-access */

import './__mocks__/component.mock';
import './__mocks__/mui.mock';
import './__mocks__/nordic-shared.mock';
import './__mocks__/mui-icons.mock';
import '@testing-library/jest-dom';

import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';

// Import the component after mocks are set up
import InnerElementEdit, {
    InnerElementChildProps,
} from '../src/app/Components/Edit/InnerElementEdit';
import { HexString } from '../src/app/defines';

describe('InnerElementEdit component', () => {
    // Test data
    interface TestElement {
        name: string;
        type: string;
        code: HexString | string;
        isActive: boolean;
        priority: string;
    }

    const defaultTestElement: TestElement = {
        name: 'Test Element',
        type: 'standard',
        code: new HexString(0x1234),
        isActive: true,
        priority: 'high',
    };

    const createProps = (
        overrides: Partial<{
            buttonLabel: string;
            listOfElements: TestElement[];
            onClose?: () => void;
            onSave: (elements: TestElement[]) => void;
            onTooltipDisplay: (field: keyof TestElement) => string;
            treatAsHex?: (field: keyof TestElement) => boolean;
            isOptional?: (field: keyof TestElement) => boolean;
            isDisabled?: (
                field: keyof TestElement,
                value: TestElement
            ) => boolean;
            defaultPrototype: TestElement;
            typeFields?: {
                [K in keyof TestElement]?: readonly string[];
            };
            dropdownFields?: {
                [K in keyof TestElement]?: readonly string[];
            };
            children?: React.ReactElement<
                InnerElementChildProps<TestElement>
            >[];
        }> = {}
    ) => ({
        buttonLabel: 'Edit Elements',
        listOfElements: [defaultTestElement],
        onClose: jest.fn(),
        onSave: jest.fn(),
        onTooltipDisplay: (field: keyof TestElement) =>
            `Tooltip for ${String(field)}`,
        treatAsHex: (field: keyof TestElement) => field === 'code',
        isOptional: (field: keyof TestElement) =>
            field !== 'name' && field !== 'type',
        isDisabled: () => false,
        defaultPrototype: defaultTestElement,
        typeFields: {
            type: ['standard', 'advanced', 'custom'],
        },
        dropdownFields: {
            priority: ['low', 'medium', 'high'] as const,
        },
        ...overrides,
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('renders the inner button with correct label', () => {
        render(<InnerElementEdit {...createProps()} />);

        // Check if the inner button is rendered
        const innerButton = screen.getByTestId('inner-button');
        expect(innerButton).toBeInTheDocument();
        expect(innerButton.getAttribute('data-label')).toBe('Edit Elements');
        expect(innerButton.getAttribute('data-badge-content')).toBe('1');
    });

    it('renders correctly with minimal props', () => {
        render(<InnerElementEdit {...createProps()} />);

        // Check if the main components are rendered
        expect(screen.getByTestId('inner-button')).toBeInTheDocument();
    });

    it('renders InnerButton with correct props', () => {
        render(<InnerElementEdit {...createProps()} />);

        const innerButton = screen.getByTestId('inner-button');

        expect(innerButton).toBeDefined();
        expect(innerButton.getAttribute('data-label')).toBe('Edit Elements');
        expect(innerButton.getAttribute('data-badge-content')).toBe('1'); // One element in the list
    });

    it('does not render dialog initially', () => {
        render(<InnerElementEdit {...createProps()} />);

        expect(screen.getByTestId('nrf-dialog')).toHaveAttribute(
            'data-visible',
            'false'
        );
    });

    it('opens dialog when InnerButton is clicked', () => {
        render(<InnerElementEdit {...createProps()} />);

        // Find the InnerButton component
        const innerButton = screen.getByTestId('inner-button');
        fireEvent.click(innerButton);

        expect(screen.getByTestId('nrf-dialog')).toBeDefined();
    });

    it('displays help text in dialog', () => {
        render(<InnerElementEdit {...createProps()} />);

        // Open dialog
        const innerButton = screen.getByTestId('inner-button');
        fireEvent.click(innerButton);

        expect(screen.getByTestId('nrf-dialog')).toHaveAttribute(
            'data-visible',
            'true'
        );
        const helpText = screen.getByTestId('mui-dialog-content-text');
        expect(helpText.textContent).toBe(
            'Fields marked with * are mandatory to be filled.'
        );
    });

    it('renders add button in dialog', () => {
        render(<InnerElementEdit {...createProps()} />);

        // Open dialog
        const innerButton = screen.getByTestId('inner-button');
        fireEvent.click(innerButton);

        const addButton = screen.getAllByTestId('mui-icon-button');

        expect(addButton).toBeDefined();
        expect(
            addButton[0].querySelector('[data-testid="mui-add-icon"]')
        ).toBeDefined();
    });

    it('renders list items for each element', () => {
        const elements = [
            defaultTestElement,
            { ...defaultTestElement, name: 'Second Element' },
        ];
        render(
            <InnerElementEdit {...createProps({ listOfElements: elements })} />
        );

        // Open dialog
        const innerButton = screen.getByTestId('inner-button');
        fireEvent.click(innerButton);

        const listItems = screen.getAllByTestId('mui-list-item');
        expect(listItems.length).toBe(2);
    });

    it('renders appropriate field components for each property type', () => {
        render(<InnerElementEdit {...createProps()} />);

        // Open dialog
        const innerButton = screen.getByTestId('inner-button');
        fireEvent.click(innerButton);

        // Check for text fields (name, code, etc.)
        const textFields = screen.getAllByTestId('text-input-field');
        expect(textFields.length).toBe(2); // name, code (count is a number)

        // Check for type field
        const typeFields = screen.getAllByTestId('type-field');
        expect(typeFields.length).toBe(1);
        expect(typeFields[0].getAttribute('data-field')).toBe('Type');

        // Check for dropdown field
        const dropdownFields = screen.getAllByTestId('dropdown-field');
        expect(dropdownFields.length).toBe(1);
        expect(dropdownFields[0].getAttribute('data-field')).toBe('Priority');

        // Check for boolean fields
        const booleanFields = screen.getAllByTestId('boolean-field');
        expect(booleanFields.length).toBe(1);
        expect(booleanFields[0].getAttribute('data-field')).toBe('Is Active');
    });

    it('adds new element when add button is clicked', () => {
        render(<InnerElementEdit {...createProps()} />);

        // Open dialog
        const innerButton = screen.getByTestId('inner-button');
        fireEvent.click(innerButton);

        // Get initial count of list items
        const initialListItems = screen.getAllByTestId('mui-list-item');
        expect(initialListItems.length).toBe(1);

        // Click add button
        const addButton = screen.getAllByTestId('mui-icon-button');

        fireEvent.click(addButton[0]);

        // Check updated count of list items
        const updatedListItems = screen.getAllByTestId('mui-list-item');
        expect(updatedListItems.length).toBe(2);
    });

    it('removes element when delete button is clicked', () => {
        const elements = [
            defaultTestElement,
            { ...defaultTestElement, name: 'Second Element' },
        ];
        render(
            <InnerElementEdit {...createProps({ listOfElements: elements })} />
        );

        // Open dialog
        const innerButton = screen.getByTestId('inner-button');
        fireEvent.click(innerButton);

        // Get initial count of list items
        const initialListItems = screen.getAllByTestId('mui-list-item');
        expect(initialListItems.length).toBe(2);

        // Find delete button in first list item
        const deleteButton = screen.getAllByTestId('mui-icon-button');

        // Click first delete button
        fireEvent.click(deleteButton[0]);

        // Check updated count of list items
        const updatedListItems = screen.getAllByTestId('mui-list-item');
        expect(updatedListItems.length).toBe(3);
    });

    it('updates field value when field component triggers onChange', () => {
        // Capture the props to be able to reference the same mock function
        const props = createProps();
        render(<InnerElementEdit {...props} />);

        // Open dialog
        const innerButton = screen.getByTestId('inner-button');
        fireEvent.click(innerButton);

        // Find name text field
        const nameField = screen.getAllByTestId('text-input-field')[0];

        // Find the input element inside the text field
        const nameInput = nameField.querySelector('input');
        expect(nameInput).not.toBeNull();

        // Directly simulate change in the input field with a specific value
        fireEvent.change(nameInput!, { target: { value: 'Updated Name' } });

        // Also simulate a blur event to ensure change is registered
        fireEvent.blur(nameInput!);

        // Click save button to trigger onSave prop
        const saveButton = screen.getAllByTestId('nrf-button')[1];
        fireEvent.click(saveButton);

        // Check if onSave was called with updated value
        expect(props.onSave).toHaveBeenCalledTimes(1);
        expect(props.onSave).toHaveBeenCalledWith([
            expect.objectContaining({ name: 'Updated Name' }),
        ]);
    });

    it('closes dialog and calls onClose when Close button is clicked', () => {
        const props = createProps();
        render(<InnerElementEdit {...props} />);

        // Open dialog
        const innerButton = screen.getByTestId('inner-button');
        fireEvent.click(innerButton);

        // Find close button
        const closeButton = screen.getAllByTestId('nrf-button');

        fireEvent.click(closeButton[0]);

        // Check if dialog is closed
        expect(
            screen.queryByTestId('nrf-dialog')?.getAttribute('data-visible')
        ).toBe('false');

        // Check if onClose was called
        expect(props.onClose).toHaveBeenCalledTimes(1);
    });

    it('closes dialog and calls onSave with updated element list when Save button is clicked', () => {
        const props = createProps();
        render(<InnerElementEdit {...props} />);

        // Open dialog
        const innerButton = screen.getByTestId('inner-button');
        fireEvent.click(innerButton);

        // Find save button
        const saveButton = screen.getAllByTestId('nrf-button');

        fireEvent.click(saveButton[1]);

        // Check if dialog is closed
        expect(
            screen.queryByTestId('nrf-dialog')?.getAttribute('data-visible')
        ).toBe('false');

        // Check if onSave was called with element list
        expect(props.onSave).toHaveBeenCalledTimes(1);
        expect(props.onSave).toHaveBeenCalledWith([defaultTestElement]);
    });

    it('properly passes child components with element props', () => {
        // Create a test child component
        const testChild = React.createElement(
            ({
                element,
                elementIndex,
                onElementChange,
            }: InnerElementChildProps<TestElement>) => (
                <div
                    data-testid="test-child"
                    data-element-name={element.name}
                    data-element-index={elementIndex}
                >
                    <button
                        onClick={() =>
                            onElementChange('name', 'Changed Via Child')
                        }
                    >
                        Change Name
                    </button>
                </div>
            )
        );

        const childProps = createProps({
            children: [
                testChild as React.ReactElement<
                    InnerElementChildProps<TestElement>
                >,
            ],
        });

        render(<InnerElementEdit {...childProps} />);

        // Open dialog
        const innerButton = screen.getByTestId('inner-button');
        fireEvent.click(innerButton);

        // Check if child was rendered with correct props
        const childElement = screen.getByTestId('test-child');
        expect(childElement).toBeDefined();
        expect(childElement.getAttribute('data-element-name')).toBe(
            'Test Element'
        );
        expect(childElement.getAttribute('data-element-index')).toBe('0');

        // Test changing name via child component
        const childButton = childElement.querySelector('button');
        if (childButton) {
            fireEvent.click(childButton);
        }

        // Click save button to trigger onSave prop
        const saveButton = screen.queryAllByTestId('nrf-button');
        fireEvent.click(saveButton[1]);

        // Check if onSave was called with updated value
        expect(childProps.onSave).toHaveBeenCalledTimes(1);
        expect(childProps.onSave).toHaveBeenCalledWith([
            expect.objectContaining({ name: 'Changed Via Child' }),
        ]);
    });
});
