import type Token from "markdown-it/lib/token"
import { resolveRefLater, TargetKind } from "../state/utils"
import { IRoleData, Role } from "./main"

const REF_PATTERN = /^(.+?)<([^<>]+)>$/ // e.g. 'Labeled Reference <ref>'

export class Eq extends Role {
  run(data: IRoleData): Token[] {
    const open = new this.state.Token("ref_open", "a", 1)
    const content = new this.state.Token("text", "", 0)
    const close = new this.state.Token("ref_close", "a", -1)
    resolveRefLater(this.state, { open, content, close }, data.content, {
      kind: TargetKind.equation,
      contentFromTarget: target => {
        return `(${target.number})`
      }
    })
    return [open, content, close]
  }
}

export class NumRef extends Role {
  run(data: IRoleData): Token[] {
    const match = REF_PATTERN.exec(data.content)
    const [, modified, ref] = match ?? []
    const open = new this.state.Token("ref_open", "a", 1)
    const content = new this.state.Token("text", "", 0)
    const close = new this.state.Token("ref_close", "a", -1)
    resolveRefLater(this.state, { open, content, close }, ref || data.content, {
      contentFromTarget: target => {
        if (!match) return target.title.trim()
        return modified
          .replace(/%s/g, String(target.number))
          .replace(/\{number\}/g, String(target.number))
          .trim()
      }
    })
    return [open, content, close]
  }
}

export class Ref extends Role {
  run(data: IRoleData): Token[] {
    const open = new this.state.Token("ref_open", "a", 1)
    const content = new this.state.Token("text", "", 0)
    const close = new this.state.Token("ref_close", "a", -1)
    resolveRefLater(this.state, { open, content, close }, data.content, {
      contentFromTarget: target => {
        return target.title
      }
    })
    return [open, content, close]
  }
}

export const references = {
  eq: Eq,
  ref: Ref,
  numref: NumRef
}
