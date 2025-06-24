/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

// Export mock XML parser
jest.mock('../../src/app/xmlClusterParser', () => ({
    parseClusterXML: jest.fn(),
}));

// Add empty export to make this file a module
export {};
