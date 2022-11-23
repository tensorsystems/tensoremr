import Keycloak, { KeycloakConfig, KeycloakInitOptions } from "keycloak-js";
import { createContext, useEffect, useState } from "react";

/**
 * KeycloakConfig configures the connection to the Keycloak server.
 */
const keycloakConfig: KeycloakConfig = {
  realm: "TensorEMR",
  clientId: "web-app",
  url: "http://localhost:8080/",
};

/**
 * KeycloakInitOptions configures the Keycloak client.
 */
const keycloakInitOptions: KeycloakInitOptions = {
  // Configure that Keycloak will check if a user is already authenticated (when opening the app or reloading the page). If not authenticated the user will be send to the login form. If already authenticated the webapp will open.
  onLoad: "login-required",
};

// Create the Keycloak client instance
const keycloak = new Keycloak(keycloakConfig);

/**
 * AuthContextValues defines the structure for the default values of the {@link AuthContext}.
 */
interface AuthContextValues {
  /**
   * Whether or not a user is currently authenticated
   */
  isAuthenticated: boolean;
  /**
   * Function to initiate the logout
   */
  logout: () => void;

  username: string;

  groups: string[];

  hasRole: (role: string) => boolean;
}

/**
 * Default values for the {@link AuthContext}
 */
const defaultAuthContextValues: AuthContextValues = {
  isAuthenticated: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  logout: () => {},
  username: "",
  groups: [],
  hasRole: (role) => false,
};

/**
 * Create the AuthContext using the default values.
 */
export const AuthContext = createContext<AuthContextValues>(
  defaultAuthContextValues
);

/**
 * The props that must be passed to create the {@link AuthContextProvider}.
 */
interface AuthContextProviderProps {
  /**
   * The elements wrapped by the auth context.
   */
  children: JSX.Element;
}

/**
 * AuthContextProvider is responsible for managing the authentication state of the current user.
 *
 * @param props
 */
const AuthContextProvider = (props: AuthContextProviderProps) => {
  // Create the local state in which we will keep track if a user is authenticated
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [groups, setGroups] = useState<string[]>([]);

  const logout = () => {
    keycloak.logout({
      redirectUri: "http://localhost:5173/",
    });
  };

  const hasRole = (role: string) => {
    return keycloak.hasRealmRole(role);
  };

  useEffect(() => {
    /**
     * Initialize the Keycloak instance
     */
    async function initializeKeycloak() {
      console.log("initialize Keycloak");
      try {
        const isAuthenticatedResponse = await keycloak.init(
          keycloakInitOptions
        );

        if (!isAuthenticatedResponse) {
          console.log(
            "user is not yet authenticated. forwarding user to login."
          );
          keycloak.login();
        }
        console.log("user already authenticated");
        setAuthenticated(isAuthenticatedResponse);
      } catch {
        console.log("error initializing Keycloak");
        setAuthenticated(false);
      }
    }

    return () => {
      initializeKeycloak();
    };
  }, []);

  useEffect(() => {
    /**
     * Load the profile for of the user from Keycloak
     */
    async function loadProfile() {
      try {
        const userInfo: any = await keycloak.loadUserInfo();

        console.log("Profile", userInfo);

        if (userInfo?.given_name) {
          setUsername(userInfo.given_name);
        }

        if (userInfo?.groups) {
          setGroups(userInfo.groups);
        }
      } catch {
        console.log("error trying to load the user profile");
      }
    }

    // Only load the profile if a user is authenticated
    if (isAuthenticated) {
      loadProfile();
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, logout, username, groups, hasRole }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
