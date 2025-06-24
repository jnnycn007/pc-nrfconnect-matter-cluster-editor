/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-array-index-key */

import React, { ReactNode } from 'react';

import { HexString } from '../../src/app/defines';

// Define interface for TextInputField props to fix type errors
interface TextInputFieldProps {
    field: string;
    value: string | number | HexString;
    onChange: (value: string | HexString) => void;
    required?: boolean;
    disabled?: boolean;
    tooltip?: string;
    fullWidth?: boolean;
    treatAsHex?: boolean;
    useNrfconnect?: boolean;
    minSize?: number;
}

// Export mock components
// Mock the InnerElementDetails component
jest.mock('../../src/app/Components/Details/InnerElementDetails', () => ({
    __esModule: true,
    default: ({ content, open, onClose, size }: any) =>
        open ? (
            <div
                data-testid="inner-element-details-mock"
                data-content-length={content.length}
                data-size={size}
            >
                <button
                    data-testid="inner-element-details-close-button"
                    onClick={onClose}
                    type="button"
                >
                    Close
                </button>
            </div>
        ) : null,
}));

// Mock the child components of EditBox
jest.mock('../../src/app/Components/Edit/BooleanField', () =>
    jest.fn(({ field, value, onChange, tooltip, required, disabled }) => (
        <div
            data-testid="boolean-field"
            data-field={field}
            data-value={value.toString()}
            data-tooltip={tooltip}
            data-required={required ? 'true' : 'false'}
            data-disabled={disabled ? 'true' : 'false'}
        >
            <input
                type="checkbox"
                checked={value}
                onChange={() => onChange(!value)}
                data-testid={`boolean-input-${field}`}
            />
        </div>
    ))
);

// Mock the DetailsItem component
jest.mock('../../src/app/Components/Details/DetailsBox', () => {
    const originalModule = jest.requireActual(
        '../../src/app/Components/Details/DetailsBox'
    );

    // Create a mock version of DetailsItem
    const MockDetailsItem = ({ children }: { children: ReactNode }) => (
        <div data-testid="details-item-mock">{children}</div>
    );

    return {
        __esModule: true,
        ...originalModule,
        DetailsItem: MockDetailsItem,
        default: originalModule.default,
    };
});

// Mock the Row component used in Table tests
jest.mock('../../src/app/Components/TableRow', () => ({
    __esModule: true,
    default: (props: any) => (
        <tr data-testid="mocked-row" data-row-id={props.$.id}>
            {props.cells.map((cell: any, index: number) => (
                <td key={index} data-cell-index={index}>
                    {cell.content}
                </td>
            ))}
        </tr>
    ),
}));

// Mock the ClusterTable component
jest.mock('../../src/app/Components/Table', () =>
    jest.fn((name, headers, rows, addRow) => (
        <div
            data-testid="mocked-table"
            data-name={name}
            data-headers={JSON.stringify(headers)}
            data-rows={JSON.stringify(rows)}
            data-add-row={
                typeof addRow === 'function' ? 'function' : 'undefined'
            }
        />
    ))
);

jest.mock('../../src/app/Components/Edit/DropdownField', () =>
    jest.fn(
        ({ field, value, options, onChange, tooltip, required, disabled }) => (
            <div
                data-testid="dropdown-field"
                data-field={field}
                data-value={value}
                data-options={JSON.stringify(options)}
                data-tooltip={tooltip}
                data-required={required ? 'true' : 'false'}
                data-disabled={disabled ? 'true' : 'false'}
            >
                <select
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    data-testid={`dropdown-select-${field}`}
                >
                    {options.map((option: string) => (
                        <option key={option} value={option}>
                            {option}
                        </option>
                    ))}
                </select>
            </div>
        )
    )
);

jest.mock('../../src/app/Components/Edit/TextInputField', () =>
    jest.fn(
        ({
            field,
            value,
            required,
            disabled,
            tooltip,
            onChange,
            fullWidth,
            treatAsHex,
            useNrfconnect,
            minSize,
        }: TextInputFieldProps) => {
            const handleChange = (e: any) => {
                // Handle both direct input element changes and wrapper div changes
                if (e.target && e.target.value !== undefined) {
                    onChange(e.target.value);
                } else if (typeof e === 'object' && e.value !== undefined) {
                    onChange(e.value);
                } else {
                    onChange(e);
                }
            };

            return (
                <div
                    data-testid="text-input-field"
                    data-field={field}
                    data-value={
                        value instanceof HexString
                            ? value.toString()
                            : String(value)
                    }
                    data-required={required ? 'true' : 'false'}
                    data-disabled={disabled ? 'true' : 'false'}
                    data-tooltip={tooltip}
                    data-full-width={fullWidth ? 'true' : 'false'}
                    data-treat-as-hex={treatAsHex ? 'true' : 'false'}
                    data-use-nrfconnect={useNrfconnect ? 'true' : 'false'}
                    data-min-size={minSize}
                >
                    <input
                        type="text"
                        value={
                            value instanceof HexString
                                ? value.toString()
                                : String(value)
                        }
                        onChange={handleChange}
                        data-testid="text-input"
                    />
                </div>
            );
        }
    )
);

jest.mock('../../src/app/Components/Edit/TypeField', () =>
    jest.fn(
        ({
            field,
            value,
            availableTypes,
            onChange,
            tooltip,
            required,
            disabled,
        }: any) => (
            <div
                data-testid="type-field"
                data-field={field}
                data-value={value}
                data-available-types={JSON.stringify(availableTypes)}
                data-tooltip={tooltip}
                data-required={required ? 'true' : 'false'}
                data-disabled={disabled ? 'true' : 'false'}
            >
                <label htmlFor={`type-select-${field}`}>{field}</label>
                <select
                    id={`type-select-${field}`}
                    value={value}
                    onChange={e => onChange(e.target.value)}
                    data-testid={`type-select-${field}`}
                >
                    {availableTypes.map((type: string) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </select>
            </div>
        )
    )
);

// Mock InnerButton
jest.mock('../../src/app/Components/Edit/InnerButton', () =>
    jest.fn(({ label, badgeContent, tooltip, onClick }: any) => (
        <div
            data-testid="inner-button"
            data-label={label}
            data-badge-content={badgeContent}
            data-tooltip={tooltip}
            role="button"
            tabIndex={0}
            onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                    onClick();
                }
            }}
            onClick={onClick}
        >
            {label} - {badgeContent}
        </div>
    ))
);

// End of mock declarations
