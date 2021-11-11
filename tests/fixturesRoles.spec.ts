/* eslint-disable jest/valid-title */
import MarkdownIt from "markdown-it"
import docutils_plugin from "../src"
import readFixtures from "./readFixtures"

describe("Parses roles", () => {
  readFixtures("roles").forEach(([name, text, expected]) => {
    const mdit = MarkdownIt().use(docutils_plugin)
    const rendered = mdit.render(text)
    it(name, () => expect(rendered.trim()).toEqual((expected || "").trim()))
  })
  readFixtures("roles.html").forEach(([name, text, expected]) => {
    const mdit = MarkdownIt().use(docutils_plugin)
    const rendered = mdit.render(text)
    it(name, () => expect(rendered.trim()).toEqual((expected || "").trim()))
  })
})
