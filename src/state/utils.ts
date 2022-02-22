import StateCore from "markdown-it/lib/rules_core/state_core"
import Token from "markdown-it/lib/token"

/** The kind of the target as a TargetKind enum ('fig', 'eq', etc.) */
export enum TargetKind {
  equation = "eq",
  figure = "fig",
  table = "table",
  code = "code",
  section = "sec"
}

/**
 * Targets are created by figures or equations.
 * They are "things" that you can reference in documentation, e.g. Figure 1.
 */
export type Target = {
  /** The identifier or label of the target. */
  name: string
  /** TargetKind enum ('fig', 'eq', etc.) or a custom string */
  kind: TargetKind | string
  /** The default title that may be resolved in other places in a document. */
  title: string // TODO: This should support markdown.
  /** This is the number that will be given to this target.
   * Note that it may be a `Number` or a `String` depending on
   * if there is Section numbering in place (e.g. `Figure 1.2`)
   */
  number: number | string
}

export type Reference = {
  /** The identifier or label of the target. */
  name: string
  tokens: { open: Token; content: Token; close: Token }
  /** TargetKind enum ('fig', 'eq', etc.) or a custom string */
  kind?: TargetKind | string
  /** Return the content that should be shown in a reference given a target.
   *
   * For example, in a `numref`, you will replace `%s` with the `target.number`.
   */
  contentFromTarget?: (target: Target) => string
}

/**
 * The `DocState` keeps track of targets, references and numbering.
 *
 * This is on the the state.env (see `getDocState`), and there
 * should only be one per markdown-it instance.
 */
export type DocState = {
  // Targets are something to link to, they are aranged by `name`, use `newTarget`
  targets: Record<string, Target>
  // Use `resolveRefLater` function to provide a reference that will resolve
  references: Reference[]
  // Keep track of numbering totals for any known, or arbitrary targets
  numbering: Record<TargetKind | string, number> // TODO: this can also be a string
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

/**
 * This is the information on `token.meta.docutils`
 */
export type MetaState = {
  /** Target included in the `token.meta.docutils` state. */
  target: Target
}

/**
 * Safely create a namespaced meta information on a token
 * @param token A markdown-it token that will contain the target
 * @returns An object containing a `Target`
 */
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

/**
 * Resolve a reference **in-place** in a following numbering pass.
 *
 * @param state Reference to the state object
 * @param tokens The open/content/close tokens of the reference
 * @param name Name/label/identifier of the target
 * @param opts Includes the reference `kind` and an optional way to create the reference content
 */
export function resolveRefLater(
  state: StateCore,
  tokens: Reference["tokens"],
  data: { name: string; kind: string; value?: string },
  opts?: {
    kind?: TargetKind
    contentFromTarget?: Reference["contentFromTarget"]
  }
): void {
  tokens.open.meta = tokens.open.meta ?? {}
  tokens.open.meta.kind = data.kind
  tokens.open.meta.name = data.name
  tokens.open.meta.value = data.value
  const env = getDocState(state)
  env.references.push({
    name: data.name,
    tokens,
    ...opts
  })
}
