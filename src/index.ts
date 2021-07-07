import type MarkdownIt from "markdown-it/lib"
import { admonitions } from "./directives/admonitions"
import { code } from "./directives/code"
import { images } from "./directives/images"
import directivePlugin, { IOptions as IDirectiveOptions } from "./directives/plugin"
import { roles } from "./roles/main"
import rolePlugin, { IOptions as IRoleOptions } from "./roles/plugin"

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
  directives: { ...admonitions, ...images, ...code },
  roles: { ...roles }
}

/**
 * A markdown-it plugin for implementing docutils style roles and directives.
 */
export default function docutilsPlugin(md: MarkdownIt, options?: IOptions): void {
  const fullOptions = { ...OptionDefaults, ...options }

  rolePlugin(md, fullOptions)
  directivePlugin(md, fullOptions)
}
