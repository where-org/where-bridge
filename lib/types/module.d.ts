import type * as Where from '@where-org/where-common';
import type { Client, Server, Socket } from '@where-org/where-client';

// where-toward-app-module

// interface

export interface TowardApp {

  end?
    (): Promise<void>;

}

// constructor parameters

// TowardAppConfig
export type TowardAppConfig = Where.Credentials;

// Env - where.env
export type Env<T = string | number> = Where.DataObject<T>;

// Common - where.common
export type Common = {

  file: Where.CommonFile,
  util: Where.CommonUtil,

};

// Cq - where.cq
export type Cq = {

  parse : Where.CqParse,
  string: Where.CqString,

};

// Da - where.da
export type Da = {
  filter: Where.DaFilter,
};

// TowardAppLib
export type TowardAppLib = {

  log: Where.Log,
  env: Env,

  common: Common,
  cq: Cq,
  da: Da,

  client: Client,
  server: Server,
  socket: Socket,

}

// shortcut

