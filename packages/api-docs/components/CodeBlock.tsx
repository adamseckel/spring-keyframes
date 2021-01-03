import styles from "./CodeBlock.module.css"
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter"
import jsx from "react-syntax-highlighter/dist/cjs/languages/prism/jsx"
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript"
import prism from "react-syntax-highlighter/dist/cjs/styles/prism/xonokai"

SyntaxHighlighter.registerLanguage("jsx", jsx)
SyntaxHighlighter.registerLanguage("javascript", javascript)

export function CodeBlock({ code, lang = "jsx" }: { code: string; lang?: string }) {
  return (
    <SyntaxHighlighter language={lang} style={prism}>
      {code}
    </SyntaxHighlighter>
  )
}

export function TwoColumnCodeBlock({ code, children, lang = "jsx" }) {
  return (
    <div className={styles.column}>
      <div className={styles.text}>{children}</div>
      <div>
        <div className={styles.block}>
          <CodeBlock code={code} lang={lang} />
        </div>
      </div>
    </div>
  )
}
