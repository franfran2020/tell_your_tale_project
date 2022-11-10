import Link from "next/link";
import styles from "../styles/TaleBox.module.css";
import { GENRE_DETAILS } from "../utils/Helpers";

export function TaleBox({ imageLink, title, author, genre, taleContract }) {
  console.log(taleContract);
  return (
    <div className={styles.TaleBoxContainer}>
      <Link href={`tales/${taleContract}`}>
        <img src={imageLink} className={styles.image} />
        <h4 className={styles.titleName}>{title}</h4>
        <h2 className={styles.author}>{author}</h2>
        <p className={styles.genre}>{GENRE_DETAILS[genre]}</p>
        <Link
          href={`dropChapter/${taleContract}`}
          className={styles.dropChapterButton}
        >
          Drop Chapter
        </Link>
      </Link>
    </div>
  );
}
