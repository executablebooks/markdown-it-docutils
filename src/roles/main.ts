/* eslint-disable @typescript-eslint/no-explicit-any */

import type StateCore from "markdown-it/lib/rules_core/state_core"
import type Token from "markdown-it/lib/token"

/** Data structure of a role */
export interface IRoleData {
  /** The map of the containing inline token */
  parentMap: [number, number] | null
  // TODO how to get line and position in line?
  content: string
  // TODO validate/convert
  options?: { [key: string]: any }
}

/** A class to define a single role */
export class Role {
  public state: StateCore
  constructor(state: StateCore) {
    this.state = state
  }
  /** Convert the role to tokens */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  run(data: IRoleData): Token[] {
    return []
  }
}

export class RawRole extends Role {
  run(data: IRoleData): Token[] {
    // TODO options
    const token = new this.state.Token("code_inline", "code", 0)
    token.content = data.content
    return [token]
  }
}

export const main = {
  raw: RawRole
}
