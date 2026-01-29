import { useRef, useState } from 'react';
import Button from '../components/Button';
import { BACKEND_URL } from '../Config';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ProcessingIcon } from '../components/ProcessingIcon';

const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    username: '',
    password: ''
  });
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

  // Email validation
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      setValidationErrors(prev => ({ ...prev, email: '' }));
      return false;
    }
    if (!emailRegex.test(email)) {
      setValidationErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, email: '' }));
    return true;
  };

  // Username validation
  const validateUsername = (username: string) => {
    if (!username) {
      setValidationErrors(prev => ({ ...prev, username: '' }));
      return false;
    }
    if (username.length < 3) {
      setValidationErrors(prev => ({ ...prev, username: 'Username must be at least 3 characters' }));
      return false;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setValidationErrors(prev => ({ ...prev, username: 'Only letters, numbers, and underscores allowed' }));
      return false;
    }
    setValidationErrors(prev => ({ ...prev, username: '' }));
    return true;
  };

  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength({ score: 0, text: '', color: '' });
      setValidationErrors(prev => ({ ...prev, password: '' }));
      return;
    }

    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    let text = '';
    let color = '';
    
    if (score <= 2) {
      text = 'Weak';
      color = 'bg-red-500';
    } else if (score === 3) {
      text = 'Fair';
      color = 'bg-yellow-500';
    } else if (score === 4) {
      text = 'Good';
      color = 'bg-green-500';
    } else {
      text = 'Strong';
      color = 'bg-emerald-500';
    }

    setPasswordStrength({ score, text, color });

    if (password.length < 8) {
      setValidationErrors(prev => ({ ...prev, password: 'Password must be at least 8 characters' }));
    } else {
      setValidationErrors(prev => ({ ...prev, password: '' }));
    }
  };

  async function signup() {
    if (loading) return;

    const username = usernameRef.current?.value || '';
    const password = passwordRef.current?.value || '';
    const email = emailRef.current?.value || '';

    // Validate all fields
    const isEmailValid = validateEmail(email);
    const isUsernameValid = validateUsername(username);
    const isPasswordValid = password.length >= 8;

    if (!isEmailValid || !isUsernameValid || !isPasswordValid) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(`${BACKEND_URL}/api/signup`, {
        username,
        password,
        email
      });

      if (response.data.message === "User signed up") {
        navigate("/signin");
      } else {
        alert("Signup failed: " + response.data.message);
      }
    } catch (e: unknown) {
      if (axios.isAxiosError(e) && e.response && e.response.data.error) {
        alert("Validation Error: " + e.response.data.error.message);
      } else {
        alert("An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  }

  function ToSignin() {
    navigate("/signin");
  }

  return (
    <div className="relative min-h-screen w-full bg-gradient-to-br from-green-900 to-slate-800 flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      
      {/* Background decorative blobs - unchanged */}
      <div className="absolute bg-green-400 opacity-30 h-72 w-72 rounded-full top-[-50px] left-[-50px] blur-2xl animate-float" />
      <div className="absolute bg-green-300 opacity-30 h-60 w-60 rounded-full bottom-[100px] right-[80px] blur-2xl animate-float-slow" />
      <div className="absolute bg-green-100 opacity-20 h-96 w-96 rounded-full bottom-[-150px] left-[100px] blur-3xl animate-float" />

      {/* Main container */}
      <div className="z-20 w-full max-w-md">
        
        {/* Header section */}
        <div className="text-center mb-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 mt-6">
            <span className="bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 bg-clip-text text-transparent drop-shadow-lg">
              Prakriti Parikshan
            </span>
          </h1>
          <p className="text-green-200 text-base sm:text-lg font-medium">
            Step Into a Smarter You! ✨
          </p>
                    <div className=' flex justify-center items-center '>
              <img src="/logo.png" alt="" className="w-24 h-20 "/>
          </div>
        </div>

        {/* Sign up card - glassmorphism effect */}
        <div className="bg-slate-900/40 backdrop-blur-xl rounded-2xl border border-green-500/30 shadow-2xl shadow-green-900/50 p-4 sm:p-10">
          
          {/* Card header */}
          <div className="mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-green-400 mb-2">
              Create Account
            </h2>
            <p className="text-slate-300 text-sm">
              Join us to begin your wellness journey
            </p>
          </div>

          {/* Form fields */}
          <div className="space-y-5">
            
            {/* Email field with icon and validation */}
            <div className="relative group">
              <label className="block text-sm font-medium text-green-300 mb-2">
                Email Address <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-green-400 group-focus-within:text-green-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  ref={emailRef}
                  placeholder="email@domain.com"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 rounded-xl border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base"
                  onKeyDown={(e) => handleKeyDown(e, usernameRef)}
                  onBlur={(e) => validateEmail(e.target.value)}
                  onChange={(e) => validateEmail(e.target.value)}
                />
              </div>
              {validationErrors.email && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.email}
                </p>
              )}
            </div>

            {/* Username field with icon and validation */}
            <div className="relative group">
              <label className="block text-sm font-medium text-green-300 mb-2">
                Username <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-green-400 group-focus-within:text-green-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  type="text"
                  ref={usernameRef}
                  placeholder="Choose a username"
                  className="w-full pl-12 pr-4 py-3.5 bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 rounded-xl border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base"
                  onKeyDown={(e) => handleKeyDown(e, passwordRef)}
                  onBlur={(e) => validateUsername(e.target.value)}
                  onChange={(e) => validateUsername(e.target.value)}
                />
              </div>
              {validationErrors.username && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.username}
                </p>
              )}
            </div>

            {/* Password field with icon, toggle, and strength meter */}
            <div className="relative group">
              <label className="block text-sm font-medium text-green-300 mb-2">
                Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-green-400 group-focus-within:text-green-300 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  ref={passwordRef}
                  placeholder="Create a strong password"
                  className="w-full pl-12 pr-12 py-3.5 bg-slate-800/50 backdrop-blur-sm text-white placeholder-slate-400 rounded-xl border border-green-500/30 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 text-base"
                  onKeyDown={(e) => handleKeyDown(e, btnRef)}
                  onChange={(e) => checkPasswordStrength(e.target.value)}
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
              
              {/* Password strength indicator */}
              {passwordStrength.score > 0 && (
                <div className="mt-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-400">Password strength:</span>
                    <span className={`text-xs font-semibold ${
                      passwordStrength.text === 'Weak' ? 'text-red-400' :
                      passwordStrength.text === 'Fair' ? 'text-yellow-400' :
                      passwordStrength.text === 'Good' ? 'text-green-400' :
                      'text-emerald-400'
                    }`}>
                      {passwordStrength.text}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className={`h-full ${passwordStrength.color} transition-all duration-300`}
                      style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
              
              {validationErrors.password && (
                <p className="mt-2 text-sm text-red-400 flex items-center gap-1">
                  <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {validationErrors.password}
                </p>
              )}

              {/* Password requirements */}
              <div className="mt-3 space-y-1">
                <p className="text-xs text-slate-400">Password must contain:</p>
                <ul className="text-xs text-slate-500 space-y-1 pl-4">
                  <li className="flex items-center gap-2">
                    <span className={passwordRef.current?.value && passwordRef.current.value.length >= 8 ? 'text-green-400' : ''}>
                      • At least 8 characters
                    </span>
                  </li>
                  <li className="text-slate-600">• Mix of uppercase & lowercase (recommended)</li>
                  <li className="text-slate-600">• Numbers & special characters (recommended)</li>
                </ul>
              </div>
            </div>

            {/* Terms and privacy */}
            <div className="pt-2">
              <p className="text-xs text-slate-400 leading-relaxed">
                By signing up, you agree to our{' '}
                <a href="#" className="text-green-400 hover:text-green-300 transition-colors underline">
                  Terms of Service
                </a>
                {' '}and{' '}
                <a href="#" className="text-green-400 hover:text-green-300 transition-colors underline">
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>

          {/* Sign up button */}
          <div className="mt-8">
            <Button
              reference={btnRef}
              size="md"
              transition="1"
              onClick={signup}
              variant="primary"
              fullWidth={true}
              loading={loading}
              text={loading ? "Creating account..." : "Create Account"}
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
                Already have an account?
              </span>
            </div>
          </div>

          {/* Sign in link */}
          <button
            onClick={ToSignin}
            className="w-full py-3 px-4 bg-transparent border-2 border-green-500/50 text-green-400 rounded-xl font-semibold hover:bg-green-500/10 hover:border-green-400 transition-all duration-200 flex items-center justify-center gap-2 group"
          >
            Sign in to your account
            <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {/* Security badge */}
        <div className="mt-6 text-center flex items-center justify-center gap-2">
          <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="text-slate-400 text-xs">
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
