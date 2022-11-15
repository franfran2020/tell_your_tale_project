import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useWeb3Contract, useMoralis } from "react-moralis";
import {
  GENRE_DETAILS,
  TALE_CONTRACT_ABI,
  TALE_MANAGER_ABI,
  TALE_MANAGER_CONTRACT_ADDRESS,
} from "../../utils/Helpers";

function TaleDetail() {
  const router = useRouter();
  const { taleAddress } = router.query;
  const { isWeb3Enabled, enableWeb3 } = useMoralis();

  const [chapterNumber, setChapterNumber] = useState();
  const [taleDetailsState, setTaleDetails] = useState();
  const [encryptedString, setEncryptedString] = useState();
  const [currentChapter, setCurrentChapter] = useState();
  const [selectedChapterNumber, setSelectedChapterNumber] = useState();
  const [chapterDetails, setChapterDetails] = useState();

  const { runContractFunction: getTaleDetails } = useWeb3Contract({
    abi: TALE_MANAGER_ABI,
    contractAddress: TALE_MANAGER_CONTRACT_ADDRESS,
    functionName: "getTaleDetails",
    params: {
      _taleContractAddress: taleAddress,
    },
  });

  const { runContractFunction: getCurrentChapter } = useWeb3Contract({
    abi: TALE_CONTRACT_ABI,
    contractAddress: taleAddress,
    functionName: "getCurrentChapter",
    params: {
      _taleContractAddress: taleAddress,
    },
  });

  const { runContractFunction: getTaleChapterDetails } = useWeb3Contract({
    abi: TALE_CONTRACT_ABI,
    contractAddress: taleAddress,
    functionName: "getTaleChapterDetails",
    params: {
      _chapter: selectedChapterNumber,
    },
  });

  async function updateUIValues() {
    const taleDetailsFromCall = await getTaleDetails();
    const taleCurrentChapter = (await getCurrentChapter()).toString();
    setTaleDetails(taleDetailsFromCall);
    setCurrentChapter(taleCurrentChapter);
  }

  async function handleSelectChapter() {
    const chapterDetails = await getTaleChapterDetails();
    setChapterDetails(chapterDetails);
  }

  console.log(selectedChapterNumber);
  console.log(chapterDetails);

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    } else {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  return (
    <>
      {taleDetailsState ? (
        <>
          <div className="taleDetailsContainer">
            <img className="taleDetailsStateImage" src={taleDetailsState[2]} />

            <div className="taleDetaillsWriting">
              <h2>
                <span style={{ color: "white" }}>Tale Name: </span>
                {taleDetailsState[0]}
              </h2>
              <h3>
                {" "}
                <span style={{ color: "#18a921" }}>Author: </span>
                {taleDetailsState[1]}
              </h3>
              <h4>
                <span style={{ color: "white" }}>Genre: </span>
                {GENRE_DETAILS[taleDetailsState["Genre"]]}
              </h4>

              <h5>Description</h5>
              <p>{taleDetailsState[3]}</p>

              <h6>Current Chapter</h6>
              {currentChapter && <p>{currentChapter}</p>}
            </div>
          </div>
          <div className="getChapterFromNumber">
            <h2>View Chapter</h2>

            <div className="getChapterFromNumberHeader">
              <input
                placeholder="..."
                onChange={(e) =>
                  setSelectedChapterNumber(parseInt(e.target.value))
                }
              />
              <button onClick={handleSelectChapter}>Get Chapter</button>
            </div>
          </div>
          {chapterDetails && chapterDetails[0] != "" ? (
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                padding: "30px 40px",
                backgroundColor: "#E1E1E1",
                marginTop: "60px",
              }}
            >
              <img
                src={chapterDetails[3]}
                style={{ width: "25%", height: "25%" }}
              />
              <Link
                href={`/chapters/${taleAddress}/${selectedChapterNumber}`}
                className="selectedChapter"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "flex-start",
                  padding: "0px 20px",
                }}
              >
                <h2>Chapter {selectedChapterNumber}</h2>
                <h4 style={{ fontSize: "20px", color: "#18a921" }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      paddingRight: "8px",
                    }}
                  >
                    Title:
                  </span>
                  {chapterDetails[0]}
                </h4>
                <p style={{ fontSize: "20px", color: "#18a921" }}>
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "black",
                      paddingRight: "8px",
                    }}
                  >
                    Description:
                  </span>
                  {chapterDetails[1]}
                </p>
              </Link>
            </div>
          ) : (
            <p style={{ textAlign: "center", fontSize: "25px" }}>
              Select A chapter
            </p>
          )}
        </>
      ) : (
        <div className="loader"></div>
      )}
    </>
  );
}

export default TaleDetail;
