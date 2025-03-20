import { Link } from "react-router-dom";
import { LogOut, MessageSquare, Moon, Sun, User } from "lucide-react";
import { useGetCookies } from "../store/useGetCookies";
import { useThemeStore } from "../store/useThemeStore";
import { useEffect } from "react";
import {useChatStore} from '../store/useChatStore'

const Navbar = () => {
  const {authUser, logoutUser } = useGetCookies()
  const {theme,setTheme}=useThemeStore()
  const { getUserRequestsProfiles, UsersFriendRequestsProfiles } = useChatStore();

  const handleChange  = ()=>{
    setTheme(theme === "light" ? "dark" : "light");
  }
  const userRequestLength = UsersFriendRequestsProfiles?.filter((user)=>user.status === "pending").length


  
  useEffect(()=>{
    getUserRequestsProfiles(authUser)
  },[])
  
  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 hover:opacity-80 transition-all">
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-primary" />
              </div>
              <h1 className="text-lg font-bold">Chit-Chat</h1>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            
            <label className="swap swap-rotate">
              <input type="checkbox" className="theme-controller hidden"  checked={theme === "dark"} onChange={handleChange} />

              <Sun className="swap-off fill-white  w-8 h-8 text-[#1d232a] " />

              <Moon className="swap-on fill-[#1d232a]  w-8 h-8  text-white"/>
            </label>


            {authUser && (
            <>
              <Link to={"/profile"} className={`btn btn-sm gap-2`}>
                <User className="size-5" />
                <span className="hidden sm:inline">Profile</span>
              </Link>
              <Link to={"/notifications"} className={`btn btn-sm gap-2`}>
              <div className="relative ">
                <MessageSquare className="size-5" />
                <span className={`absolute -top-[6px] -right-[6px] text-[10px] bg-red-500 text-white rounded-full px-1 ${userRequestLength > 0 ? "block":"hidden"} `}>
                  {userRequestLength}
                </span>
              </div>
                <span className="hidden sm:inline">Notifications</span>
              </Link>

              <button className="flex gap-2 items-center"
                onClick={logoutUser}
              >
                <LogOut className="size-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
           )}
          </div>
        </div>
      </div>
    </header>
  );
};
export default Navbar;