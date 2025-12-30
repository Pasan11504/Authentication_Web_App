import { Routes, Route } from 'react-router-dom';
import FloatingShape from './components/FloatingShape';

import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useEffect } from 'react';
import DashboardPage from './pages/DashboardPage';
import { Navigate } from 'react-router-dom';
import LoadingSpinner from './components/LoadingSpinner';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

//protect routes that require authentication
const ProtectedRoute = ({children}) => {
  const {isAuthenticated,user}= useAuthStore();
  if(!isAuthenticated ){
    return <Navigate to='/login' replace />; //this will redirect the user to the login page
  }
  if(!user.isVerified){
    return <Navigate to='/verify-email' replace />; //this will redirect the user to the verify
  }
  return children;
};

//redirecting authenticated users to the home page
const RedirectAuthenticated = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user.isVerified) {
		return <Navigate to='/' replace />;       //this will redirect the user to the home page
	}

	return children;
};

function App() {
 
const {isCheckingAuth,checkAuth }= useAuthStore()
useEffect(() => {
  checkAuth()
},[checkAuth]);
if (isCheckingAuth) return <LoadingSpinner/>;


  return (
   <div 
   className= 'min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden'>

    <FloatingShape color='bg-green-500' size="w-64 h-64" top="5%" left="10%" delay={0} />
    <FloatingShape color='bg-green-500' size="w-48 h-48" top="70%" left="80%" delay={5} />
    <FloatingShape color='bg-green-500' size="w-32 h-32" top="40%" left="10%" delay={2} />
    
    <Routes>
      <Route path="/" element={<ProtectedRoute>
        <DashboardPage/>
        </ProtectedRoute> } />
      <Route path="/signup" element={<RedirectAuthenticated>
        <SignUpPage />
        </RedirectAuthenticated>}  />
      <Route path="/login" element={<RedirectAuthenticated>
        <LoginPage />
        </RedirectAuthenticated>} />
      <Route path='/verify-email' element={<EmailVerificationPage/>} />
      <Route path='/forgot-password' element={<RedirectAuthenticated>
        <ForgotPasswordPage/>
      </RedirectAuthenticated>} />
        <Route path='/reset-password/:token' element={<RedirectAuthenticated>
          <ResetPasswordPage/>
        </RedirectAuthenticated>}
        />
    </Routes>
  <Toaster/>
   </div>
  );
}

export default App
