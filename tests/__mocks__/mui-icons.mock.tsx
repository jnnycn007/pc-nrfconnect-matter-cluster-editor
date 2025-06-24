/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';

// Export mock MUI icons
jest.mock('@mui/icons-material', () => ({
    Check: () => <span data-testid="check-icon">CheckIcon</span>,
    Close: () => <span data-testid="close-icon">CloseIcon</span>,
    Edit: () => <span data-testid="edit-icon">EditIcon</span>,
    KeyboardArrowDown: () => (
        <span data-testid="arrow-down-icon">KeyboardArrowDownIcon</span>
    ),
    KeyboardArrowUp: () => (
        <span data-testid="arrow-up-icon">KeyboardArrowUpIcon</span>
    ),
    ArrowDropDown: () => (
        <span data-testid="arrow-dropdown-icon">Arrow Icon</span>
    ),
}));

// Mock MUI Icons
jest.mock('@mui/icons-material/Add', () => () => (
    <div data-testid="add-icon">Add Icon</div>
));

jest.mock('@mui/icons-material/Delete', () => () => (
    <div data-testid="delete-icon">Delete Icon</div>
));
