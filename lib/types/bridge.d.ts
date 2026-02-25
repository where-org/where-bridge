import type * as Where from '@where-org/where-common';

// lib/bridge.js 

export type Bridge = null;
export type BridgeInit = (dir: string) => Promise<Bridge>;

// const

export declare const bridge: BridgeInit;
export declare const log: Where.Log;
