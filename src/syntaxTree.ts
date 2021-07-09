/** A tree representation of a linear markdown-it token stream.
 *
 * Ported from: markdown-it-py/markdown_it/tree.py
 */
import Token from "markdown-it/lib/token"

interface NesterTokens {
  opening: Token
  closing: Token
}

/**A Markdown syntax tree node.

A class that can be used to construct a tree representation of a linear
`markdown-it` token stream.

Each node in the tree represents either:
    - root of the Markdown document
    - a single unnested `Token`
    - a `Token` "_open" and "_close" token pair, and the tokens nested in
        between
*/
export class SyntaxTreeNode {
  private token?: Token
  private nester_tokens?: NesterTokens
  public parent?: SyntaxTreeNode
  public children: SyntaxTreeNode[] = []
  /** Initialize a `SyntaxTreeNode` from a token stream. */
  constructor(tokens: Token[], create_root = true) {
    this.children = []
    if (create_root) {
      this._set_children_from_tokens(tokens)
      return
    }
    if (tokens.length === 0) {
      throw new Error("Tree creation: Can only create root from empty token sequence.")
    }
    if (tokens.length === 1) {
      const inline_token = tokens[0]
      if (inline_token.nesting) {
        throw new Error("Unequal nesting level at the start and end of token stream.")
      }
      this.token = inline_token
      if (inline_token.children !== null && inline_token.children.length > 0) {
        this._set_children_from_tokens(inline_token.children)
      }
    } else {
      this.nester_tokens = { opening: tokens[0], closing: tokens[tokens.length - 1] }
      this._set_children_from_tokens(tokens.slice(1, -1))
    }
  }
  private _set_children_from_tokens(tokens: Token[]): void {
    const revered_tokens = [...tokens].reverse()
    let token: Token | undefined
    while (revered_tokens.length > 0) {
      token = revered_tokens.pop()
      if (!token) {
        break
      }
      if (!token.nesting) {
        this._add_child([token])
        continue
      }
      if (token.nesting !== 1) {
        throw new Error("Invalid token nesting")
      }
      const nested_tokens = [token]
      let nesting = 1
      while (revered_tokens.length > 0 && nesting !== 0) {
        token = revered_tokens.pop()
        if (token) {
          nested_tokens.push(token)
          nesting += token.nesting
        }
      }
      if (nesting) {
        throw new Error(`unclosed tokens starting: ${nested_tokens[0]}`)
      }
      this._add_child(nested_tokens)
    }
  }
  private _add_child(tokens: Token[]): void {
    const child = new SyntaxTreeNode(tokens, false)
    child.parent = this
    this.children.push(child)
  }
  /** Recover the linear token stream. */
  to_tokens(): Token[] {
    function recursive_collect_tokens(node: SyntaxTreeNode, token_list: Token[]): void {
      if (node.type === "root") {
        for (const child of node.children) {
          recursive_collect_tokens(child, token_list)
        }
      } else if (node.token) {
        token_list.push(node.token)
      } else {
        if (!node.nester_tokens) {
          throw new Error("No nested token available")
        }
        token_list.push(node.nester_tokens.opening)
        for (const child of node.children) {
          recursive_collect_tokens(child, token_list)
        }
        token_list.push(node.nester_tokens.closing)
      }
    }
    const tokens: Token[] = []
    recursive_collect_tokens(this, tokens)
    return tokens
  }
  /** Is the node a special root node? */
  get is_root(): boolean {
    return !(this.token || this.nester_tokens)
  }
  /** Is this node nested? */
  get is_nested(): boolean {
    return !!this.nester_tokens
  }
  /** Get siblings of the node (including self). */
  get siblings(): SyntaxTreeNode[] {
    if (!this.parent) {
      return [this]
    }
    return this.parent.children
  }
  /** Recursively yield all descendant nodes in the tree starting at self.
   *
   * The order mimics the order of the underlying linear token stream (i.e. depth first).
   */
  *walk(include_self = true): Generator<SyntaxTreeNode> {
    if (include_self) {
      yield this
    }
    for (const child of this.children) {
      yield* child.walk(true)
    }
  }
  /** Get a string type of the represented syntax.
   * 
    - "root" for root nodes
    - `Token.type` if the node represents an un-nested token
    - `Token.type` of the opening token, with "_open" suffix stripped, if
        the node represents a nester token pair
  */
  get type(): string {
    if (this.is_root) {
      return "root"
    }
    if (this.token) {
      return this.token.type
    }
    if (this.nester_tokens?.opening.type.endsWith("_open")) {
      return this.nester_tokens?.opening.type.slice(0, -5)
    }
    if (this.nester_tokens) {
      return this.nester_tokens?.opening.type
    }
    throw new Error("no internal token")
  }
  private attribute_token(): Token {
    if (this.token) {
      return this.token
    }
    if (this.nester_tokens) {
      return this.nester_tokens.opening
    }
    throw new Error("Tree node does not have the accessed attribute")
  }
  get tag(): string {
    return this.attribute_token().tag
  }
  get level(): number {
    return this.attribute_token().level
  }
  get content(): string {
    return this.attribute_token().content
  }
  get markup(): string {
    return this.attribute_token().markup
  }
  get info(): string {
    return this.attribute_token().info
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  get meta(): any {
    return this.attribute_token().meta
  }
  get block(): boolean {
    return this.attribute_token().block
  }
  get hidden(): boolean {
    return this.attribute_token().hidden
  }
  get map(): [number, number] | null {
    return this.attribute_token().map
  }
  get attrs(): [string, string][] | null {
    return this.attribute_token().attrs
  }
}
