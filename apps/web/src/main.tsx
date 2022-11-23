/* eslint-disable @typescript-eslint/ban-ts-comment */
import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

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
import { HashRouter } from 'react-router-dom';
import { setContext } from '@apollo/client/link/context';

import './styles.css';

import 'material-icons-font/material-icons-font.css';
import { NotificationProvider } from '@tensoremr/notification';
import { BottomSheetProvider } from '@tensoremr/bottomsheet';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AuthContextProvider from './app/_context/AuthContextProvider';

const queryClient = new QueryClient();

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('accessToken');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

/*const httpLink = createHttpLink({
  uri: `${import.meta.env.VITE_APP_SERVER_URL}/query`,
});*/

const terminatingLink = createUploadLink({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  uri: `${import.meta.env.VITE_APP_SERVER_URL}/query`,
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

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <StrictMode>
    <ApolloProvider client={client}>
      <NotificationProvider>
        <BottomSheetProvider>
          <HashRouter>
            <QueryClientProvider client={queryClient}>
             <AuthContextProvider>
             <App />
             </AuthContextProvider>
            </QueryClientProvider>
          </HashRouter>
        </BottomSheetProvider>
      </NotificationProvider>
    </ApolloProvider>
  </StrictMode>
);
