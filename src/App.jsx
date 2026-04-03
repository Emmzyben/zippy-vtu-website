import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import useOnline from './hooks/useOnline';
import EmailVerificationChecker from './components/EmailVerificationChecker';

// Pages
// Pages
import Landing from './pages/public/landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Home from './pages/dashboard/Home';
import Airtime from './pages/dashboard/Airtime';
import Data from './pages/dashboard/Data';
import Bills from './pages/dashboard/Bills';
import Electricity from './pages/dashboard/Electricity';
import Cable from './pages/dashboard/Cable';
import Flights from './pages/dashboard/Flights';
import Wallet from './pages/dashboard/Wallet';
import Transactions from './pages/dashboard/Transactions';
import TransactionDetails from './pages/dashboard/TransactionDetails';
import Profile from './pages/dashboard/Profile';
import FAQ from './pages/public/FAQ';
import Contact from './pages/public/Contact';
import Terms from './pages/public/Terms';
import Privacy from './pages/public/Privacy';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import NoInternet from './pages/dashboard/NoInternet';

// Event Ticketing Pages
import Events from './pages/dashboard/Events';
import EventDetails from './pages/dashboard/EventDetails';
import EventsInfo from './pages/public/EventsInfo';
import PublicEventDetails from './pages/public/PublicEventDetails';
import MyTickets from './pages/dashboard/MyTickets';
import TicketDetails from './pages/dashboard/TicketDetails';

// Organizer Pages
// Organizer Pages
import OrganizerDashboard from './pages/dashboard/organizer/Dashboard';
import CreateEvent from './pages/dashboard/organizer/CreateEvent';
import ManageEvents from './pages/dashboard/organizer/ManageEvents';
import Scanner from './pages/dashboard/organizer/Scanner';
import EventPerformance from './pages/dashboard/organizer/EventPerformance';
import OrganizerTransactions from './pages/dashboard/organizer/Transactions';

import { NotificationProvider } from './components/notificationContext';
import InstallPromptModal from './components/InstallPromptModal';
import { InstallProvider } from './context/InstallContext';
import FloatingInstallButton from './components/FloatingInstallButton';
import InstallInstructions from './components/InstallInstructions';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const isOnline = useOnline();

  if (loading) {
    return children;
  }

  if (isAuthenticated && !isOnline) {
    return <NoInternet />;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return children;
  }

  return !isAuthenticated ? children : <Navigate to="/home" />;
};

const AuthRedirect = () => {
  const { isAuthenticated, loading } = useAuth();
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true;

  if (loading) {
    return null;
  }

  // If already logged in, always go home
  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  // If not logged in:
  // - If running as an installed app (standalone), go straight to login
  // - If running in a browser, show the landing page
  return isStandalone ? <Navigate to="/login" /> : <Navigate to="/landing" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Default redirect */}
        <Route index element={<AuthRedirect />} />

        {/* Public Routes */}
        <Route
          path="/landing"
          element={
            <PublicRoute>
              <Landing />
            </PublicRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <PublicRoute>
              <ResetPassword />
            </PublicRoute>
          }
        />
        <Route
          path="/events"
          element={
            <PublicRoute>
              <EventsInfo />
            </PublicRoute>
          }
        />
        <Route
          path="/events/:id"
          element={
            <PublicRoute>
              <PublicEventDetails />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/airtime"
          element={
            <ProtectedRoute>
              <Airtime />
            </ProtectedRoute>
          }
        />
        <Route
          path="/data"
          element={
            <ProtectedRoute>
              <Data />
            </ProtectedRoute>
          }
        />
        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <Bills />
            </ProtectedRoute>
          }
        />
        <Route
          path="/electricity"
          element={
            <ProtectedRoute>
              <Electricity />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cable"
          element={
            <ProtectedRoute>
              <Cable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flights"
          element={
            <ProtectedRoute>
              <Flights />
            </ProtectedRoute>
          }
        />
        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions/:id"
          element={
            <ProtectedRoute>
              <TransactionDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Event Ticketing Routes (Internal) */}
        <Route
          path="/app/explore-events"
          element={
            <ProtectedRoute>
              <Events />
            </ProtectedRoute>
          }
        />
        <Route
          path="/app/events/:id"
          element={
            <ProtectedRoute>
              <EventDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tickets"
          element={
            <ProtectedRoute>
              <MyTickets />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-tickets/:id"
          element={
            <ProtectedRoute>
              <TicketDetails />
            </ProtectedRoute>
          }
        />

        {/* Organizer Routes */}
        <Route
          path="/organizer/dashboard"
          element={
            <ProtectedRoute>
              <OrganizerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/create-event"
          element={
            <ProtectedRoute>
              <CreateEvent />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/manage-events"
          element={
            <ProtectedRoute>
              <ManageEvents />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/scanner"
          element={
            <ProtectedRoute>
              <Scanner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/event-performance/:id"
          element={
            <ProtectedRoute>
              <EventPerformance />
            </ProtectedRoute>
          }
        />
        <Route
          path="/organizer/transactions"
          element={
            <ProtectedRoute>
              <OrganizerTransactions />
            </ProtectedRoute>
          }
        />

      </Route>

      {/* Additional Public Pages */}
      <Route path="/contact" element={
        <PublicRoute>
          <Contact />
        </PublicRoute>
      } />
      <Route path="/faq" element={
        <PublicRoute>
          <FAQ />
        </PublicRoute>
      } />
      <Route path="/privacy" element={
        <PublicRoute>
          <Privacy />
        </PublicRoute>
      } />
      <Route path="/terms" element={
        <PublicRoute>
          <Terms />
        </PublicRoute>
      } />

    </Routes>
  );
}


function App() {
  return (
    <NotificationProvider>
      <InstallProvider>
        <AuthProvider>
          <WalletProvider>
            <Router>
              <AppRoutes />
              <EmailVerificationChecker />
              <InstallPromptModal />
              <FloatingInstallButton />
              <InstallInstructions />
            </Router>
          </WalletProvider>
        </AuthProvider>
      </InstallProvider>
    </NotificationProvider>
  );
}

export default App;
