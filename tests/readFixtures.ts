import fs from "fs"
import type MarkdownIt from "markdown-it"

/** Read a "fixtures" file, containing a set of tests:
 *
 * test name
 * .
 * input text
 * .
 * expected output
 * .
 *
 * */
export default function readFixtures(name: string): string[][] {
  const fixtures = fs.readFileSync(`tests/fixtures/${name}.md`).toString()
  return fixtures.split("\n.\n\n").map(s => s.split("\n.\n"))
}

/**
 * The markdown math renderers are in other packages. This is for tests.
 */
export function basicMathRenderer(mdit: MarkdownIt): void {
  mdit.renderer.rules.math_block = (tokens, idx) => {
    const token = tokens[idx]
    return `<div class="math block"${
      token.meta?.label ? ` id="${token.meta.label}"` : ""
    }${
      token.meta?.number ? ` number="${token.meta.number}"` : ""
    }>\n${token.content.trimRight()}\n</div>\n`
  }
}
