/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { App, render } from '@nordicsemiconductor/pc-nrfconnect-shared';

render(
    <App
        panes={[
            {
                name: 'Matter Manufacturer Cluster Editor',
                Main: () => <div>Hello World</div>,
            },
        ]}
    />
);
