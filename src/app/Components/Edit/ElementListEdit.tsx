/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    Box,
    DialogActions,
    DialogContent,
    DialogContentText,
    IconButton,
    List,
    ListItem,
} from '@mui/material';
import { Button, Dialog } from '@nordicsemiconductor/pc-nrfconnect-shared';

import InnerButton from './InnerButton';
import TextInputField from './TextInputField';

/**
 * A callback function that is called when the element changes.
 *
 * @callback onElementChange
 * @param {string} field - The field that changed
 * @param {any} value - The new value of the field
 * @returns {void}
 */

/**
 * The props for the ElementListEdit component.
 * @template T - The type of the element being edited
 */

interface ElementListEditProps<T> {
    element?: T;
    onElementChange?: (field: string, value: any) => void;
    arrayName: string;
    buttonLabel: string;
    tooltip?: string;
    buttonTooltip?: string;
}

/**
 * A component for editing arrays of elements with a single string property "_"
 * This component is intended to be used as a child of InnerElementEdit
 *
 * @component ElementListEdit
 * @param {T} element - The element being edited
 * @param {onElementChange} onElementChange - callback to update the element
 * @param {string} arrayName - The name of the array to edit
 * @param {string} buttonLabel - The label for the button that opens the dialog
 * @param {string} [tooltip] - Tooltip text for the edit fields
 * @param {string} [buttonTooltip] - Tooltip text for the button that opens the dialog
 *
 * @returns {JSX.Element} The component
 *
 * @example
 * import React from 'react';
 * import ElementListEdit from './Components/Edit/ElementListEdit';
 *
 * const ExampleComponent = () => {
 *     const [element, setElement] = useState({ arrayName: ['item1', 'item2'] });
 *
 *     const onElementChange = (field, value) => {
 *         setElement(prev => ({ ...prev, [field]: value }));
 *     };
 *
 *     return (
 *         <ElementListEdit
 *             element={element}
 *             onElementChange={onElementChange}
 *             arrayName="arrayName"
 *             buttonLabel="Edit Items"
 *             tooltip="Edit the list of items"
 *             buttonTooltip="Click to open the editor"
 *         />
 *     );
 * };
 */
const ElementListEdit = <T,>({
    element,
    onElementChange,
    arrayName,
    buttonLabel,
    tooltip,
    buttonTooltip,
}: ElementListEditProps<T>) => {
    const [internalList, setInternalList] = useState<string[]>(
        (element as any)[arrayName] || []
    );
    const [showDialog, setShowDialog] = useState<boolean>(false);

    // Update internal list when element changes
    useEffect(() => {
        setInternalList((element as any)[arrayName] || []);
    }, [element, arrayName]);

    // Early return if element is not provided (shouldn't happen in practice)
    if (!element || onElementChange === undefined) {
        return null;
    }
    // Initialize array if it doesn't exist
    if (!element[arrayName as keyof T]) {
        (element as any)[arrayName] = [];
    }

    const handleAddElement = () => {
        setInternalList([...internalList, '']);
    };

    const handleDeleteElement = (index: number) => {
        setInternalList(internalList.filter((_, i) => i !== index));
    };

    const handleValueChange = (index: number, value: string) => {
        const updatedList = [...internalList];
        updatedList[index] = value;
        setInternalList(updatedList);
    };

    const handleSave = () => {
        // Filter out empty values
        const cleanedList = internalList.filter(item => item !== '');
        onElementChange(arrayName, cleanedList);
        setShowDialog(false);
    };

    return (
        <>
            <InnerButton
                label={buttonLabel}
                badgeContent={internalList.length}
                onClick={() => setShowDialog(true)}
                tooltip={buttonTooltip}
            />

            <Dialog isVisible={showDialog} onHide={() => setShowDialog(false)}>
                <DialogContent>
                    <DialogContentText variant="h6">
                        Edit {buttonLabel}
                    </DialogContentText>
                    <DialogContentText variant="body2">
                        Enter the names of required elements.
                    </DialogContentText>
                    <br />

                    <IconButton color="primary" onClick={handleAddElement}>
                        <AddIcon />
                    </IconButton>

                    <List>
                        {internalList.map((item, index) => (
                            <ListItem key={index} className="innerListItem">
                                <Box
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        width: '100%',
                                    }}
                                >
                                    <TextInputField
                                        field=""
                                        value={item || ''}
                                        tooltip={tooltip}
                                        onChange={v =>
                                            handleValueChange(
                                                index,
                                                v as string
                                            )
                                        }
                                        fullWidth
                                    />
                                    <div className="innerDeleteButton">
                                        <IconButton
                                            edge="end"
                                            aria-label="delete"
                                            onClick={() =>
                                                handleDeleteElement(index)
                                            }
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </div>
                                </Box>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setShowDialog(false)}
                        variant="secondary"
                        size="xl"
                    >
                        Cancel
                    </Button>
                    <Button onClick={handleSave} variant="primary" size="xl">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default ElementListEdit;
