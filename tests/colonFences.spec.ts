/* eslint-disable jest/valid-title */
import MarkdownIt from "markdown-it"
import docutils_plugin from "../src"
import readFixtures from "./readFixtures"

describe("Parses colonFences", () => {
  test("colon fences parse", () => {
    const mdit = MarkdownIt().use(docutils_plugin)
    const parse = mdit.parse(`:::{tip}\nThis is a tip in a fence!\n:::`, {})
    expect(parse[0].type).toBe("parsed_directive_open")
  })
  test("colon fences render", () => {
    const mdit = MarkdownIt().use(docutils_plugin)
    const rendered = mdit.render(`:::{tip}\nfence\n:::`)
    expect(rendered.trim()).toEqual(
      '<aside class="admonition tip">\n<header class="admonition-title">Tip</header>\n<p>fence</p>\n</aside>'
    )
  })
})

describe("Parses fenced directives", () => {
  readFixtures("directives.fence").forEach(([name, text, expected]) => {
    const mdit = MarkdownIt().use(docutils_plugin)
    const rendered = mdit.render(text)
    it(name, () => expect(rendered.trim()).toEqual((expected || "").trim()))
  })
})
