import type Token from "markdown-it/lib/token"
import { Directive, IDirectiveData } from "./main"
import {
  class_option,
  create_choice,
  length_or_percentage_or_unitless,
  length_or_unitless,
  percentage,
  unchanged,
  uri
} from "./options"

/** Directive for a single image */
export class Image extends Directive {
  public required_arguments = 1
  public optional_arguments = 0
  public final_argument_whitespace = true
  public option_spec = {
    alt: unchanged,
    height: length_or_unitless,
    width: length_or_percentage_or_unitless,
    // TODO handle scale option
    scale: percentage,
    align: create_choice(["left", "center", "right", "top", "middle", "bottom"]),
    // TODO handle target option
    target: unchanged,
    class: class_option,
    // TODO handle name option
    name: unchanged
  }
  run(data: IDirectiveData): Token[] {
    // get URI
    const src = uri(data.args[0] || "")

    const token = new this.state.Token("image", "img", 0)
    token.children = []
    token.attrSet("src", src)
    token.attrSet("alt", data.options.alt || "")
    if (data.options.height) {
      token.attrSet("height", data.options.height)
    }
    if (data.options.width) {
      token.attrSet("width", data.options.width)
    }
    if (data.options.align) {
      token.attrJoin("class", `align-${data.options.align}`)
    }
    if (data.options.class) {
      token.attrJoin("class", data.options.class.join(" "))
    }

    return [token]
  }
}

export const images = {
  image: Image
}
