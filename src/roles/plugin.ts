/** Parse a role, in MyST format */
// Ported from https://github.com/executablebooks/markdown-it-py/blob/master/markdown_it/extensions/myst_role/index.py
// MIT License: https://github.com/executablebooks/markdown-it-py/blob/master/LICENSE

import type MarkdownIt from "markdown-it"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import type StateInline from "markdown-it/lib/rules_inline/state_inline"
import type Token from "markdown-it/lib/token"
import { Role } from "./main"

/** Allowed options for directive plugin */
export interface IOptions {
  /** Parse roles of the form `` {name}`content` `` */
  parseRoles?: boolean
  /** Core rule to run roles after (default: inline) */
  rolesAfter?: string
  /** Mapping of names to roles */
  roles?: { [key: string]: typeof Role }
}

export default function rolePlugin(md: MarkdownIt, options: IOptions): void {
  if (options.parseRoles) {
    md.inline.ruler.before("backticks", "parse_roles", roleRule)
  }
  md.core.ruler.after(
    options.rolesAfter || "inline",
    "run_roles",
    runRoles(options.roles || {})
  )
  // fallback renderer for unhandled roles
  md.renderer.rules["role"] = (tokens: Token[], idx: number) => {
    const token = tokens[idx]
    return `<span class="role-unhandled"><mark>${token.meta.name}</mark><code>${token.content}</code></span>`
  }
  // TODO role_error renderer
}

function roleRule(state: StateInline, silent: boolean): boolean {
  // Check if the role is escaped
  if (state.src.charCodeAt(state.pos - 1) === 0x5c) {
    /* \ */
    // TODO: this could be improved in the case of edge case '\\{', also multi-line
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

// MyST role syntax format e.g. {role}`text`
let _x: RegExp
try {
  _x = new RegExp("^\\{([a-zA-Z_\\-+:]{1,36})\\}(`+)(?!`)(.+?)(?<!`)\\2(?!`)")
} catch (error) {
  // Safari does not support negative look-behinds
  // This is a slightly down-graded variant, as it does not require a space.
  _x = /^\{([a-zA-Z_\-+:]{1,36})\}(`+)(?!`)(.+?)\2(?!`)/
}
const ROLE_PATTERN = _x

/** Run all roles, replacing the original token */
function runRoles(roles: {
  [key: string]: typeof Role
}): (state: StateCore) => boolean {
  function func(state: StateCore): boolean {
    for (const token of state.tokens) {
      if (token.type === "inline" && token.children) {
        const childTokens = []
        for (const child of token.children) {
          // TODO role name translations
          if (child.type === "role" && child.meta && child.meta.name in roles) {
            try {
              const role = new roles[child.meta.name](state)
              const newTokens = role.run({
                parentMap: token.map,
                content: child.content
              })
              childTokens.push(...newTokens)
            } catch (err) {
              const errorToken = new state.Token("role_error", "", 0)
              errorToken.content = child.content
              errorToken.info = child.info
              errorToken.meta = child.meta
              errorToken.map = child.map
              errorToken.meta.error_message = err.message
              errorToken.meta.error_name = err.name
              childTokens.push(errorToken)
            }
          } else {
            childTokens.push(child)
          }
        }
        token.children = childTokens
      }
    }
    return true
  }
  return func
}
