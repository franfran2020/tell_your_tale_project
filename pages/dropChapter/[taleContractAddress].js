import { useRouter } from "next/router";
import { useState, useEffect } from "react";

import LitJsSdk from "lit-js-sdk";
import {
  useMoralis,
  useWeb3Contract,
  useWeb3ExecuteFunction,
} from "react-moralis";
import {
  TALE_CONTRACT_ABI,
  TALE_MANAGER_ABI,
  TALE_MANAGER_CONTRACT_ADDRESS,
} from "../../utils/Helpers";
import { Web3Storage } from "web3.storage";

function DropChapter() {
  const router = useRouter();
  const { taleContractAddress } = router.query;
  const { isWeb3Enabled, enableWeb3 } = useMoralis();

  const [encryptLoading, setEncryptedLoading] = useState(false);
  const [chapterName, setChapterName] = useState();
  const [taleWriteUp, setTaleWriteUp] = useState();
  const [encryptedLink, setEncryptedLink] = useState();
  const [currentChapter, setCurrentChapter] = useState();
  const [taleDetails, setTaleDetails] = useState();
  const [chapterDescription, setChapterDescription] = useState();
  const [chapterImageURI, setChapterImageURI] = useState();
  const [priceInUsd, setPriceInUsd] = useState();
  const [taleDetailsGenre, setTaleDetailsGenre] = useState();

  const [litNodeClient, setLitNodeClient] = useState();

  console.log(priceInUsd);

  const chain = "mumbai";
  let client;

  async function connectLit() {
    client = new LitJsSdk.LitNodeClient();
    await client.connect();
    setLitNodeClient(client);
    console.log("Lit client:", client);
  }

  useEffect(() => {
    connectLit();
  }, [client == undefined]);

  const { runContractFunction: getTaleDetails } = useWeb3Contract({
    abi: TALE_MANAGER_ABI,
    contractAddress: TALE_MANAGER_CONTRACT_ADDRESS,
    functionName: "getTaleDetails",
    params: {
      _taleContractAddress: taleContractAddress,
    },
  });

  const { runContractFunction: getCurrentChapter } = useWeb3Contract({
    abi: TALE_CONTRACT_ABI,
    contractAddress: taleContractAddress,
    functionName: "getCurrentChapter",
    params: {},
  });

  //   function dropNewChapter(
  //     string memory _chapterName,
  //     string memory _chapterDescription,
  //     string memory _chapterImageCover,
  //     uint256 _costInUsd,
  //     string memory _chapterURI,
  //     uint256 _genre
  // )

  const {
    data,
    error,
    fetch: dropNewChapter,
    isFetching,
    isLoading,
  } = useWeb3ExecuteFunction({
    abi: TALE_CONTRACT_ABI,
    contractAddress: taleContractAddress,
    functionName: "dropNewChapter",
    params: {
      _chapterName: chapterName,
      _chapterDescription: chapterDescription,
      _chapterImageCover: chapterImageURI,
      _costInUsd: priceInUsd,
      _chapterURI: encryptedLink,
      _genre: taleDetailsGenre,
    },
  });

  if (error) {
    console.log(error);
  }

  console.log(taleDetailsGenre);

  async function updateUIValues() {
    const taleDetailsFromCall = await getTaleDetails();
    const currentChapter = (
      parseInt((await getCurrentChapter()).toString()) + 1
    ).toString();
    setTaleDetailsGenre(taleDetailsFromCall["Genre"]);
    setTaleDetails(taleDetailsFromCall);
    setCurrentChapter(currentChapter);
  }

  function getAccessToken() {
    return process.env.NEXT_PUBLIC_WEB3STORAGE_TOKEN;
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  async function encrypt(stringMessage, chapter) {
    const evmContractConditions = [
      {
        contractAddress: taleContractAddress,
        functionName: "isAllowedToViewChapter",
        functionParams: [":userAddress", chapter],
        functionAbi: {
          inputs: [
            {
              internalType: "address",
              name: "_user",
              type: "address",
            },
            {
              internalType: "uint256",
              name: "_chapter",
              type: "uint256",
            },
          ],
          name: "isAllowedToViewChapter",
          outputs: [
            {
              internalType: "bool",
              name: "",
              type: "bool",
            },
          ],
          stateMutability: "view",
          type: "function",
        },
        chain: "mumbai",
        returnValueTest: {
          key: "",
          comparator: "=",
          value: "true",
        },
      },
    ];

    const authSig = await LitJsSdk.checkAndSignAuthMessage({ chain });
    console.log("Auth", authSig);
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      stringMessage
    );
    console.log("Saving encryption key.....");
    console.log("SYM key", symmetricKey);
    const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
      evmContractConditions,
      symmetricKey,
      authSig,
      chain,
    });

    console.log("I AM HERE", encryptedSymmetricKey);
    const encryptedKey = LitJsSdk.uint8arrayToString(
      encryptedSymmetricKey,
      "base16"
    );
    console.log("Packaging data.....");
    const packagedData = {
      encryptedString: Buffer.from(
        await encryptedString.arrayBuffer()
      ).toString("hex"),
      encryptedSymmetricKey: encryptedKey,
      evmContractConditions,
    };
    console.log(
      Buffer.from(await encryptedString.arrayBuffer()).toString("hex")
    );
    return packagedData;
  }

  function addPublicGateway(cid, chapter) {
    return (
      "https://" +
      cid +
      ".ipfs.dweb.link/" +
      taleContractAddress +
      "CHPT" +
      chapter +
      ".json"
    );
  }

  async function makeFileObjectsAndStore(_message, _chapter) {
    setEncryptedLoading(true);
    const packagedData = await encrypt(_message, _chapter);
    const blob = new Blob([JSON.stringify(packagedData)], {
      type: "application/json",
    });
    const files = [
      new File([blob], `${taleContractAddress + "CHPT" + _chapter}.json`),
    ];

    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log(
      `stored tale ${taleContractAddress} chapter ${_chapter} with cid:`,
      cid
    );
    const publicLink = addPublicGateway(cid, _chapter).toString();
    setEncryptedLink(publicLink);
    setEncryptedLoading(false);
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUIValues();
    }
    if (!isWeb3Enabled) {
      enableWeb3();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="dropChapterContainer">
      <h2>Drop Chapter</h2>
      {taleDetails && currentChapter ? (
        <h3>
          <span>{taleDetails[0]}: </span>
          Chapter {currentChapter}
        </h3>
      ) : (
        "Loading Tale Name..."
      )}

      <h4>1. Enter Chapter Name</h4>
      <p>Chapter Name:</p>
      <input
        onChange={(e) => {
          setChapterName(e.target.value);
        }}
      />

      <h4>2. Drop Your Chapter Description</h4>
      <p>Description:</p>
      <textarea
        onChange={(e) => {
          setChapterDescription(e.target.value);
        }}
      />

      <h4>3. Enter Chapter Image URI</h4>
      <p>Image URI:</p>
      <input
        onChange={(e) => {
          setChapterImageURI(e.target.value);
        }}
      />

      <h4>3. Set Price in USD</h4>
      <p>Price: </p>
      <input
        onChange={(e) => {
          setPriceInUsd(parseFloat(e.target.value) * 10 ** 8);
        }}
      />

      <h4>3. Encrypt and Upload Your Tale</h4>
      <p>Tale tale write-up:</p>
      <textarea
        onChange={(e) => {
          setTaleWriteUp(e.target.value);
        }}
      />

      <p>{encryptedLink && `Encrypted Link: ${encryptedLink}`}</p>

      {currentChapter && (
        <button
          className="uploadButton"
          onClick={async () =>
            await makeFileObjectsAndStore(taleWriteUp, currentChapter)
          }
        >
          {encryptLoading == false ? "Upload Tale" : "Encrypting Your Tale..."}
        </button>
      )}

      <button className="dropChapterButton" onClick={() => dropNewChapter()}>
        Drop Chapter
      </button>
    </div>
  );
}

export default DropChapter;
