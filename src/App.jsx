import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';
import useOnline from './hooks/useOnline';
import EmailVerificationChecker from './components/EmailVerificationChecker';

// Pages
import Landing from './pages/landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Airtime from './pages/Airtime';
import Data from './pages/Data';
import Bills from './pages/Bills';
import Electricity from './pages/Electricity';
import Cable from './pages/Cable';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import TransactionDetails from './pages/TransactionDetails';
import Profile from './pages/Profile';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import NoInternet from './pages/NoInternet';
import { NotificationProvider } from './components/notificationContext';

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

  if (loading) {
    return null;
  }

  return isAuthenticated ? <Navigate to="/home" /> : <Navigate to="/landing" />;
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
      <AuthProvider>
        <WalletProvider>
          <Router>
            <AppRoutes />
            <EmailVerificationChecker />
          </Router>
        </WalletProvider>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
