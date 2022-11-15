import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, useQuery, gql } from "@apollo/client";
import styles from "../styles/Home.module.css";
import Link from "next/link";
import { TaleBox } from "../components/TaleBox";

export default function Home() {
  const GET_NEW_TALES = gql`
    {
      taleEntities(first: 5) {
        id
        name
        author
        imageCover
        timeCreated
        genre
        taleContract
        creator
      }
    }
  `;

  const { loading, error, data } = useQuery(GET_NEW_TALES);

  return (
    <div className={styles.HomeContainer}>
      <div className={styles.newTalesSection}>
        <div className={styles.titleName}>
          <h3>New Tales</h3>
          <Link href="/newTales" className={styles.viewAllNewTalesLink}>
            View All &gt;
          </Link>
        </div>

        <div className={styles.taleBoxContainer}>
          {data ? (
            data.taleEntities.map(
              ({
                author,
                imageCover,
                name,
                timeCreated,
                genre,
                taleContract,
                creator,
              }) => {
                return (
                  <TaleBox
                    key={taleContract}
                    imageLink={imageCover}
                    title={name}
                    author={author}
                    genre={genre}
                    taleContract={taleContract}
                  />
                );
              }
            )
          ) : loading ? (
            <div className="loader"></div>
          ) : error ? (
            "Error!!"
          ) : (
            "Unkown"
          )}
        </div>
      </div>

      <div className={styles.heroSection}>
        <div className={styles.right}>
          <p className={styles.one}>
            Tell your tale allows users to write stories and earn from these
            stories giving creatives an opportunity to earn from their creative
            stories while opening themselves to the possibility of an anime,
            movie or cartoon mainstream adaptation from big shots around the
            globe.
          </p>
          <p className={styles.two}>
            Thats not all, you seamlessly enjoy the benefits of storing your
            tales on a decentralized storage infrastructure(IPFS and Filecoin)
            while using decentralized encryption methods for each of your story
            via Lit Protocol.
          </p>
          <Link href="/register" className={styles.heroButton}>
            Register As An Author
          </Link>
        </div>
        <div className={styles.left}>
          <Link href="/">
            <img src="/illustration.png" className={styles.heroImage} />
          </Link>
        </div>
      </div>
    </div>
  );
}
