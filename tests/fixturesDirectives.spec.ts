/* eslint-disable jest/valid-title */
import MarkdownIt from "markdown-it"
import docutils_plugin from "../src"
import readFixtures from "./readFixtures"

describe("Parses directives", () => {
  readFixtures("directives").forEach(([name, text, expected]) => {
    const mdit = MarkdownIt().use(docutils_plugin)
    const rendered = mdit.render(text)
    // console.log(rendered)
    it(name, () => expect(rendered.trim()).toEqual((expected || "").trim()))
  })
})

describe("Parses math directives", () => {
  readFixtures("directives.math").forEach(([name, text, expected]) => {
    const mdit = MarkdownIt().use(docutils_plugin)
    // TODO for now we add a basic renderer
    mdit.renderer.rules.math_block = (tokens, idx) => {
      return `<div class="math block">\n${tokens[idx].content.trimRight()}\n</div>`
    }
    const rendered = mdit.render(text)
    // console.log(rendered)
    it(name, () => expect(rendered.trim()).toEqual((expected || "").trim()))
  })
})
