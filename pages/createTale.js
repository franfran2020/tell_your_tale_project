import { use, useState } from "react";
import styles from "../styles/CreateTale.module.css";
import {
  GENRE_DETAILS,
  TALE_MANAGER_ABI,
  TALE_MANAGER_CONTRACT_ADDRESS,
} from "../utils/Helpers";
import { useWeb3ExecuteFunction } from "react-moralis";

function CreateTale() {
  const [selectedGenre, setSelectedGenre] = useState();
  const [taleName, setTaleName] = useState();
  const [taleDescription, setTaleDescription] = useState();
  const [imageURI, setImageURI] = useState();

  //   string memory _name,
  //   string memory _imageCover,
  //   string memory _description,
  //   uint256 _interval,
  //   uint8 _genre

  const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction({
    abi: TALE_MANAGER_ABI,
    contractAddress: TALE_MANAGER_CONTRACT_ADDRESS,
    functionName: "createYourTale",
    params: {
      _name: taleName,
      _imageCover: imageURI,
      _description: taleDescription,
      _interval: 604800,
      _genre: selectedGenre,
    },
  });

  function handleActionClick() {
    setSelectedGenre(1);
  }
  function handleComedyClick() {
    setSelectedGenre(2);
  }
  function handleDramaClick() {
    setSelectedGenre(3);
  }
  function handleFantasyClick() {
    setSelectedGenre(4);
  }
  function handleHorrorClick() {
    setSelectedGenre(5);
  }
  function handleMysteryClick() {
    setSelectedGenre(6);
  }
  function handleRomanceClick() {
    setSelectedGenre(7);
  }
  function handleThrillerClick() {
    setSelectedGenre(8);
  }
  function handleSliceOfLifeClick() {
    setSelectedGenre(9);
  }
  function handleSciFiClick() {
    setSelectedGenre(10);
  }
  function handleMartialArtsClick() {
    setSelectedGenre(11);
  }
  function handleSportsClick() {
    setSelectedGenre(12);
  }
  function handleOthersClick() {
    setSelectedGenre(13);
  }

  return (
    <div className={styles.createTaleContainer}>
      <h2>Create Your Very Own Tale...</h2>
      <div className={styles.selectGenreContainer}>
        <p>
          <span>1.</span> Select Your Genre
        </p>
        <h5 className={styles.miniNote}>
          Pick the genre your tale falls into, if none go with others
        </h5>
        <p>
          Selected Genre:
          <span style={{ color: "black" }}>{GENRE_DETAILS[selectedGenre]}</span>
        </p>
        <div className={styles.buttonHolder}>
          <div>
            {" "}
            <button onClick={handleActionClick} className="bt-one">
              Action
            </button>
            <button onClick={handleComedyClick} className="bt-two">
              Comedy
            </button>
            <button onClick={handleDramaClick} className="bt-three">
              Drama
            </button>
            <button onClick={handleFantasyClick} className="bt-four">
              Fanatsy
            </button>
          </div>

          <button onClick={handleHorrorClick} className="bt-five">
            Horror
          </button>
          <button onClick={handleMysteryClick} className="bt-six">
            Mystery
          </button>
          <button onClick={handleRomanceClick} className="bt-seven">
            Romance
          </button>
          <button onClick={handleThrillerClick} className="bt-eight">
            Thriller
          </button>
          <button onClick={handleSliceOfLifeClick} className="bt-nine">
            Slice Of Life
          </button>
          <button onClick={handleSciFiClick} className="bt-ten">
            Sci-Fi
          </button>
          <button onClick={handleMartialArtsClick} className="bt-eleven">
            Martial Arts
          </button>
          <button onClick={handleSportsClick} className="bt-twelve">
            Sports
          </button>
          <button onClick={handleOthersClick} className="bt-others">
            Others
          </button>
        </div>
      </div>

      <div className={styles.taleNameAndDescriptionContainer}>
        <h3>
          <span style={{ color: "#1a1a1a" }}>2. </span>
          Give Your Tale A Name and A Description.
        </h3>

        <p>Tale Name :</p>
        <input
          onChange={(e) => {
            setTaleName(e.target.value);
          }}
          className={styles.nameInput}
        />

        <p>Image URI: </p>
        <input
          onChange={(e) => {
            setImageURI(e.target.value);
          }}
          className={styles.nameInput}
        />

        <p>
          The description is what lets users have a glimpse into what your tale
          is all about. Be detailed and entertaining as possible.
        </p>

        <p>Description: </p>
        <textarea
          onChange={(e) => {
            setTaleDescription(e.target.value);
          }}
          className={styles.descriptionInput}
        />
        <button onClick={() => fetch()}>Create Tale</button>
      </div>
    </div>
  );
}

export default CreateTale;
