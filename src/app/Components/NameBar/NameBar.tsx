/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import { InlineInput } from '@nordicsemiconductor/pc-nrfconnect-shared';

import './NameBar.scss';

interface NameBarProps {
    name: string;
    /**
     * A callback function to update the name.
     *
     * @callback onChange
     * @param {string} name - The new name.
     * @returns {void}
     */
    onChange: (name: string) => void;
    children?: React.ReactNode;
}

/**
 * NameBar is a generic component that displays a name and allows to edit it.
 * This component is prepared to be used as a deviceSelector of {@link @nordicsemiconductor/pc-nrfconnect-shared}.
 *
 * The style is synchronized with the {@link @nordicsemiconductor/pc-nrfconnect-shared} style.
 *
 * @component NameBar
 * @param {string} name - the name to display and edit
 * @param {onChange} onChange - the function to call when the name is changed
 * @param {React.ReactNode} [children] - additional elements to display next to the name
 * @returns {JSX.Element} - the rendered NameBar component
 *
 * @example
 * import React, { useState } from 'react';
 * import NameBar from './NameBar';
 *
 * const App = () => {
 *     const [name, setName] = useState('Device 1');
 *
 *     return (
 *         <NameBar name={name} onChange={setName}>
 *             <button onClick={() => console.log('Button clicked')}>Click me</button>
 *         </NameBar>
 *     );
 * };
 *
 * export default App;
 */
const NameBar: React.FC<NameBarProps> = ({ name, onChange, children }) => (
    <div>
        <InlineInput value={name} onChange={onChange} className="NameBar" />
        {children}
    </div>
);

export default NameBar;
