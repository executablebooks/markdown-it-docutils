import type MarkdownIt from "markdown-it"
import { RuleCore } from "markdown-it/lib/parser_core"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import { getDocState } from "./utils"

/** Allowed options for state plugin */
export interface IOptions {
  // TODO: Figure out options
  autonumberFigures: boolean
}

function numberingRule(options: IOptions): RuleCore {
  return (state: StateCore) => {
    const env = getDocState(state)

    env.references.forEach(ref => {
      const { name, tokens, contentFromTarget } = ref

      function setError(details: string) {
        tokens.open.attrJoin("class", "error")
        tokens.open.tag = tokens.close.tag = "span"
        tokens.content.content = details
        return true
      }

      const target = env.targets[name]
      if (!target) {
        return setError(`Reference "${name}" not found`)
      }
      if (ref.kind && target.kind !== ref.kind) {
        return setError(`Reference "${name}" does not match kind "${ref.kind}"`)
      }
      tokens.open.attrSet("href", `#${target.name}`)
      if (target.title) tokens.open.attrSet("title", target.title)
      if (contentFromTarget) tokens.content.content = contentFromTarget(target).trim()
    })

    // TODO: Math that wasn't pre-numbered?
    return true
  }
}

export default function statePlugin(md: MarkdownIt, options: IOptions): void {
  md.core.ruler.push("docutils_number", numberingRule(options))
}
