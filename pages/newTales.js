import { gql, useQuery } from "@apollo/client";
import styles from "../styles/NewTales.module.css";
import { TaleBox } from "../components/TaleBox";

function NewTales() {
  const GET_NEW_TALES = gql`
    {
      taleEntities {
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
    <div className={styles.newTalesContainer}>
      <h3>New Tales</h3>
      <div className={styles.taleBoxContainer}>
        {data
          ? data.taleEntities.map(
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
          : loading
          ? "Loading..."
          : error
          ? "Error!!"
          : ""}
      </div>
    </div>
  );
}

export default NewTales;
