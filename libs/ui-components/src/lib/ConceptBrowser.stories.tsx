import { ComponentStory, ComponentMeta } from '@storybook/react';
import { ConceptBrowser } from './ConceptBrowser';
import { GET_CONCEPT_CHILDREN } from '@tensoremr/util';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  gql,
  ApolloLink,
} from '@apollo/client';
import { cache } from '@tensoremr/cache';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';

export default {
  component: ConceptBrowser,
  title: 'ConceptBrowser',
} as ComponentMeta<typeof ConceptBrowser>;

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6NSwiRW1haWwiOiJ6ZWxhbGVtb3BoMUB5YWhvby5jb20iLCJOYW1lIjoiWmVsYWxlbSBFc2hldHUiLCJVc2VyVHlwZSI6WyJBZG1pbiIsIlBoeXNpY2lhbiJdLCJleHAiOjE2NjQxODAyNzcsImlzcyI6IkNvcmVTZXJ2aWNlIn0.6xXD8UcReasbt59q8aFpktIgWy_ipi1XRXE5YtbsY2g`,
    },
  };
});

const terminatingLink = createUploadLink({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  uri: `http://localhost:8080/query`,
});

const typeDefs = gql`
  extend type Query {
    isLoggedIn: Boolean!
  }
`;

const client: ApolloClient<NormalizedCacheObject> = new ApolloClient({
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

const Template: ComponentStory<typeof ConceptBrowser> = (args) => (
  <ApolloProvider client={client}>
    <ConceptBrowser {...args} />
  </ApolloProvider>
);

export const Primary = Template.bind({});
Primary.args = {
  conceptId: '365448001',
};
