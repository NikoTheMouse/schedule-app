/**
 * Thrown by query stubs that ship in Phase 1 but have no implementation yet.
 * Real implementations land in Phase 2 (auth queries) and Phase 3 (groups, availability).
 */
export class NotImplementedError extends Error {
  constructor(fnName: string, shipsInPhase: string) {
    super(`${fnName} is not implemented yet — ships in ${shipsInPhase}`);
    this.name = "NotImplementedError";
  }
}
