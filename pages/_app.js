import { MoralisProvider } from "react-moralis";
import Layout from "../components/Layout";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const apolloClient = new ApolloClient({
    uri: "https://api.thegraph.com/subgraphs/name/franfran20/tell-your-tale-subgraph",
    cache: new InMemoryCache(),
  });

  return (
    <MoralisProvider initializeOnMount={false}>
      <ApolloProvider client={apolloClient}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ApolloProvider>
    </MoralisProvider>
  );
}

export default MyApp;
