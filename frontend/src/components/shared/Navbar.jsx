import React from "react";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FaUser } from "react-icons/fa";
import { IoLogOutOutline } from "react-icons/io5";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { setUser } from "@/redux/authSlice";
import { toast } from "sonner";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    try {
      const res = await axios.get(`${USER_API_END_POINT}/logout`, {
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(null));
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Logout failed.");
    }
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between">
        {/* Brand */}
        <div className="text-2xl font-bold text-orange-700 tracking-wide">
          Kaam<span className="text-orange-400">Pao</span>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8">
          <ul className="hidden md:flex items-center gap-6 font-medium text-gray-700 text-[13px]">
            {user && user.role === "recruiter" ? (
              <>
                <li>
                  <Link to="/" className="hover:text-orange-500 transition">Companies</Link>
                </li>
                <li>
                  <Link to="/admin/jobs" className="hover:text-orange-500 transition">Jobs</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/" className="hover:text-orange-500 transition">Home</Link>
                </li>
                <li>
                  <Link to="/jobs" className="hover:text-orange-500 transition">Jobs</Link>
                </li>
                <li>
                  <Link to="/browse" className="hover:text-orange-500 transition">Browse</Link>
                </li>
                <li>
                  <Link to="/jobsuggestion" className="hover:text-orange-500 transition">Job Suggestion</Link>
                </li>
                <li>
                  <Link to="/contractreader" className="hover:text-orange-500 transition">Contract Reader</Link>
                </li>
                <li>
                  <Link to="/motivation" className="hover:text-orange-500 transition">Motivation</Link>
                </li>
                <li>
                  <Link to="/earning" className="hover:text-orange-500 transition">Earning Calculator</Link>
                </li>
                <li>
                  <Link to="/resume" className="hover:text-orange-500 transition">Resume</Link>
                </li>
              </>
            )}
          </ul>

          {/* Auth Buttons or Profile */}
          {!user ? (
            <div className="flex gap-3">
              <Link to="/login">
                <Button variant="outline" className="border-orange-500 text-orange-600 hover:bg-orange-50">
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white">
                  Sign Up
                </Button>
              </Link>
            </div>
          ) : (
            <Popover>
              <PopoverTrigger>
                <Avatar className="cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                </Avatar>
              </PopoverTrigger>
              <PopoverContent className="w-64">
                <div className="flex gap-3 items-center">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                  </Avatar>
                  <div>
                    <h4 className="font-semibold text-gray-800">{user?.fullname}</h4>
                    <p className="text-sm text-gray-500">
                      {user?.profile?.bio || "Worker"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  {user.role === "worker" && (
                    <Link to="/profile">
                      <Button variant="ghost" className="w-full justify-start gap-2 text-gray-700 hover:text-orange-600">
                        <FaUser />
                        View Profile
                      </Button>
                    </Link>
                  )}
                  <Button
                    onClick={logoutHandler}
                    variant="ghost"
                    className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
                  >
                    <IoLogOutOutline />
                    Logout
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
