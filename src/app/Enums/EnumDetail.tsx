/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import * as React from 'react';

import DetailsBox from '../Components/Details/DetailsBox';
import ListPropertiesDetails from '../Components/Details/ListPropertiesDetails';
import { XMLEnum } from '../defines';

/**
 * Implementation of content for DetailBox component dedicated to XMLEnum.
 *
 * The EnumDetails component displays detailed information about Matter enumeration definitions
 * in a structured format. It shows the enumeration items (name-value pairs) and the clusters
 * to which the enumeration is assigned.
 *
 * This component is part of the Matter Manufacturer Cluster Editor application and serves as
 * the details view when a user expands an enum row in the EnumsTable component.
 *
 * Component hierarchy:
 * - EnumsTable uses EnumDetails to render expanded enum details
 * - EnumDetails uses DetailsBox as its container component
 * - EnumDetails uses ListPropertiesDetails to display cluster assignments
 *
 * In the Matter specification, enumerations provide a way to define named constants that
 * represent specific values, making code more readable and maintainable. This component
 * visualizes these definitions for the user.
 *
 * @param {XMLEnum} props - The enum data to display
 * @param {Object} props.$ - Object containing basic enum properties
 * @param {Array} props.cluster - Array of clusters the enum is assigned to
 * @param {Array} props.item - Array of enum items with name-value pairs
 * @returns {JSX.Element} The rendered EnumDetails component
 */
const EnumDetails: React.FC<XMLEnum> = ({ cluster, item }) => (
    <DetailsBox
        innerElements={[
            {
                name: 'Item',
                element:
                    item?.map(i => ({
                        name: i.$.name,
                        value: i.$.value,
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

export default EnumDetails;
