/* eslint-disable @typescript-eslint/no-explicit-any */
/** Functions for converting and validating directive options */

/**
 * Normalize a string to HTML4 id
 *
 * Adapted from docutils/nodes.py::make_id,
 * it should be noted that in HTML5 the only requirement is no whitespace.
 * */
export function make_id(name: string): string {
  // TODO make more complete
  return name
    .toLowerCase()
    .split(/\s+/)
    .join("-")
    .replace(/[^a-z0-9]+/, "-")
    .replace(/^[-0-9]+|-+$/, "")
}

/** convert and validate an option value */
export type OptionSpecConverter = (value: string) => any

/** Leave value unchanged */
export const unchanged: OptionSpecConverter = (value: string): string => value

/** Split values by whitespace and normalize to HTML4 id */
export const class_option: OptionSpecConverter = (value: string): string[] => {
  return `${value || ""}`.split(/\s+/).map(name => make_id(name))
}
