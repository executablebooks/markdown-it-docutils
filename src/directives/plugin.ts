import type MarkdownIt from "markdown-it"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import type Token from "markdown-it/lib/token"
import directiveToData, { Directive } from "./main"

/** Allowed options for directive plugin */
export interface IOptions {
  /** Replace fence tokens with directive tokens, if there language is of the form `{name}` */
  replaceFences?: boolean
  /** Core rule to run directives after (default: block or fence_to_directive) */
  directivesAfter?: string
  /** Mapping of names to directives */
  directives?: { [key: string]: typeof Directive }
  // TODO new token render rules
}

export default function directivePlugin(md: MarkdownIt, options: IOptions): void {
  let after = options.directivesAfter || "block"
  if (options.replaceFences) {
    md.core.ruler.after(after, "fence_to_directive", replaceFences)
    after = "fence_to_directive"
  }
  md.core.ruler.after(after, "run_directives", runDirectives(options.directives || {}))

  // fallback renderer for unhandled directives
  md.renderer.rules["directive"] = (tokens: Token[], idx: number) => {
    const token = tokens[idx]
    return `<aside class="directive-unhandled">\n<header><mark>${token.info}</mark><code> ${token.meta.arg}</code></header>\n<pre>${token.content}</pre></aside>\n`
  }
  md.renderer.rules["directive_error"] = (tokens: Token[], idx: number) => {
    const token = tokens[idx]
    let content = ""
    if (token.content) {
      content = `\n---\n${token.content}`
    }
    return `<aside class="directive-error">\n<header><mark>${token.info}</mark><code> ${token.meta.arg}</code></header>\n<pre>${token.meta.error_name}:\n${token.meta.error_message}\n${content}</pre></aside>\n`
  }
}

/** Convert fences identified as directives to `directive` tokens */
function replaceFences(state: StateCore): boolean {
  for (const token of state.tokens) {
    if (token.type === "fence") {
      const match = token.info.match(/^\{([^\s}]+)\}\s*(.*)$/)
      if (match) {
        token.type = "directive"
        token.info = match[1]
        token.meta = { arg: match[2] }
      }
    }
  }
  return true
}

/** Run all directives, replacing the original token */
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
