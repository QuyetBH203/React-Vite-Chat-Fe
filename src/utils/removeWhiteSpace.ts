export function removeWhiteSpace(value: string = "") {
  return value.trim().replace(/ +/g, " ")
}
