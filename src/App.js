import { InteractionRequiredAuthError } from "@azure/msal-browser";
import { MsalProvider, useIsAuthenticated, useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import "./App.css";
import { PageLayout } from "./components/PageLayout";
import { Provider as EmailCCMProvider } from "./context/EmailCCMContext";
import { Provider as EmailProvider } from "./context/EmailContext";
import { Provider as FormProvider } from "./context/FormContext";
import { Provider as LogMetricsProvider } from "./context/LogMetricsContext";
import { Provider as EthicsMarketActivityProvider } from "./context/MarketEthicsActivityContext";
import { Provider as ProfileProvider } from "./context/ProfileContext";
import { Provider as UserProvider } from "./context/UserContext";
import { AddItem, EditItem, Home, PageNotFound, Profile } from "./pages";
import Activity from "./pages/Activity";
import AddActivity from "./pages/AddActivity";
import AddEthicsValue from "./pages/AddEthicsValue";
import AddNewMarket from "./pages/AddNewMarket";
import AdminPage from "./pages/AdminPage";
import AuditDetails from "./pages/AuditDetails";
import EmailECM from "./pages/EmailECM";
import EmailKCM from "./pages/EmailKCM";
import EthicsVolume from "./pages/EthicsVolume";
import MarketListing from "./pages/MarketListing";
import OperationsDashboard from "./pages/OperationsDashboard";
import TechInsights from "./pages/TechInsights";
import Unauthorized from "./pages/Unauthorized";
import ErrorHandler from "./utilities/ErrorHandler";
import useIdle from "./utilities/useIdleTimer";

window.Buffer = window.Buffer || require("buffer").Buffer;

function App({ msalinstance }) {
  return (
    <ErrorBoundary FallbackComponent={ErrorHandler}>
      <MsalProvider instance={msalinstance}>
        <ProfileProvider>
          <UserProvider>
            <LogMetricsProvider>
              <EmailProvider>
                <EmailCCMProvider>
                  <FormProvider>
                    <EthicsMarketActivityProvider>
                      <PageLayout>
                        <Pages />
                      </PageLayout>
                    </EthicsMarketActivityProvider>
                  </FormProvider>
                </EmailCCMProvider>
              </EmailProvider>
            </LogMetricsProvider>
          </UserProvider>
        </ProfileProvider>
      </MsalProvider>
    </ErrorBoundary>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "*",
    element: <PageNotFound />,
  },
  {
    path: "/unauthorized",
    element: <Unauthorized />,
  },
  {
    path: "/AddMarket",
    element: <AddItem />,
  },
  {
    path: "/AdminPage/MarketListing/AddNewMarket",
    element: <AddNewMarket />,
  },
  {
    path: "/EthicsVolume/AddEthicsValue",
    element: <AddEthicsValue />,
  },
  {
    path: "/Activity/AddActivity",
    element: <AddActivity />,
  },
  {
    path: "/EditMarket",
    element: <EditItem />,
  },
  {
    path: "/AdminPage/MarketListing",
    element: <MarketListing />,
  },
  {
    path: "/EmailKCM",
    element: <EmailKCM />,
  },
  {
    path: "/EmailECM",
    element: <EmailECM />,
  },
  {
    path: "/EthicsVolume",
    element: <EthicsVolume />,
  },
  {
    path: "/TechInsights",
    element: <TechInsights />,
  },
  {
    path: "/Activity",
    element: <Activity />,
  },
  {
    path: "/OperationsDashboard",
    element: <OperationsDashboard />,
  },
  {
    path: "/AuditDetails",
    element: <AuditDetails />,
  },
  {
    path: "/AdminPage",
    element: <AdminPage />,
  },
]);

const Pages = () => {
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const handleSignOut = () => {
    instance.logoutRedirect({
      postLogoutRedirectUri: "/",
    });
  };
  useIdle({ onIdle: handleSignOut, idleTime: 20 });

  useEffect(() => {
    if (!isAuthenticated) {
      instance
        .ssoSilent({
          scopes: ["user.read"],
        })
        .then((response) => {
          instance.setActiveAccount(response.account);
        })
        .catch((error) => {
          if (error instanceof InteractionRequiredAuthError) {
            instance.loginRedirect({
              scopes: ["user.read"],
            });
          }
        });
    }
  }, [isAuthenticated, instance]);

  return <RouterProvider router={router} />;
};

export default App;
