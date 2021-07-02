import type MarkdownIt from "markdown-it/lib"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import { admonitions } from "./directives/admonitions"
import directiveToData, { Directive } from "./directives/directiveStructure"

export interface IOptions {
  /** Replace fence tokens with directive tokens, if there language is of the form `{name}` */
  replaceFences?: boolean
  /** Core rule to run directives after */
  directivesAfter?: string
  /** Mapping of names to directives */
  directives?: { [key: string]: typeof Directive }
  // TODO new token render rules
}

const OptionDefaults: IOptions = {
  replaceFences: true,
  directivesAfter: "block",
  directives: { ...admonitions }
}

/**
 * A markdown-it plugin for implementing docutils style roles and directives.
 */
export default function docutilsPlugin(md: MarkdownIt, options?: IOptions): void {
  const fullOptions = { ...OptionDefaults, ...options }
  let after = fullOptions.directivesAfter || "block"
  if (fullOptions.replaceFences) {
    md.core.ruler.after(after, "fence_to_directive", replaceFences)
    after = "fence_to_directive"
  }
  md.core.ruler.after(
    after,
    "run_directives",
    runDirectives(fullOptions.directives || {})
  )

  // fallback renderer for unhandled directives
  md.renderer.rules["directive"] = (tokens, idx) => {
    const token = tokens[idx]
    // TODO: improve, and add default CSS?
    return `<aside class="directive-unhandled">\n<header><mark>${token.info}</mark><code> ${token.meta.arg}</code></header>\n<pre>${token.content}</pre></aside>\n`
  }
  md.renderer.rules["directive_error"] = (tokens, idx) => {
    const token = tokens[idx]
    // TODO: improve, and add default CSS?
    // TODO add error name & message
    return `<aside class="directive-error">\n<header><mark>${token.info}</mark><code> ${token.meta.arg}</code></header>\n<pre>${token.content}</pre></aside>\n`
  }
}

/** Convert fences identified as directives to `directive` tokens */
function replaceFences(state: StateCore): boolean {
  for (const token of state.tokens) {
    if (token.type === "fence") {
      const match = token.info.match(/^\{([a-z]*)\}\s*(.*)$/)
      if (match) {
        token.type = "directive"
        token.info = match[1]
        token.meta = { arg: match[2] }
      }
    }
  }
  return true
}

/** Run all directives, replacing the original token  */
function runDirectives(directives: {
  [key: string]: typeof Directive
}): (state: StateCore) => boolean {
  function func(state: StateCore): boolean {
    const finalTokens = []
    for (const token of state.tokens) {
      // TODO directive name translations
      if (token.type === "directive" && token.info in directives) {
        try {
          const directive = new directives[token.info](state)
          const data = directiveToData(token, directive)
          const newTokens = directive.run(data)
          finalTokens.push(...newTokens)
        } catch (err) {
          const errorToken = new state.Token("directive_error", "", 0)
          errorToken.content = token.content
          errorToken.info = token.info
          errorToken.meta = token.meta
          errorToken.map = token.map
          errorToken.meta.error_message = err.message
          errorToken.meta.error_name = err.name
          finalTokens.push(errorToken)
        }
      } else {
        finalTokens.push(token)
      }
    }
    state.tokens = finalTokens
    return true
  }
  return func
}