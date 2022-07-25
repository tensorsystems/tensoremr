/* eslint-disable @typescript-eslint/ban-ts-comment */
import { StrictMode } from 'react';
import ReactDOM from "react-dom";

import App from './app/app';

import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  gql,
  ApolloLink,
} from '@apollo/client';
import { cache } from '@tensoremr/cache';
import { createUploadLink } from 'apollo-upload-client';
import { Router } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';
import history from './history';

import 'material-icons-font/material-icons-font.css';
import { NotificationProvider } from '@tensoremr/notification';
import { BottomSheetProvider } from '@tensoremr/bottomsheet';

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = sessionStorage.getItem('accessToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

/*const httpLink = createHttpLink({
  uri: `${window.__RUNTIME_CONFIG__.REACT_APP_SERVER_URL}/query`,
});*/

const terminatingLink = createUploadLink({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  uri: `${window.__RUNTIME_CONFIG__.REACT_APP_SERVER_URL}/query`,
});

export const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

export const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
  cache,
  link: authLink.concat(terminatingLink as unknown as ApolloLink),
  typeDefs,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
});

ReactDOM.render(
  <StrictMode>
    <ApolloProvider client={client}>
      <NotificationProvider>
        <BottomSheetProvider>
          <Router history={history}>
            <App />
          </Router>
        </BottomSheetProvider>
      </NotificationProvider>
    </ApolloProvider>
  </StrictMode>,
  document.getElementById("root")
);
