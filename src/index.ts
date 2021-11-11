import type MarkdownIt from "markdown-it/lib"
import { directives, Directive, directivePlugin, IDirectiveOptions } from "./directives"
import { roles, Role, rolePlugin, IRoleOptions } from "./roles"

export { directives, directivePlugin, Directive, roles, rolePlugin, Role }

/** Allowed options for docutils plugin */
export interface IOptions extends IDirectiveOptions, IRoleOptions {
  // TODO new token render rules
}

/** Default options for docutils plugin */
const OptionDefaults: IOptions = {
  parseRoles: true,
  replaceFences: true,
  rolesAfter: "inline",
  directivesAfter: "block",
  directives,
  roles
}

/**
 * A markdown-it plugin for implementing docutils style roles and directives.
 */
export default function docutilsPlugin(md: MarkdownIt, options?: IOptions): void {
  const fullOptions = { ...OptionDefaults, ...options }

  rolePlugin(md, fullOptions)
  directivePlugin(md, fullOptions)
}
