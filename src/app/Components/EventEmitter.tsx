/*
 * Copyright (c) 2025 Nordic Semiconductor ASA
 *
 * SPDX-License-Identifier: LicenseRef-Nordic-4-Clause
 */

import { EventEmitter } from 'events';

/**
 * Application-wide event emitter instance for handling communication between components.
 * This singleton instance allows components to subscribe to and emit events across the application.
 *
 * @module eventEmitter
 *
 * @example
 * import eventEmitter from './EventEmitter';
 *
 * // Subscribe to an event
 * const handleChange = (data) => {
 *   console.log('Data changed:', data);
 * };
 * eventEmitter.on('dataChanged', handleChange);
 *
 * // Emit an event
 * eventEmitter.emit('dataChanged', { id: 1, value: 'new value' });
 *
 * // Remove event listener when component unmounts
 * useEffect(() => {
 *   return () => {
 *     eventEmitter.off('dataChanged', handleChange);
 *   };
 * }, []);
 */
const eventEmitter = new EventEmitter();

export default eventEmitter;
