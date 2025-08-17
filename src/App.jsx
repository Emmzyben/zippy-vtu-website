import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WalletProvider } from './context/WalletContext';
import { useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Pages
import Landing from './pages/landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import Airtime from './pages/Airtime';
import Data from './pages/Data';
import Bills from './pages/Bills';
import Wallet from './pages/Wallet';
import Transactions from './pages/Transactions';
import Referral from './pages/Referral';
import Profile from './pages/Profile';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return !isAuthenticated ? children : <Navigate to="/" />;
};

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
  {/* Public Routes */}
  <Route index element={   
    <PublicRoute>
      <Landing />
    </PublicRoute>
  } />
  <Route path="/login" element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  } />
  <Route path="/register" element={
    <PublicRoute>
      <Register />
    </PublicRoute>
  } />

  {/* Protected Routes */}
  <Route path="/home" element={   // 👈 move Home to /home
    <ProtectedRoute>
      <Home />
    </ProtectedRoute>
  } />
  <Route path="/airtime" element={
    <ProtectedRoute>
      <Airtime />
    </ProtectedRoute>
  } />
  <Route path="/data" element={
    <ProtectedRoute>
      <Data />
    </ProtectedRoute>
  } />
  <Route path="/bills" element={
    <ProtectedRoute>
      <Bills />
    </ProtectedRoute>
  } />
  <Route path="/wallet" element={
    <ProtectedRoute>
      <Wallet />
    </ProtectedRoute>
  } />
  <Route path="/transactions" element={
    <ProtectedRoute>
      <Transactions />
    </ProtectedRoute>
  } />
  <Route path="/referral" element={
    <ProtectedRoute>
      <Referral />
    </ProtectedRoute>
  } />
  <Route path="/profile" element={
    <ProtectedRoute>
      <Profile />
    </ProtectedRoute>
  } />
</Route>

    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <WalletProvider>
        <Router>
          <AppRoutes />
        </Router>
      </WalletProvider>
    </AuthProvider>
  );
}

export default App;