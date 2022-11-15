import { PropsWithChildren } from "react";
import styles from "./Navbar.module.css";

export const Navbar: React.FC<PropsWithChildren<{}>> = ({ children }) => {
  return (
    <nav className={styles.menu}>
      <div className={styles.menuContent}>
        <span>Audiosurf</span>
        <div className={styles.menuItems}>{children}</div>
      </div>
    </nav>
  );
};
