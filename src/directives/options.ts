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
export type OptionSpecConverter = (value: string, options?: any) => any

export class OptionSpecError extends Error {
  name = "OptionSpecError"
}

/** Leave value unchanged */
export const unchanged: OptionSpecConverter = (value: string): string => value

/** Split values by whitespace and normalize to HTML4 id */
export const class_option: OptionSpecConverter = (value: string): string[] => {
  return `${value || ""}`.split(/\s+/).map(name => make_id(name))
}

/** Check for a non-negative integer argument and convert */
function nonnegative_int(argument: string): number {
  if (!argument) {
    throw new OptionSpecError("Value is not set")
  }
  let value: number
  try {
    // TODO we could return bigint here? however, these are not compatible with regular numbers
    BigInt(argument)
    value = Number(argument)
  } catch {
    throw new OptionSpecError("Value could not be converted to an integer")
  }
  if (value < 0) {
    throw new OptionSpecError("negative value; must be positive or zero")
  }
  return value
}

/** Check for an integer percentage value with optional percent sign. */
export const percentage: OptionSpecConverter = (value: string): number => {
  value = `${value || ""}`.replace(/\s+%$/, "")
  return nonnegative_int(value)
}

/** Check for a positive argument of one of the units and return a
    normalized string of the form "<value><unit>" (without space in
    between). 
*/
function get_measure(argument: string, units: string[]): string {
  const regex = new RegExp(`^(?<number>[0-9.]+)\\s*(?<units>${units.join("|")})$`)
  const match = regex.exec(argument)
  if (!match || !match.groups) {
    throw new OptionSpecError(
      `not a positive measure of one of the following units: ${units.join("|")}`
    )
  }
  return match.groups.number + match.groups.units
}

const length_units = ["em", "ex", "px", "in", "cm", "mm", "pt", "pc"]

/** Check for a positive argument of a length unit, allowing for no unit. */
export const length_or_unitless: OptionSpecConverter = (value: string): string => {
  return get_measure(value, [...length_units, ""])
}

/**
Return normalized string of a length or percentage unit.

Add <default> if there is no unit. Raise ValueError if the argument is not
a positive measure of one of the valid CSS units (or without unit).

>>> length_or_percentage_or_unitless('3 pt')
'3pt'
>>> length_or_percentage_or_unitless('3%', 'em')
'3%'
>>> length_or_percentage_or_unitless('3')
'3'
>>> length_or_percentage_or_unitless('3', 'px')
'3px'

*/
export const length_or_percentage_or_unitless: OptionSpecConverter = (
  argument: string,
  defaultUnit = ""
): string => {
  try {
    return get_measure(argument, [...length_units, "%"])
  } catch {
    return length_or_unitless(argument) + defaultUnit
  }
}

export const length_or_percentage_or_unitless_figure: OptionSpecConverter = (
  argument: string,
  defaultUnit = ""
): string => {
  if (argument.toLowerCase() === "image") {
    return "image"
  }
  return length_or_percentage_or_unitless(argument, defaultUnit)
}

/** Create an option that asserts the (lower-cased & trimmed) value is a member of a choice set. */
export function create_choice(choices: string[]): OptionSpecConverter {
  return (argument: string): string => {
    argument = argument.toLowerCase().trim()
    if (choices.includes(argument)) {
      return argument
    }
    throw new OptionSpecError(`must be in: ${choices.join("|")}`)
  }
}

/** Return the URI argument with unescaped whitespace removed. */
export const uri: OptionSpecConverter = (value: string): string => {
  // TODO implement whitespace removal
  return value
}
