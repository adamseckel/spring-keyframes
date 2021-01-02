import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter"

export function CodeBlock({ code }: { code: string }) {
  return <SyntaxHighlighter language="javascript">{code}</SyntaxHighlighter>
}
