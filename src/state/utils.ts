import StateCore from "markdown-it/lib/rules_core/state_core"
import Token from "markdown-it/lib/token"

export enum TargetKind {
  equation = "eq",
  figure = "fig",
  table = "table",
  code = "code",
  section = "sec"
}

export type Target = {
  name: string
  kind: TargetKind | string
  title: string
  number: number
}

export type Reference = {
  name: string
  tokens: { open: Token; content: Token; close: Token }
  kind?: TargetKind | string
  contentFromTarget?: (target: Target) => string
}

export type DocState = {
  // Targets are something to link to, they are aranged by `name`, use `newTarget`
  targets: Record<string, Target>
  // Use `resolveRefLater` function to provide a reference that will resolve
  references: Reference[]
  // Keep track of numbering totals for any known, or arbitrary targets
  numbering: Record<TargetKind | string, number>
}

export type MetaState = {
  target: Target
}

/** Safely create the document state for docutils */
export function getDocState(state: StateCore): DocState {
  const env = (state.env?.docutils as DocState) ?? {}
  if (!env.targets) env.targets = {}
  if (!env.references) env.references = []
  if (!env.numbering) env.numbering = {}
  if (!state.env.docutils) state.env.docutils = env
  return env
}

/** Safely create a namespaced meta information on a token */
export function getNamespacedMeta(token: Token): MetaState {
  const meta = token.meta?.docutils ?? {}
  if (!token.meta) token.meta = {}
  if (!token.meta.docutils) token.meta.docutils = meta
  return meta
}

/** Get the next number for an equation, figure, code or table
 *
 * Can input `{ docutils: { numbering: { eq: 100 } } }` to start counting at a different number.
 *
 * @param state MarkdownIt state that will be modified
 */
function nextNumber(state: StateCore, kind: TargetKind | string) {
  const env = getDocState(state)
  if (env.numbering[kind] == null) {
    env.numbering[kind] = 1
  } else {
    env.numbering[kind] += 1
  }
  return env.numbering[kind]
}

/** Create a new internal target.
 *
 * @param state MarkdownIt state that will be modified
 * @param name The reference name that will be used for the target. Note some directives use label.
 * @param kind The target kind: "eq", "code", "table" or "fig"
 */
export function newTarget(
  state: StateCore,
  token: Token,
  kind: TargetKind,
  name: string,
  title: string,
  silent = false
): Target {
  const env = getDocState(state)
  const number = nextNumber(state, kind)
  const target: Target = {
    name,
    kind,
    number,
    title
  }
  if (!silent) {
    // Put the token in both the token.meta and the central environment
    const meta = getNamespacedMeta(token)
    meta.target = target
    token.attrSet("id", name)
    // TODO: raise error on duplicates
    env.targets[name] = target
  }
  return target
}

export function resolveRefLater(
  state: StateCore,
  tokens: Reference["tokens"],
  name: string,
  opts?: {
    kind?: TargetKind
    contentFromTarget?: Reference["contentFromTarget"]
  }
): void {
  const env = getDocState(state)
  env.references.push({
    name,
    tokens,
    ...opts
  })
}
