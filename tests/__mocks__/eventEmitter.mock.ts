/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

jest.mock('../../src/app/Components/EventEmitter', () => ({
    __esModule: true,
    default: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
        once: jest.fn(),
        removeAllListeners: jest.fn(),
    },
}));

// Add empty export to make this file a module
export {};
