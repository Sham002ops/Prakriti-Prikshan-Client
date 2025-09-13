import { useRef, useState } from 'react';
// import { Input } from '../components/InputBox';
import Button from '../components/Button';
import { BACKEND_URL } from '../Config';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { PasswordBox } from '../components/PasswordBox';
import { ProcessingIcon } from '../components/ProcessingIcon';

const Signin = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [loading, setLoading] = useState(false);
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
      
      <div className="absolute bg-slate-900 opacity-30 h-48 w-48 rounded-full top-[-40px] left-[-40px] blur-2xl animate-float" />
      <div className="absolute bg-green-300 opacity-30 h-36 w-36 rounded-full bottom-[80px] right-[60px] blur-2xl animate-float-slow" />
      <div className="absolute bg-green-100 opacity-20 h-72 w-72 rounded-full bottom-[-100px] left-[60px] blur-3xl animate-float" />

      <div className="absolute top-12 text-center w-full">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-800 animate-pulse drop-shadow-sm">
          <span className="bg-gradient-to-r from-green-500 to-emerald-600 bg-clip-text text-transparent">
            Prakriti Parikshan
          </span>
        </h2>
        <div
          onClick={ToSignup}
          className="mt-4 inline-block border-2 border-green-600 text-green-800 px-4 py-2 rounded-md cursor-pointer hover:bg-green-600 hover:text-white transition-all backdrop-blur"
        >
          Don&apos;t have an account?
        </div>
      </div>

      <div className="z-20 w-full max-w-md bg-gradient-to-tr from-slate-800 to-slate-900 rounded-xl border border-green-400 shadow-md shadow-green-600 p-6 sm:p-8">
        <h2 className="text-center text-2xl sm:text-3xl font-bold text-green-500 mb-2">Sign In</h2>
        <p className="text-center text-sm text-white mb-6">Welcome back to your Prakriti Parikshan</p>

        <div className="space-y-4">
          <input
            type="text"
            ref={usernameRef}
            placeholder="Username"
            className="w-full px-4 py-3 rounded-lg text-white border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
          />
          <input
            type="password"
            ref={passwordRef}
            placeholder="Password"
            className="w-full px-4 py-3 text-white rounded-lg border border-green-400 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
            onKeyDown={(e) => handleKeyDown(e, btnRef)}
          />
        </div>

        <div className="pt-4 sm:pt-6">
          <Button
            reference={btnRef}
            size="md"
            transition="1"
            onClick={signin}
            variant="primary"
            fullWidth={true}
            loading={loading}
            text="Sign In"
            endIcon={loading ? <ProcessingIcon /> : <></>}
          />
        </div>

        <div
          onClick={ToSignup}
          className="mt-4 text-center text-sm cursor-pointer text-green-700 hover:underline"
        >
          New here? <span className="font-semibold">Sign Up</span>
        </div>
      </div>
    </div>
  );
};

export default Signin;
