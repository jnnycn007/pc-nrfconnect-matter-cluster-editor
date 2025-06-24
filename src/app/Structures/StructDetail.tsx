/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import * as React from 'react';

import DetailsBox from '../Components/Details/DetailsBox';
import ListPropertiesDetails from '../Components/Details/ListPropertiesDetails';
import { XMLStruct } from '../defines';

/**
 * Implementation of content for DetailBox component dedicated to XMLStruct.
 *
 * The StructDetails component displays detailed information about Matter structure definitions
 * in a structured format. It shows the structure's fields (name-type pairs) and the clusters
 * to which the structure is assigned.
 *
 * This component is part of the Matter Manufacturer Cluster Editor application and serves as
 * the details view when a user expands a structure row in the StructTable component.
 *
 * Component hierarchy:
 * - StructTable uses StructDetails to render expanded structure details
 * - StructDetails uses DetailsBox as its container component
 * - StructDetails uses ListPropertiesDetails to display cluster assignments
 *
 * In the Matter specification, structures define complex data types that group multiple fields
 * together, similar to C structs or classes in other languages. These structures are used to
 * define the data format for attributes, command parameters, and event fields, enabling
 * complex data models within the Matter protocol.
 *
 * @param {XMLStruct} props - The structure data to display
 * @param {Object} props.$ - Object containing basic structure properties
 * @param {Array} props.cluster - Array of clusters the structure is assigned to
 * @param {Array} props.item - Array of structure fields with name-type pairs
 * @returns {JSX.Element} The rendered StructDetails component
 */
const StructDetails: React.FC<XMLStruct> = ({ item, cluster }) => (
    <DetailsBox
        innerElements={[
            {
                name: 'Item',
                element:
                    item?.map(i => ({
                        name: i.$.name,
                        type: i.$.type,
                    })) || [],
                size: 'm',
            },
        ]}
    >
        <ListPropertiesDetails
            textToDisplay="Assigned to the following cluster IDs:"
            items={cluster?.map(c => c.$.code.toString()) || []}
        />
    </DetailsBox>
);

export default StructDetails;
