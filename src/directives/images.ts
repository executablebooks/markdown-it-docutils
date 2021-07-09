/** Directives for image visualisation */
import type Token from "markdown-it/lib/token"
import { Directive, IDirectiveData } from "./main"
import {
  class_option,
  create_choice,
  length_or_percentage_or_unitless,
  length_or_percentage_or_unitless_figure,
  length_or_unitless,
  percentage,
  unchanged,
  unchanged_required,
  uri
} from "./options"

const shared_option_spec = {
  alt: unchanged,
  height: length_or_unitless,
  width: length_or_percentage_or_unitless,
  // TODO handle scale option
  scale: percentage,
  // TODO handle target option
  target: unchanged_required,
  class: class_option,
  // TODO handle name option (note: should be applied to figure for Figure)
  name: unchanged
}

/** Directive for a single image.
 *
 * Adapted from: docutils/docutils/parsers/rst/directives/images.py
 */
export class Image extends Directive {
  public required_arguments = 1
  public optional_arguments = 0
  public final_argument_whitespace = true
  public option_spec = {
    ...shared_option_spec,
    align: create_choice(["left", "center", "right", "top", "middle", "bottom"])
  }
  create_image(data: IDirectiveData): Token {
    // get URI
    const src = uri(data.args[0] || "")

    const token = this.createToken("image", "img", 0, { map: data.map })
    token.attrSet("src", src)
    token.attrSet("alt", data.options.alt || "")
    // TODO markdown-it default renderer requires the alt as children tokens
    const altTokens: Token[] = []
    if (data.options.alt) {
      this.state.md.inline.parse(
        data.options.alt,
        this.state.md,
        this.state.env,
        altTokens
      )
    }
    token.children = altTokens
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

    return token
  }
  run(data: IDirectiveData): Token[] {
    return [this.create_image(data)]
  }
}

/** Directive for an image with caption.
 *
 * Adapted from: docutils/docutils/parsers/rst/directives/images.py,
 * and sphinx/directives/patches.py (patch to apply name to figure instead of image)
 */
export class Figure extends Image {
  public option_spec = {
    ...shared_option_spec,
    align: create_choice(["left", "center", "right"]),
    figwidth: length_or_percentage_or_unitless_figure,
    figclass: class_option
  }
  public has_content = true
  run(data: IDirectiveData): Token[] {
    const openToken = this.createToken("figure_open", "figure", 1, { map: data.map })
    if (data.options.figclass) {
      openToken.attrJoin("class", data.options.figclass.join(" "))
    }
    if (data.options.align) {
      openToken.attrJoin("class", `align-${data.options.align}`)
    }
    if (data.options.figwidth && data.options.figwidth !== "image") {
      // TODO handle figwidth == "image"?
      openToken.attrSet("width", data.options.figwidth)
    }
    const imageToken = this.create_image(data)
    imageToken.map = [data.map[0], data.map[0]]
    let captionTokens: Token[] = []
    if (data.body) {
      const openCaption = this.createToken("figure_caption_open", "figcaption", 1)
      // TODO in docutils caption can only be single paragraph (or ignored if comment)
      // then additional content is figure legend
      const captionBody = this.nestedParse(data.body, data.bodyMap[0])
      const closeCaption = this.createToken("figure_caption_close", "figcaption", -1)
      captionTokens = [openCaption, ...captionBody, closeCaption]
    }
    const closeToken = this.createToken("figure_close", "figure", -1)
    return [openToken, imageToken, ...captionTokens, closeToken]
  }
}

export const images = {
  image: Image,
  figure: Figure
}
