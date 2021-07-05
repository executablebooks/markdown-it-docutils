import type MarkdownIt from "markdown-it/lib"
import { admonitions } from "./directives/admonitions"
import directivePlugin, { IOptions as IDirectiveOptions } from "./directives/plugin"
import rolePlugin from "./roles/plugin"

/** Allowed options for docutils plugin */
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IOptions extends IDirectiveOptions {
  // TODO new token render rules
}

/** Default options for docutils plugin */
const OptionDefaults: IOptions = {
  replaceFences: true,
  directivesAfter: "block",
  directives: { ...admonitions }
}

/**
 * A markdown-it plugin for implementing docutils style roles and directives.
 */
export default function docutilsPlugin(md: MarkdownIt, options?: IOptions): void {
  const fullOptions = { ...OptionDefaults, ...options }

  rolePlugin(md)
  directivePlugin(md, fullOptions)
}
