export function cx(...items: (string | void | false)[]): string {
  return items.filter((item) => !!item).join(" ")
}
