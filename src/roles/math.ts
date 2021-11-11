import MarkdownIt from "markdown-it"
import type Token from "markdown-it/lib/token"
import { IRoleData, Role } from "./main"

const INLINE_MATH_RULE = "math_inline"

export class Math extends Role {
  run(data: IRoleData): Token[] {
    const inline = new this.state.Token(INLINE_MATH_RULE, "span", 0)
    inline.attrSet("class", "math inline")
    inline.markup = "$"
    inline.content = data.content
    return [inline]
  }
}

export interface IOptions {
  roles?: Record<string, typeof Role>
  mathRenderer?: (content: string, opts: { displayMode: boolean }) => string
}

export function inlineMathRenderer(md: MarkdownIt, options?: IOptions): void {
  // Only create the renderer if it does not exist
  // For example, this may be defined in markdown-it-dollarmath
  if (!options?.roles?.math || md.renderer.rules[INLINE_MATH_RULE]) return

  md.renderer.rules[INLINE_MATH_RULE] = (tokens, idx) => {
    const renderer = options?.mathRenderer ?? (c => md.utils.escapeHtml(c))
    const token = tokens[idx]
    const content = token.content.trim()
    const math = renderer(content, { displayMode: false })
    return `<span class="${token.attrGet("class")}">${math}</span>`
  }
}

export const math = {
  math: Math
}
