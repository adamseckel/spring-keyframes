import styles from "./Header.module.css"

export function Header({ version }: { version: string }) {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        <span className={styles.box}>
          <span className={"spring-up"}>spring</span>
        </span>
        <span className={styles.box}>
          <span className={"spring-up" + " " + styles.delay}>keyframes.</span>
        </span>
      </h1>
      <div className={"scale-in" + " " + styles.labelContainer}>
        <p className={styles.label}>API Docs — {version}</p>
        <div className={styles.badge}>
          <p>beta</p>
        </div>
      </div>
    </div>
  )
}
