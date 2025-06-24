/*
 * Copyright (c) 2023 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

const sharedEslintConfig = require('@nordicsemiconductor/pc-nrfconnect-shared/config/eslintrc');

module.exports = {
    ...sharedEslintConfig,
    ignorePatterns: [
        'docs/**/*.md',
        'README.md',
        ...sharedEslintConfig.ignorePatterns,
    ],
};
