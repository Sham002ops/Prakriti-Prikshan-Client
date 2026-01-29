import { useRef, useState } from 'react';
import Button from '../components/Button';
import { BACKEND_URL } from '../Config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ProcessingIcon } from '../components/ProcessingIcon';

const Signin = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    nextRef: React.RefObject<HTMLInputElement> | React.RefObject<HTMLButtonElement>
  ) => {
    if (e.key === "Enter") {
      nextRef.current?.focus();
      nextRef.current?.click();
    }
  };

  async function signin() {
    if (loading) return;
    setLoading(true);

    try {
      const username = usernameRef.current?.value;
      const password = passwordRef.current?.value;
      
      if (!username || !password) {
        alert("Please fill in all fields");
        setLoading(false);
        return;
      }

      const response = await axios.post(`${BACKEND_URL}/api/signin`, {
        username,
        password,
      });

      const jwt = response.data.token;

      if (jwt !== undefined) {
        localStorage.setItem("token", jwt);
        console.log("JWT Token:", jwt);
        localStorage.setItem("loggedIn", "true");
        navigate("/home");
      } else {
        alert(response.data.message);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.data?.message) {
        alert("Password doesn't match.");
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  function ToSignup() {
    navigate("/signup");
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-green-900 to-slate-800 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background decorative blobs - unchanged */}
      <div className="absolute bg-slate-900 opacity-30 h-48 w-48 rounded-full top-[-40px] left-[-40px] blur-2xl animate-float" />
      <div className="absolute bg-green-300 opacity-30 h-36 w-36 rounded-full bottom-[80px] right-[60px] blur-2xl animate-float-slow" />
      <div className="absolute bg-green-100 opacity-20 h-72 w-72 rounded-full bottom-[-100px] left-[60px] blur-3xl animate-float" />

      {/* Main container */}
      <div className="z-20 w-full max-w-md">
        
        {/* Header section - improved spacing and typography */}
        <div className="text-center mb-2">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3">
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
              Prakriti Parikshan
            </span>
          </h1>
          <p className="text-green-200 text-sm sm:text-base font-light tracking-wide">
            Ayurvedic Constitution Analysis
          </p>
          <div className=' flex justify-center items-center '>
              <img src="/logo.png" alt="" className="w-24 h-20 "/>
          </div>
        </div>
        

        {/* Sign in card - glassmorphism effect */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-green-500/30 shadow-2xl shadow-green-900/50 p-8 sm:p-10">
          
          {/* Card header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-300 text-sm">
              Sign in to continue your wellness journey
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            
            {/* Username field with icon */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-400 group-focus-within:text-green-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input
                type="text"
                ref={usernameRef}
                placeholder="Username"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 rounded-xl border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base"
                onKeyDown={(e) => handleKeyDown(e, passwordRef)}
              />
            </div>

            {/* Password field with icon and toggle */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-green-400 group-focus-within:text-green-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                ref={passwordRef}
                placeholder="Password"
                className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 rounded-xl border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base"
                onKeyDown={(e) => handleKeyDown(e, btnRef)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-green-400 transition-colors"
              >
                {showPassword ? (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>

            {/* Forgot password link */}
            <div className="flex justify-end">
              <button
                type="button"
                className="text-sm text-green-400 hover:text-green-300 transition-colors font-medium"
              >
                Forgot password?
              </button>
            </div>
          </div>

          {/* Sign in button */}
          <div className="mt-8">
            <Button
              reference={btnRef}
              size="md"
              transition="1"
              onClick={signin}
              variant="primary"
              fullWidth={true}
              loading={loading}
              text={loading ? "Signing in..." : "Sign In"}
              endIcon={loading ? <ProcessingIcon /> : <></>}
            />
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-slate-900/40 text-slate-400">
                New to Prakriti Parikshan?
              </span>
            </div>
          </div>

          {/* Sign up link */}
          <button
            onClick={ToSignup}
            className="w-full py-3 px-4 bg-transparent border-2 border-green-500/50 text-green-400 rounded-xl font-semibold hover:bg-green-500/10 hover:border-green-400 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            Create an account
            <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center">
          <p className="text-slate-400 text-xs sm:text-sm">
            By signing in, you agree to our{' '}
            <a href="#" className="text-green-400 hover:text-green-300 transition-colors">
              Terms & Conditions
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signin;
