import { useRef, useState } from 'react'
import { Input } from '../components/InputBox'
import Button from '../components/Button'
import { BACKEND_URL } from '../Config';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PasswordBox } from '../components/PasswordBox';
import { ProcessingIcon } from '../components/ProcessingIcon';

const Signup = () => {
  const usernameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
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

  async function signup() {
    if (loading) return;
    setLoading(true);

    const username = usernameRef.current?.value;
    const password = passwordRef.current?.value;
    const email = emailRef.current?.value;

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
    <div className="relative bg-gradient-to-br from-green-900 to-slate-900 h-screen w-screen overflow-hidden flex items-center justify-center ">
      
      {/* Background Floating Blobs */}
      <div className="absolute bg-green-400 opacity-30 h-72 w-72 rounded-full top-[-50px] left-[-50px] blur-2xl animate-float" />
      <div className="absolute bg-green-300 opacity-30 h-60 w-60 rounded-full bottom-[100px] right-[80px] blur-2xl animate-float-slow" />
      <div className="absolute bg-green-100 opacity-20 h-96 w-96 rounded-full bottom-[-150px] left-[100px] blur-3xl animate-float" />

      {/* Floating Title */}
      <h2 className="absolute top-20 text-xl sm:text-2xl md:text-3xl font-bold text-green-800 animate-pulse z-20 drop-shadow-md">
        <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent">
          Step Into a Smarter You.!
        </span>
      </h2>

      {/* Skip SignUp Button */}
      {/* <div
        onClick={ToSignin}
        className="absolute bottom-7 sm:bottom-20 left-6 sm:left-20 flex justify-center border-2 border-slate-600 text-slate-800 px-4 py-2 rounded-md cursor-pointer hover:bg-slate-600 hover:text-white transition-all backdrop-blur z-20"
      >
        Skip the Signin
      </div> */}

      {/* Signup Card */}
      <div className="z-20 w-full max-w-md bg-gradient-to-tr from-slate-800 to-slate-900  rounded-xl border border-green-400 shadow-md shadow-green-500 p-10">
        <h2 className="text-center text-2xl font-bold text-green-400 mb-2">Sign up</h2>
        <p className="text-center text-sm text-gray-300 mb-6">Just a few details to get you started ✨</p>

        <div className="space-y-4">
          <Input
            size="2lx"
            reference={emailRef}
            placeholder="email@domain.com"
            onKeyDown={(e) => handleKeyDown(e, usernameRef)}
          />
          <Input
            size="2lx"
            reference={usernameRef}
            placeholder="Username"
            onKeyDown={(e) => handleKeyDown(e, passwordRef)}
          />
          <PasswordBox
            reference={passwordRef}
            placeholder="Password"
            onKeyDown={(e) => handleKeyDown(e, btnRef)}
          />
        </div>

        <div className="pt-6">
          <Button
            reference={btnRef}
            size="md"
            transition="1"
            onClick={signup}
            variant="primary"
            fullWidth={true}
            loading={loading}
            text="Sign Up"
            endIcon={loading ? <ProcessingIcon /> : <></>}
          />
        </div>

        <div
          onClick={ToSignin}
          className="mt-6 text-center text-md cursor-pointer text-green-400 hover:underline"
        >
          Already Registered? <span className="font-semibold">Sign In</span>
        </div>
      </div>
    </div>
  );
};

export default Signup;
