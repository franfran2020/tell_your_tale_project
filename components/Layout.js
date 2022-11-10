import Head from "next/head";
import Link from "next/link";
import { useMoralis } from "react-moralis";
import styles from "../styles/Layout.module.css";

function Layout({ children }) {
  const { enableWeb3, isWeb3Enabled } = useMoralis();

  async function connectWallet() {
    await enableWeb3();
  }

  console.log(isWeb3Enabled);
  return (
    <div className={styles.LayoutContainer}>
      <Head>
        <title>Tell Your Tale</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins&display=swap"
          rel="stylesheet"
        />
      </Head>
      <nav className={styles.navBar}>
        <div>
          <Link href="/">
            <img
              src="/logo.png"
              className={styles.logo}
              width="150px"
              height="auto"
            />
          </Link>
        </div>
        <div className={styles.navLinkContainer}>
          <Link href="/register">Register As Author</Link>
          <Link href="/newTales">New Tales</Link>
          <Link href="/createTale">Create Tale</Link>
          <button onClick={connectWallet} className={styles.connectButton}>
            {isWeb3Enabled ? "Connected" : "Connect"}
          </button>
        </div>
      </nav>
      <div className={styles.childrenContainer}>{children}</div>
      <footer className={styles.footer}>
        <div className={styles.footerFirstDiv}>
          <h5>Tell Your Tale</h5>
          <p>Where the greatest tales are told.....</p>
        </div>
        <div className={styles.footerSecondDiv}>
          <p className={styles.footerLinkOne}>Faqs</p>
          <p className={styles.footerLinkTwo}>News and Events</p>
          <p className={styles.footerLinkThree}>Feedback</p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
