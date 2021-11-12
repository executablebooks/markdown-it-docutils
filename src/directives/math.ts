/** Admonitions to visualise programming codes */
import type Token from "markdown-it/lib/token"
import { Directive, IDirectiveData } from "./main"
import { unchanged } from "./options"

/** Math directive with a label
 */
export class Math extends Directive {
  public required_arguments = 0
  public optional_arguments = 0
  public final_argument_whitespace = false
  public has_content = true
  public option_spec = {
    label: unchanged
  }
  run(data: IDirectiveData<keyof Math["option_spec"]>): Token[] {
    // TODO handle options
    this.assert_has_content(data)
    const token = this.createToken("math_block", "div", 0, {
      content: data.body,
      map: data.bodyMap,
      block: true
    })
    token.attrSet("class", "math block")
    if (data.options.label) {
      token.info = data.options.label
      token.meta = { label: data.options.label, numbered: true }
    }
    return [token]
  }
}

export const math = {
  math: Math
}
