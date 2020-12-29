import styles from "./Header.module.css"

export function Header() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        spring
        <br />
        keyframes.
      </h1>
      <div className={styles.labelContainer}>
        <p className={styles.label}>API Docs — 0.0.1</p>
        <div className={styles.badge}>
          <p>beta</p>
        </div>
      </div>
    </div>
  )
}
