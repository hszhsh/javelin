import { Component } from "./component"

export enum WorldOpType {
  Spawn,
  Attach,
  Detach,
  Mutate,
  Destroy,
}

export type SpawnOp = [WorldOpType.Spawn, number, ReadonlyArray<Component>]
export type AttachOp = [WorldOpType.Attach, number, ReadonlyArray<Component>]
export type DetachOp = [WorldOpType.Detach, number, ReadonlyArray<number>]
export type DestroyOp = [WorldOpType.Destroy, number]

export type WorldOp = SpawnOp | AttachOp | DetachOp | DestroyOp
