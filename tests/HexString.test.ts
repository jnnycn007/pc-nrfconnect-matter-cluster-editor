/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { HexString } from '../src/app/defines';

describe('HexString class', () => {
    describe('constructor', () => {
        it('should correctly format number input', () => {
            const hex = new HexString(4660); // Decimal 4660 = Hex 0x1234
            expect(hex.toString()).toBe('0x1234');
        });

        it('should filter out non-hex characters from string input', () => {
            const hex = new HexString('abcdXYZ123');
            expect(hex.toString()).toBe('0xabcd123');
        });

        it('should preserve 0x prefix and filter non-hex characters', () => {
            const hex = new HexString('0xABCDxyz');
            expect(hex.toString()).toBe('0xabcd');
        });

        it('should return 0x0 when only invalid characters are provided', () => {
            const hex = new HexString('XYZ');
            expect(hex.toString()).toBe('0x0');
        });

        it('should correctly format valid hex string input', () => {
            const hex = new HexString('123ABC');
            expect(hex.toString()).toBe('0x123abc');
        });
    });

    describe('toNumber', () => {
        it('should correctly convert hex string to number', () => {
            const hex = new HexString('0x1234');
            expect(hex.toNumber()).toBe(4660);
        });
    });

    describe('static methods', () => {
        describe('fromNumber', () => {
            it('should create a HexString from a number', () => {
                const hex = HexString.fromNumber(4660);
                expect(hex.toString()).toBe('0x1234');
            });
        });

        describe('fromString', () => {
            it('should create a HexString from a string', () => {
                const hex = HexString.fromString('0xabcd');
                expect(hex.toString()).toBe('0xabcd');
            });
        });

        describe('isValidHexChar', () => {
            it('should return true for valid hex characters', () => {
                expect(HexString.isValidHexChar('A')).toBe(true);
                expect(HexString.isValidHexChar('f')).toBe(true);
                expect(HexString.isValidHexChar('7')).toBe(true);
            });

            it('should return false for invalid hex characters', () => {
                expect(HexString.isValidHexChar('G')).toBe(false);
                expect(HexString.isValidHexChar('z')).toBe(false);
                expect(HexString.isValidHexChar('!')).toBe(false);
            });
        });

        describe('sanitizeHexString', () => {
            it('should remove non-hex characters', () => {
                expect(HexString.sanitizeHexString('abcXYZ123')).toBe(
                    '0xabc123'
                );
            });

            it('should handle 0x prefix correctly', () => {
                expect(HexString.sanitizeHexString('0xABG')).toBe('0xab');
            });

            it('should return 0x0 when input has no valid hex characters', () => {
                expect(HexString.sanitizeHexString('#$%^&')).toBe('0x0');
            });
        });
    });
});
