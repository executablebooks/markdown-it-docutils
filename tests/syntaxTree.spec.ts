import MarkdownIt from "markdown-it"
import { SyntaxTreeNode } from "../src/syntaxTree"

const EXAMPLE_MARKDOWN = `
## Heading here

Some paragraph text and **emphasis here** and more text here.
`

describe("syntaxTree class", () => {
  test("round-trip", () => {
    const tokens = MarkdownIt().parse(EXAMPLE_MARKDOWN, {})
    const tokens_after_roundtrip = new SyntaxTreeNode(tokens).to_tokens()
    expect(tokens_after_roundtrip).toEqual(tokens)
  })
  test("property pass-through", () => {
    const tokens = MarkdownIt().parse(EXAMPLE_MARKDOWN, {})
    const heading_open = tokens[0]
    const heading_node = new SyntaxTreeNode(tokens).children[0]
    expect(heading_node.tag).toEqual(heading_open.tag)
    expect(heading_node.map).toEqual(heading_open.map)
    expect(heading_node.level).toEqual(heading_open.level)
    expect(heading_node.content).toEqual(heading_open.content)
    expect(heading_node.markup).toEqual(heading_open.markup)
    expect(heading_node.info).toEqual(heading_open.info)
    expect(heading_node.meta).toEqual(heading_open.meta)
    expect(heading_node.block).toEqual(heading_open.block)
    expect(heading_node.hidden).toEqual(heading_open.hidden)
  })
  test("walk", () => {
    const tokens = MarkdownIt().parse(EXAMPLE_MARKDOWN, {})
    const nodes = [...new SyntaxTreeNode(tokens).walk()]
    expect(nodes.map(node => node.type)).toEqual([
      "root",
      "heading",
      "inline",
      "text",
      "paragraph",
      "inline",
      "text",
      "strong",
      "text",
      "text"
    ])
  })
})
