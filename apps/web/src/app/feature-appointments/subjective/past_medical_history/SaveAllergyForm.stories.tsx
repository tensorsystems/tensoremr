import { ComponentStory, ComponentMeta } from '@storybook/react';
import { SaveAllergyForm } from './SaveAllergyForm';
import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import {
  ApolloClient,
  NormalizedCacheObject,
  ApolloProvider,
  gql,
  ApolloLink,
} from '@apollo/client';
import { cache } from '@tensoremr/cache';

export default {
  component: SaveAllergyForm,
  title: 'SaveAllergyForm',
} as ComponentMeta<typeof SaveAllergyForm>;

const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6NSwiRW1haWwiOiJ6ZWxhbGVtb3BoMUB5YWhvby5jb20iLCJOYW1lIjoiWmVsYWxlbSBFc2hldHUiLCJVc2VyVHlwZSI6WyJBZG1pbiIsIlBoeXNpY2lhbiJdLCJleHAiOjE2NjUyMzI0OTcsImlzcyI6IkNvcmVTZXJ2aWNlIn0.SGnTHRYU00kCLdBNpLINii_GJzCKtcw5V_uv6-xc3Eo`,
    },
  };
});

const terminatingLink = createUploadLink({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  uri: `http://localhost:8081/query`,
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

const Template: ComponentStory<typeof SaveAllergyForm> = (args) => (
  <ApolloProvider client={client}>
    <SaveAllergyForm {...args} />
  </ApolloProvider>
);

export const Primary = Template.bind({});
Primary.args = {
  patientChartId: '0',
};
