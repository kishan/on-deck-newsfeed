import {ApolloClient, InMemoryCache, ApolloProvider} from '@apollo/client'
import {createGlobalStyle, ThemeProvider} from 'styled-components'
import type { AppProps } from 'next/app'
import {NewsfeedQueryReturn} from './../graphql/resolvers/Query/newsfeed'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <ApolloProvider client={client}>
          <Component {...pageProps} />
        </ApolloProvider>
      </ThemeProvider>
    </>
  )
}

function mergeNewsfeedQuery(existing?: NewsfeedQueryReturn, incoming?: NewsfeedQueryReturn) {
  if (!incoming) {
    return existing
  } else if (!existing) {
    return incoming
  } else {
    const mergedItemList = [...existing.items, ...incoming.items]
    const newPageInfo = incoming.pageInfo
    return {items: mergedItemList, pageInfo: newPageInfo} 
  }
}

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        newsfeed: {
          keyArgs: ["fellowship"],
          merge: mergeNewsfeedQuery,
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: '/api/graphql',
  cache: cache,
})

const theme = {
  colors: {
  }
};

const GlobalStyle = createGlobalStyle`
  html,
  body {
    padding: 0;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
      Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    font-size: 14px;
  }

  a {
    color: #0070f0;
    text-decoration: none;
  }

  a:hover {
    color: #0050d0;
    text-decoration: underline;
  }

  h1 {
    font-size: 2rem;
    font-weight: 700;
    margin: 0 0 1rem;
  }

  h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0 0 1rem;
  }

  h3 {
    font-size: 1.2rem;
    font-weight: 500;
    margin: 0 0 1rem;
  }

  p {
    font-size: 1rem;
    margin: 0 0 1rem;
  }

  * {
    box-sizing: border-box;
  }
`;