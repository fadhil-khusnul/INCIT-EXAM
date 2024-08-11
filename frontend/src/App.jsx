
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import './App.css'
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';
import SignUp from './pages/SignUp';


import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CookiesProvider } from 'react-cookie';

import { useAuth } from './contexts/AuthContext';
import EditProfile from './pages/EditProfile';

const queryClient = new QueryClient();


const App = () => {
  const { isAuthenticated } = useAuth()
  return (
    <CookiesProvider defaultSetOptions={{ path: '/' }}>

      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>

            <Route path="/" element={!isAuthenticated ? <Home /> : <Navigate to={'/dashboard'} />} />
            <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to={'/dashboard'} />} />
            <Route path="/signup" element={!isAuthenticated ? <SignUp /> : <Navigate to={'/dashboard'} />} />
            <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to={'/login'} />} />
            <Route path="/edit-profile" element={isAuthenticated ? <EditProfile /> : <Navigate to={'/login'} />} />
          </Routes>

        </Router>

      </QueryClientProvider>
    </CookiesProvider>



  );
}

export default App;
