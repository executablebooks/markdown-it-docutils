import type MarkdownIt from "markdown-it/lib"
import { rolesDefault, Role, rolePlugin, IRoleOptions } from "./roles"
import {
  directivesDefault,
  Directive,
  directivePlugin,
  IDirectiveOptions
} from "./directives"

export { rolesDefault, rolePlugin, Role }
export { directivesDefault, directivePlugin, Directive }

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
  directives: directivesDefault,
  roles: rolesDefault
}

/**
 * A markdown-it plugin for implementing docutils style roles and directives.
 */
export function docutilsPlugin(md: MarkdownIt, options?: IOptions): void {
  const fullOptions = { ...OptionDefaults, ...options }

  rolePlugin(md, fullOptions)
  directivePlugin(md, fullOptions)
}

// Note: Exporting default and the function as a named export.
//       This helps with Jest integration in downstream packages.
export default docutilsPlugin
