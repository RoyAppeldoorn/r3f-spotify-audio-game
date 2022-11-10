import { signIn, signOut, useSession } from "next-auth/react";
import styles from "./Navbar.module.css";

export const Navbar = () => {
  const { data: session } = useSession();

  return (
    <nav className={styles.menu}>
      <div className={styles.menuContent}>
        <span>Audiosurf</span>
        {session ? (
          <span>
            Signed in as {session.user?.name}
            <button onClick={() => signOut()}>Sign out</button>
          </span>
        ) : (
          <span>
            Not signed in
            <button onClick={() => signIn()}>Sign in</button>
          </span>
        )}
      </div>
    </nav>
  );
};
