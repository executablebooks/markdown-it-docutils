import type { Directive } from "./main"

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
