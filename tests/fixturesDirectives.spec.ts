/* eslint-disable jest/valid-title */
import MarkdownIt from "markdown-it"
import docutils_plugin from "../src"
import readFixtures, { basicMathRenderer } from "./readFixtures"

describe("Parses directives", () => {
  readFixtures("directives").forEach(([name, text, expected]) => {
    const mdit = MarkdownIt().use(docutils_plugin)
    const rendered = mdit.render(text)
    it(name, () => expect(rendered.trim()).toEqual((expected || "").trim()))
  })
  readFixtures("directives.admonitions").forEach(([name, text, expected]) => {
    const mdit = MarkdownIt().use(docutils_plugin)
    const rendered = mdit.render(text)
    it(name, () => expect(rendered.trim()).toEqual((expected || "").trim()))
  })
  readFixtures("directives.images").forEach(([name, text, expected]) => {
    const mdit = MarkdownIt().use(docutils_plugin)
    const rendered = mdit.render(text)
    it(name, () => expect(rendered.trim()).toEqual((expected || "").trim()))
  })
})

describe("Parses math directives", () => {
  readFixtures("directives.math").forEach(([name, text, expected]) => {
    const mdit = MarkdownIt().use(docutils_plugin)
    basicMathRenderer(mdit)
    const rendered = mdit.render(text)
    it(name, () => expect(rendered.trim()).toEqual((expected || "").trim()))
  })
})
