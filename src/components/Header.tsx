import { useNavigate } from "react-router-dom";
import Button from "./Button";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.clear();
    navigate("/signin");
    return null;
  };

  return (
    <header className="w-full bg-gradient-to-r from-emerald-700 to-emerald-900 p-4 shadow-md">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
      <div className=" flex items-center justify-between">
          <div className=' flex justify-center items-center '>
              <img src="/logo.png" alt="" className="w-20 h-16 "/>
          </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-white">
          Prakriti Parikshan
        </h1>
      </div>
        <Button
          variant="primary"
          size="md"
          text="Logout"
          transition="4"
          onClick={handleLogout}
        />
      </div>
    </header>
  );
};

export default Header;
