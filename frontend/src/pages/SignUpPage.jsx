import React from 'react'
import {useState} from 'react'
import {motion} from 'framer-motion'
import Input from '../components/Input'
import {User, Mail ,Lock,Loader} from 'lucide-react'
import {Link, useNavigate} from 'react-router-dom'
import PasswordStrenghtMeter from '../components/PasswordStrenghtMeter'
import { useAuthStore } from '../store/authStore'

const SignUpPage = () => {
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate =  useNavigate(); 
    const {signup,isLoading,error} = useAuthStore();

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
			await signup(email, password, name);
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
    }

  return (
    <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5}}
        className ='max-w-md w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden'

    >
    <div className='p-8'>

       <h2 
        className='text-3xl font-bold mb-6  text-center bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent'
       >
        Create Account
        </h2> 

        <form onSubmit={handleSignUp}>
            <Input
                icon={User}
                type='text'
                placeholder='Full name'
                value={name}
                onChange={(e) => setName(e.target.value)}
               />

            <Input
                icon={Mail}
                type='email'
                placeholder='Email Address'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
               />
             <Input
                icon={Lock}
                type='password'
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
               />  
               {error && <p className='text-red-500 font-semibold mt-2'>{error}</p>}
               <PasswordStrenghtMeter password={password}/>
                <motion.button
                    className='mt-5 w-full py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold rounded-lg shadow-lg hover:from-emerald-500 
                    hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                    focus:ring-offset-gray-900 transition duration-200 '
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type='submit'
                    disabled={isLoading}
                >
                    {isLoading ? <Loader className=' animate-spin mx-auto' size={24} /> : "Sign Up"}
                    
                </motion.button>

        </form>
    </div>
    <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center text-center'>
        <p className='text-gray-400 text-sm'>
            Already have an account?{" "}
            <Link to="/login" className="text-green-400 hover:underline">Login</Link>
        </p>
    </div>
    </motion.div>
  )
}

export default SignUpPage