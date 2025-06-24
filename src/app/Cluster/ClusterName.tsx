/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React, { useEffect, useState } from 'react';

import ClusterFile from '../Components/ClusterFile';
import eventEmitter from '../Components/EventEmitter';
import NameBar from '../Components/NameBar/NameBar';

/**
 * Implementation of the `ClusterName` component dedicated to `XMLCluster`.
 *
 * The ClusterName component is a presentation component that displays and allows users to edit
 * the name of a Matter cluster. It is part of the editing workflow in the application:
 * - It displays the current cluster name
 * - It allows users to edit the name
 * - It synchronizes changes back to the XML representation of the cluster
 *
 * Component hierarchy:
 * - Used by the ClusterPage component to display and edit the cluster name
 * - Uses NameBar component to display and edit the name
 * - Interacts with ClusterFile singleton to access and modify the current XML data
 *
 * The component manages XML data synchronization, ensuring that the name is kept in sync across
 * different representation properties in the XML structure.
 *
 * @param {Object} props - The input props for the component.
 * @param {string} props.name - The current cluster name.
 * @returns {JSX.Element} The rendered `ClusterName` component.
 */
const ClusterName: React.FC = () => {
    const [name, setName] = useState(
        ClusterFile.XMLCurrentInstance.cluster.name
    );

    // Update the name when the XML instance changes
    useEffect(() => {
        eventEmitter.on('clusterEditNameChanged', value => {
            setName(value);
        });

        return () => {
            eventEmitter.off('clusterEditNameChanged', value => {
                setName(value);
            });
        };
    }, []);

    const nameBarChanged = (newName: string) => {
        setName(newName);
        eventEmitter.emit('clusterNameBarChanged', newName);
    };

    return <NameBar name={name} onChange={nameBarChanged} />;
};

export default ClusterName;
