/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import React from 'react';
import {
    DialogActions,
    DialogContent,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { Button, Dialog } from '@nordicsemiconductor/pc-nrfconnect-shared';

/**
 * OnClose is a callback function that is invoked when the user closes the detail box.
 * @callback onClose
 * @returns {void}
 */

/**
 * @template T - The template type of the object being displayed.
 */

interface InnerElementDetailsProps<T> {
    content: T[];
    open: boolean;
    onClose: () => void;
    size?: 'sm' | 'm' | 'lg' | 'xl';
}

/**
 * A InnerElementDetails component can be used to display additional details about the specific inner element of the Cluster component.
 * For instance if a cluster component can contain multiple inner elements provide them as an array to content prop.
 * The size is integrated with pc-nrfconnect-shared Dialog component so you can provide estimated size by using one of the pre-defined sizes:
 *
 * sm - small
 * m - medium
 * lg - large
 * xl - extra large
 *
 * @component InnerElementDetails
 * @param {T[]} content - The content to be displayed inside the detail box.
 * @param {boolean} open - A boolean flag indicating whether the detail box is open or closed.
 * @param {onClose} onClose - A function that closes the detail box.
 * @param {string} [size] - The size of the detail box.
 * @returns {React.ReactNode} The rendered InnerElementDetails component.
 *
 * @example
 * <InnerElementDetails
 *     content={[
 *         { name: 'John', age: 30 },
 *         { name: 'Doe', age: 25 },
 *     ]}
 *     open={true}
 *     onClose={() => console.log('Close')}
 *     size="sm"
 * />
 */
const InnerElementDetails = <T,>({
    content,
    open,
    onClose,
    size,
}: InnerElementDetailsProps<T>) => (
    <Dialog isVisible={open} onHide={onClose} size={size || 'sm'}>
        <DialogContent>
            {content.length > 0 && (
                <Table>
                    <TableHead>
                        <TableRow>
                            {Object.keys(content[0] as object).map(key => (
                                <TableCell
                                    key={key}
                                    sx={{ width: '30%' }}
                                    align="center"
                                >
                                    {key}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {content.map(elem => (
                            <TableRow key={`${String(elem)}-${Math.random()}`}>
                                {Object.values(elem as object).map(
                                    (value: unknown) => (
                                        <TableCell
                                            key={`${String(
                                                value
                                            )}-${Math.random()}`}
                                            sx={{ width: '30%' }}
                                            align="center"
                                        >
                                            {String(value)}
                                        </TableCell>
                                    )
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </DialogContent>
        <DialogActions>
            <Button variant="primary" onClick={onClose}>
                Close
            </Button>
        </DialogActions>
    </Dialog>
);

export default InnerElementDetails;
