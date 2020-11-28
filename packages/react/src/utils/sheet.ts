function sheetForTag(tag: HTMLStyleElement): CSSStyleSheet | undefined {
  if (tag.sheet) return tag.sheet as CSSStyleSheet

  // this weirdness brought to you by firefox
  for (let i = 0; i < document.styleSheets.length; i++) {
    if (document.styleSheets[i].ownerNode === tag) {
      return document.styleSheets[i] as CSSStyleSheet
    }
  }

  return undefined
}

export type Options = {
  nonce?: string
  key: string
  speedy?: boolean
}

function createStyleElement(options: { key: string }): HTMLStyleElement {
  let tag = document.createElement("style")
  tag.setAttribute("data-keyframes", options.key)
  tag.appendChild(document.createTextNode(""))
  return tag
}

export class StyleSheet {
  isSpeedy: boolean
  ctr: number
  tags: HTMLStyleElement[]
  key: string
  nonce: string | void
  before: Element | null
  constructor(options: Options) {
    this.isSpeedy = true
    this.tags = []
    this.ctr = 0
    this.nonce = options.nonce
    // key is the value of the data-emotion attribute, it's used to identify different sheets
    this.key = options.key
    this.before = null
  }
  insert(name: string, rule: string) {
    // the max length is how many rules we have per style tag, it's 65000 in speedy mode
    // it's 1 in dev because we insert source maps that map a single rule to a location
    // and you can only have one source map per style tag
    if (this.ctr % (this.isSpeedy ? 65000 : 1) === 0) {
      let tag = createStyleElement({ key: name })
      let before
      if (this.tags.length === 0) {
        before = this.before
      } else {
        before = this.tags[this.tags.length - 1].nextSibling
      }
      if (document !== undefined) {
        document.head.insertBefore(tag, before)
      }
      this.tags.push(tag)
    }

    const tag = this.tags[this.tags.length - 1]

    if (this.isSpeedy) {
      const sheet = sheetForTag(tag)
      if (!sheet) return
      try {
        // this is the ultrafast version, works across browsers
        // the big drawback is that the css won't be editable in devtools
        sheet.insertRule(rule, sheet.cssRules.length)
      } catch (e) {
        if (process.env.NODE_ENV !== "production") {
          console.warn(`There was a problem inserting the following rule: "${rule}"`, e)
        }
      }
    } else {
      tag.appendChild(document.createTextNode(rule))
    }
    this.ctr++
  }
  flushKeys(keys: string[]) {
    let count = 0

    this.tags.forEach((tag) => {
      if (this.isSpeedy) {
        const sheet = sheetForTag(tag)

        if (!sheet) return

        for (let index = 0; index < sheet.cssRules.length; index++) {
          const element = sheet.cssRules[index] as CSSKeyframesRule

          if (keys.includes(element.name)) {
            sheet.deleteRule(index)
            count += 1
          }
        }
      } else {
        const tagName = tag.getAttribute("data-keyframes")
        // console.log(tagName, keys)
        if (tagName && keys.includes(tagName) && tag.parentNode) {
          tag.parentNode.removeChild(tag)
          // this.tags = [...this.tags.splice(i, 1)]
        }
      }
    })

    this.ctr = this.ctr - count
  }
  flushAll() {
    this.tags.forEach((tag) => {
      if (tag.parentNode) tag.parentNode.removeChild(tag)
    })
    this.tags = []
    this.ctr = 0
  }
}
