export {};

declare global {
  interface Window {
    __RUNTIME_CONFIG__: {
      REACT_APP_SERVER_URL: string;
      REACT_APP_ELASTICSEARCH_URL: string;
      API_URL: string;
      NODE_ENV: string;
    };
  }
}