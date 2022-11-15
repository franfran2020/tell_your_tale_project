import styles from "../styles/Register.module.css";
import { useWeb3ExecuteFunction } from "react-moralis";
import {
  TALE_MANAGER_ABI,
  TALE_MANAGER_CONTRACT_ADDRESS,
} from "../utils/Helpers";
import { useState } from "react";
import { handleError } from "@apollo/client/link/http/parseAndCheckHttpResponse";

function Register() {
  const [userAuthorName, setUserAuthorName] = useState();

  const { data, error, fetch, isFetching, isLoading } = useWeb3ExecuteFunction({
    abi: TALE_MANAGER_ABI,
    contractAddress: TALE_MANAGER_CONTRACT_ADDRESS,
    functionName: "registerAsAuthor",
    params: {
      _authorName: userAuthorName,
    },
  });

  function handleError(error) {
    if (error.data.message.slice(20) == "TYT#1") {
      console.log(error.data.message.slice(20));
      return (
        <p style={{ color: "red", fontSize: "20px", fontWeight: "600" }}>
          Error:{" "}
          <span style={{ color: "black" }}>
            This Author Name Has Been Taken By Someone Else
          </span>
        </p>
      );
    }
  }

  // console.log(userAuthorName);
  return (
    <div className={styles.registerContainer}>
      <h2 className={styles.registerHeader}>Register As An Author</h2>
      <div className={styles.registerSignUpSection}>
        <h4>Whats Your Author Name Gonna Be?</h4>

        <input
          onChange={(e) => {
            setUserAuthorName(e.target.value);
          }}
        />
        {isFetching || isLoading ? (
          <p>SIgning Up...</p>
        ) : (
          <button onClick={() => fetch()}>Sign Up</button>
        )}
        {error && handleError(error)}
      </div>
    </div>
  );
}

export default Register;
