/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { camelCaseToTitle, deepClone } from '../src/app/Components/Utils';

describe('Utils', () => {
    describe('camelCaseToTitle', () => {
        it('should convert simple camelCase to title case', () => {
            expect(camelCaseToTitle('deviceName')).toBe('Device Name');
            expect(camelCaseToTitle('userName')).toBe('User Name');
        });

        it('should handle single word inputs', () => {
            expect(camelCaseToTitle('device')).toBe('Device');
            expect(camelCaseToTitle('user')).toBe('User');
        });

        it('should handle multiple capital letters', () => {
            expect(camelCaseToTitle('deviceID')).toBe('Device ID');
            expect(camelCaseToTitle('userHTTPPreference')).toBe(
                'User HTTP Preference'
            );
        });

        it('should handle already capitalized first letter', () => {
            expect(camelCaseToTitle('DeviceName')).toBe('Device Name');
            expect(camelCaseToTitle('UserName')).toBe('User Name');
        });

        it('should handle inputs with numbers', () => {
            expect(camelCaseToTitle('device123Name')).toBe('Device123 Name');
            expect(camelCaseToTitle('user42Preference')).toBe(
                'User42 Preference'
            );
        });

        it('should handle inputs with acronyms', () => {
            expect(camelCaseToTitle('deviceJSON')).toBe('Device JSON');
            expect(camelCaseToTitle('userAPI')).toBe('User API');
        });

        it('should handle empty strings', () => {
            expect(camelCaseToTitle('')).toBe('');
        });

        it('should handle edge cases', () => {
            expect(camelCaseToTitle('a')).toBe('A');
            expect(camelCaseToTitle('ABC')).toBe('ABC');
        });
    });

    describe('deepClone', () => {
        it('should create a deep copy of a simple object', () => {
            const original = { name: 'Test', value: 42 };
            const clone = deepClone(original);

            // Verify it's a copy with the same values
            expect(clone).toEqual(original);

            // Verify it's a different object instance
            expect(clone).not.toBe(original);
        });

        it('should create a deep copy of nested objects', () => {
            const original = {
                name: 'Device',
                settings: {
                    enabled: true,
                    options: ['option1', 'option2'],
                },
            };

            const clone = deepClone(original);

            // Verify deep equality
            expect(clone).toEqual(original);

            // Verify they are different object instances
            expect(clone).not.toBe(original);
            expect(clone.settings).not.toBe(original.settings);
            expect(clone.settings.options).not.toBe(original.settings.options);
        });

        it('should allow modifications to the clone without affecting the original', () => {
            const original = {
                name: 'Device',
                settings: {
                    enabled: true,
                    options: ['option1', 'option2'],
                },
            };

            const clone = deepClone(original);

            // Modify the clone
            clone.name = 'Modified';
            clone.settings.enabled = false;
            clone.settings.options.push('option3');

            // Verify original is unchanged
            expect(original.name).toBe('Device');
            expect(original.settings.enabled).toBe(true);
            expect(original.settings.options).toEqual(['option1', 'option2']);

            // Verify clone has the new values
            expect(clone.name).toBe('Modified');
            expect(clone.settings.enabled).toBe(false);
            expect(clone.settings.options).toEqual([
                'option1',
                'option2',
                'option3',
            ]);
        });

        it('should handle arrays', () => {
            interface Item {
                id: number;
            }

            const original: Array<number | Item> = [1, 2, 3, { id: 4 }];
            const clone = deepClone(original);

            // Verify deep equality
            expect(clone).toEqual(original);

            // Verify they are different instances
            expect(clone).not.toBe(original);
            expect(clone[3]).not.toBe(original[3]);

            // Modify clone
            clone.push(5);

            // Type assertion to access the id property
            const lastItem = clone[3] as Item;
            lastItem.id = 99;

            // Verify original is unchanged
            expect(original.length).toBe(4);
            expect((original[3] as Item).id).toBe(4);
        });

        it('should handle empty objects and arrays', () => {
            const emptyObj = {};
            const emptyArr: Array<unknown> = [];

            const clonedObj = deepClone(emptyObj);
            const clonedArr = deepClone(emptyArr);

            expect(clonedObj).toEqual({});
            expect(clonedArr).toEqual([]);

            // Verify they are different instances
            expect(clonedObj).not.toBe(emptyObj);
            expect(clonedArr).not.toBe(emptyArr);
        });

        it('should handle primitive values', () => {
            expect(deepClone(42)).toBe(42);
            expect(deepClone('test')).toBe('test');
            expect(deepClone(true)).toBe(true);
            expect(deepClone(null)).toBe(null);
        });
    });
});
