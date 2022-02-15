import type MarkdownIt from "markdown-it"
import { RuleCore } from "markdown-it/lib/parser_core"
import type StateCore from "markdown-it/lib/rules_core/state_core"
import { getDocState, Target } from "./utils"

/** Allowed options for state plugin */
export type IOptions = Record<string, never> // TODO: Figure out state numbering options

function numberingRule(options: IOptions): RuleCore {
  return (state: StateCore) => {
    const env = getDocState(state)

    env.references.forEach(ref => {
      const { name, tokens, contentFromTarget } = ref

      const setError = (details: string, error?: Target) => {
        tokens.open.attrJoin("class", "error")
        tokens.open.tag = tokens.close.tag = "code"
        if (contentFromTarget && error) {
          tokens.content.content = contentFromTarget(error)
        } else {
          tokens.content.content = details
        }
        return true
      }

      const target = env.targets[name]
      if (!target)
        return setError(name, {
          kind: ref.kind || "",
          name,
          title: name,
          number: `"${name}"`
        })
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

/**
 * Create a rule that runs at the end of a markdown-it parser to go through all
 * references and add their targets.
 *
 * This `Rule` is done *last*, as you may reference a figure/equation, when that `Target`
 * has not yet been created. The references call `resolveRefLater` when they are being
 * created and pass their tokens such that the content of those tokens can be
 * dynamically updated.
 *
 * @param options (none currently)
 * @returns The markdown-it Rule
 */
export default function statePlugin(md: MarkdownIt, options: IOptions): void {
  md.core.ruler.push("docutils_number", numberingRule(options))
}
