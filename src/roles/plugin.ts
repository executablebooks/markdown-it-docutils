/** Parse a role, in MyST format */

import type MarkdownIt from "markdown-it"
import type StateInline from "markdown-it/lib/rules_inline/state_inline"
import type Token from "markdown-it/lib/token"

// Ported from https://github.com/executablebooks/markdown-it-py/blob/master/markdown_it/extensions/myst_role/index.py
// MIT License: https://github.com/executablebooks/markdown-it-py/blob/master/LICENSE

// e.g. {role}`text`
let _x: RegExp
try {
  _x = new RegExp("^\\{([a-zA-Z_\\-+:]{1,36})\\}(`+)(?!`)(.+?)(?<!`)\\2(?!`)")
} catch (error) {
  // Safari does not support negative look-behinds
  // This is a slightly down-graded variant, as it does not require a space.
  _x = /^\{([a-zA-Z_\-+:]{1,36})\}(`+)(?!`)(.+?)\2(?!`)/
}
const ROLE_PATTERN = _x

export default function rolePlugin(md: MarkdownIt): void {
  md.inline.ruler.before("backticks", "parse_role", roleRule)
  // fallback renderer for unhandled roles
  md.renderer.rules["role"] = (tokens: Token[], idx: number) => {
    const token = tokens[idx]
    return `<span class="role-unhandled"><mark>${token.meta.name}</mark><code>${token.content}</code></span>`
  }
}

function roleRule(state: StateInline, silent: boolean): boolean {
  // Check if the role is escaped
  if (state.src.charCodeAt(state.pos - 1) === 0x5c) {
    /* \ */
    // TODO: this could be improved in the case of edge case '\\{'
    return false
  }
  const match = ROLE_PATTERN.exec(state.src.slice(state.pos))
  if (match == null) return false
  const [str, name, , content] = match
  // eslint-disable-next-line no-param-reassign
  state.pos += str.length

  if (!silent) {
    const token = state.push("role", "", 0)
    token.meta = { name }
    token.content = content
  }
  return true
}
