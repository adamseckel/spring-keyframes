import { Item, Navigation } from "./Navigation"
import { Header } from "./Header"
import styles from "./Layout.module.css"
import { cx } from "../utils/cx"

export function Layout({
  items,
  version,
  children,
}: { items: Item[]; version?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div>
      <Header version={version} />
      <div className={styles.container}>
        <div className={styles.navigationContainer}>
          <Navigation items={items} />
        </div>
        <div className={cx(styles.bodyContainer, "page-container")}>{children}</div>
      </div>
    </div>
  )
}
