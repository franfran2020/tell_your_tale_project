import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import LitJsSdk from "lit-js-sdk";
import {
  useMoralis,
  useWeb3Contract,
  useWeb3ExecuteFunction,
} from "react-moralis";
import { TALE_CONTRACT_ABI } from "../../../utils/Helpers";

function ChapterPage() {
  const router = useRouter();
  const { talecontract, chapterNumber } = router.query;
  const [chapterDetails, setChapterDetails] = useState();
  const [cost, setCost] = useState();
  const [encryptedMessage, setEncryptedMessage] = useState();
  const [litNodeClient, setLitNodeClient] = useState();

  const { isWeb3Enabled, enableWeb3 } = useMoralis();

  const { runContractFunction: getTaleChapterDetails } = useWeb3Contract({
    abi: TALE_CONTRACT_ABI,
    contractAddress: talecontract,
    functionName: "getTaleChapterDetails",
    params: {
      _chapter: chapterNumber,
    },
  });

  const { runContractFunction: costInNativeAsset } = useWeb3Contract({
    abi: TALE_CONTRACT_ABI,
    contractAddress: talecontract,
    functionName: "costInNativeAsset",
    params: {
      _chapter: chapterNumber,
    },
  });

  const {
    data,
    error,
    fetch: mintChapter,
    isFetching,
    isLoading,
  } = useWeb3ExecuteFunction({
    abi: TALE_CONTRACT_ABI,
    contractAddress: talecontract,
    functionName: "mintChapter",
    params: {
      _chapter: chapterNumber,
    },
    msgValue: cost,
  });

  const chain = "mumbai";
  let client;

  async function connectLit() {
    client = new LitJsSdk.LitNodeClient();
    await client.connect();
    setLitNodeClient(client);
  }

  async function decryptMessage(taleLink, encodedTaleString) {
    if (!window.litNodeClient) {
      await connectLit();
    }
    // const symmetricKey = await getEncryptedKey(messageLink);

    const data = await fetch(taleLink);
    const dataOnIpfs = JSON.parse(await data.text());

    const evmContractConditions = dataOnIpfs.evmContractConditions;

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });

    const encryptedSymmetricKey = dataOnIpfs.encryptedSymmetricKey;
    const getEncryptionKeyParams = {
      evmContractConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    };
    // symmetric key
    const symmetricKey = await litNodeClient.getEncryptionKey(
      getEncryptionKeyParams
    );
    const decryptedString = await LitJsSdk.decryptString(
      new Blob([hexStringToArrayBuffer(encodedTaleString)]),
      symmetricKey
    );

    console.log("", decryptedString);
    setEncryptedMessage(decryptedString);
  }

  function hexStringToArrayBuffer(hexString) {
    hexString = hexString.replace(/^0x/, "");
    if (hexString.length % 2 != 0) {
      // eslint-disable-next-line no-console
      console.log(
        "WARNING: expecting an even number of characters in the hexString"
      );
    }
    const bad = hexString.match(/[G-Z\s]/i);
    if (bad) {
      // eslint-disable-next-line no-console
      console.log("WARNING: found non-hex characters", bad);
    }
    const pairs = hexString.match(/[\dA-F]{2}/gi);
    const integers = pairs.map(function (s) {
      return parseInt(s, 16);
    });
    const array = new Uint8Array(integers);
    return array.buffer;
  }

  async function updateUIValues() {
    const chapterDetails = await getTaleChapterDetails();
    const costInMatic = (await costInNativeAsset()).toString();
    let codedMessage = await fetchDecryptedMessage(chapterDetails[2]);
    setEncryptedMessage(codedMessage);
    setCost(costInMatic);
    setChapterDetails(chapterDetails);
  }

  const fetchDecryptedMessage = async (encryptedLink) => {
    const res = await fetch(encryptedLink);
    const data = await res.json();
    const encryptedString = data.encryptedString;
    return encryptedString;
  };

  useEffect(() => {
    connectLit();
    if (isWeb3Enabled) {
      updateUIValues();
    } else {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  return (
    <div>
      {chapterDetails && (
        <div>
          <h2
            style={{
              textAlign: "center",
              color: "#18a921",
              fontSize: "40px",
              margin: "8px 0px",
            }}
          >
            <span>Chapter Name: </span>
            {chapterDetails[0]}
          </h2>
          <h3
            style={{
              textAlign: "center",
              color: "#ae710",
              fontSize: "30px",
              margin: "8px 0px",
            }}
          >
            <span>Author: </span>
            {chapterDetails[4]}
          </h3>
          <h4
            style={{
              textAlign: "center",
              color: "#ae710",
              fontSize: "24px",
              margin: "8px 0px",
            }}
          >
            <span>Chapter</span> {chapterNumber}
          </h4>
          <h5
            style={{
              textAlign: "center",
              color: "#ae710",
              color: "00A7E1",
              fontSize: "30px",
              margin: "8px 0px",
            }}
          >
            Cost {parseFloat(chapterDetails["costInUsd"].toString() / 10 ** 8)}$
            in MATIC
          </h5>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <button className="mintChapterButton" onClick={() => mintChapter()}>
              Mint Chapter
            </button>
            <button
              className="viewChapterButton"
              onClick={() =>
                decryptMessage(chapterDetails[2], encryptedMessage)
              }
            >
              View Chapter
            </button>
          </div>

          <div>
            <h3 style={{ textAlign: "center", fontSize: "40px" }}>
              Chapter {chapterNumber}
            </h3>
            <p
              style={{
                width: "80%",
                overflowWrap: "anywhere",
                fontSize: "25px",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              {encryptedMessage}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChapterPage;
