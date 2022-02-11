/**
 * This module contains roles that directly map to HTML semantic tags
 */
import type Token from "markdown-it/lib/token"
import { IRoleData, Role } from "./main"

export class Subscript extends Role {
  run(data: IRoleData): Token[] {
    const open = new this.state.Token("sub_open", "sub", 1)
    open.markup = "~"
    const text = new this.state.Token("text", "", 0)
    text.content = data.content
    const close = new this.state.Token("sub_close", "sub", -1)
    close.markup = "~"
    return [open, text, close]
  }
}

export class Superscript extends Role {
  run(data: IRoleData): Token[] {
    const open = new this.state.Token("sup_open", "sup", 1)
    open.markup = "~"
    const text = new this.state.Token("text", "", 0)
    text.content = data.content
    const close = new this.state.Token("sup_close", "sup", -1)
    close.markup = "~"
    return [open, text, close]
  }
}

const ABBR_PATTERN = /^(.+?)\(([^()]+)\)$/ // e.g. 'CSS (Cascading Style Sheets)'

export class Abbreviation extends Role {
  run(data: IRoleData): Token[] {
    const match = ABBR_PATTERN.exec(data.content)
    const content = match?.[1]?.trim() ?? data.content.trim()
    const title = match?.[2]?.trim() ?? null
    const open = new this.state.Token("abbr_open", "abbr", 1)
    if (title) open.attrSet("title", title)
    const text = new this.state.Token("text", "", 0)
    text.content = content
    const close = new this.state.Token("abbr_close", "abbr", -1)
    return [open, text, close]
  }
}

export const html = {
  // Subscript
  subscript: Subscript,
  sub: Subscript,
  // Superscript
  superscript: Superscript,
  sup: Superscript,
  // Abbreviation
  abbreviation: Abbreviation,
  abbr: Abbreviation
}
