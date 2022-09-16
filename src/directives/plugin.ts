import type MarkdownIt from "markdown-it/lib"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import directiveToData, { Directive, parseDirectiveOptions } from "./main"
import { IOptions } from "./types"

export default function directivePlugin(md: MarkdownIt, options: IOptions): void {
  let after = options.directivesAfter || "block"
  if (options.replaceFences ?? true) {
    md.core.ruler.after(after, "fence_to_directive", replaceFences)
    after = "fence_to_directive"
  }
  md.core.ruler.after(after, "run_directives", runDirectives(options.directives || {}))

  // fallback renderer for unhandled directives
  md.renderer.rules["directive"] = (tokens, idx) => {
    const token = tokens[idx]
    return `<aside class="directive-unhandled">\n<header><mark>${token.info}</mark><code> ${token.meta.arg}</code></header>\n<pre>${token.content}</pre></aside>\n`
  }
  md.renderer.rules["directive_error"] = (tokens, idx) => {
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
    if (token.type === "fence" || token.type === "colon_fence") {
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
          const [content] = parseDirectiveOptions(
            token.content.trim() ? token.content.split(/\r?\n/) : [],
            directive
          )
          const directiveOpen = new state.Token("parsed_directive_open", "", 1)
          directiveOpen.info = token.info
          directiveOpen.hidden = true
          directiveOpen.content = content.join("\n").trim()
          directiveOpen.meta = {
            arg: token.meta.arg,
            opts: data.options
          }
          const newTokens = [directiveOpen]
          newTokens.push(...directive.run(data))
          const directiveClose = new state.Token("parsed_directive_close", "", -1)
          directiveClose.hidden = true
          newTokens.push(directiveClose)
          finalTokens.push(...newTokens)
        } catch (err) {
          const errorToken = new state.Token("directive_error", "", 0)
          errorToken.content = token.content
          errorToken.info = token.info
          errorToken.meta = token.meta
          errorToken.map = token.map
          errorToken.meta.error_message = (err as Error).message
          errorToken.meta.error_name = (err as Error).name
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
