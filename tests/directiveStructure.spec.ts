import directiveToData, { DirectiveToken } from "../src/directives/main"
import { unchanged, class_option } from "../src/directives/options"

describe("directive parser", () => {
  it('parses a "null" directive (no args, content)', () => {
    const token = new DirectiveToken("name", "", "", [0, 0])
    const { args, options, body } = directiveToData(token, {})
    expect(args).toEqual([])
    expect(options).toEqual({})
    expect(body).toEqual("")
  })
  it("parses a single arg directive", () => {
    const token = new DirectiveToken("name", "arg with space", "", [0, 0])
    const output = directiveToData(token, {
      required_arguments: 1,
      final_argument_whitespace: true
    })
    expect(output).toEqual({
      map: [0, 0],
      args: ["arg with space"],
      options: {},
      body: "",
      bodyOffset: 1
    })
  })
  it("parses a multi arg directive", () => {
    const token = new DirectiveToken("name", "arg with space", "", [0, 0])
    const output = directiveToData(token, {
      required_arguments: 2,
      final_argument_whitespace: true
    })
    expect(output).toEqual({
      map: [0, 0],
      args: ["arg", "with space"],
      options: {},
      body: "",
      bodyOffset: 1
    })
  })
  it("parses a directive with content only", () => {
    const token = new DirectiveToken("name", "first line content", "", [0, 0])
    const output = directiveToData(token, {
      has_content: true
    })
    expect(output).toEqual({
      map: [0, 0],
      args: [],
      options: {},
      body: "first line content",
      bodyOffset: 0
    })
  })
  it("parses a directive with options as ---", () => {
    const token = new DirectiveToken(
      "name",
      "",
      "---\na: 1\nb: class1 class2\n---",
      [0, 0]
    )
    const output = directiveToData(token, {
      option_spec: { a: unchanged, b: class_option }
    })
    expect(output).toEqual({
      map: [0, 0],
      args: [],
      options: { a: "1", b: ["class1", "class2"] },
      body: "",
      bodyOffset: 5
    })
  })
  it("parses a directive with options as :", () => {
    const token = new DirectiveToken("name", "", ":a: 1", [0, 0])
    const output = directiveToData(token, { option_spec: { a: unchanged } })
    expect(output).toEqual({
      map: [0, 0],
      args: [],
      options: { a: "1" },
      body: "",
      bodyOffset: 3
    })
  })
  it("parses a directive with options as --- and content", () => {
    const token = new DirectiveToken(
      "name",
      "",
      "---\na: 1\n---\ncontent\nlines",
      [0, 0]
    )
    const output = directiveToData(token, {
      has_content: true,
      option_spec: { a: unchanged }
    })
    expect(output).toEqual({
      map: [0, 0],
      args: [],
      options: { a: "1" },
      body: "content\nlines",
      bodyOffset: 4
    })
  })
  it("parses a directive with options as : and content", () => {
    const token = new DirectiveToken("name", "", ":a: 1\n\ncontent\nlines", [0, 0])
    const output = directiveToData(token, {
      has_content: true,
      option_spec: { a: unchanged }
    })
    expect(output).toEqual({
      map: [0, 0],
      args: [],
      options: { a: "1" },
      body: "content\nlines",
      bodyOffset: 4
    })
  })
})

// TODO more tests, including exception states (parity with myst-parser)
