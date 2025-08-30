import { Label } from "@radix-ui/react-label";
import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Navbar from "../shared/Navbar";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Button } from "../ui/button";
import { data, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading, setUser } from "@/redux/authSlice";
import { Loader2 } from "lucide-react";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/login`, input, {
        headers: { "Content-Type": "application/json" },
        withCredentials: true,
      });
      if (res.data.success) {
        dispatch(setUser(res.data.user))
        navigate("/");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  }

   useEffect(()=>{
        if(user){
            navigate("/");
        }
    },[])

    
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 text-orange-900">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-16">
        <form
          onSubmit={submitHandler}
          className="w-full max-w-lg rounded-2xl bg-white shadow-2xl border border-orange-300 p-8"
        >
          <h1 className="text-3xl font-bold text-center text-orange-600 mb-6">
            Welcome Back
          </h1>

          <div className="mb-4">
            <Label className="text-sm text-orange-700 font-semibold">Email</Label>
            <Input
              type="email"
              value={input.email}
              name="email"
              onChange={changeEventHandler}
              placeholder="Enter your email"
              className="mt-1 bg-orange-50 text-orange-900 border border-orange-300 focus:border-orange-500"
            />
          </div>

          <div className="mb-4">
            <Label className="text-sm text-orange-700 font-semibold">Password</Label>
            <Input
              type="password"
              value={input.password}
              name="password"
              onChange={changeEventHandler}
              placeholder="Enter your password"
              className="mt-1 bg-orange-50 text-orange-900 border border-orange-300 focus:border-orange-500"
            />
          </div>

          <div className="mb-6">
            <Label className="text-sm text-orange-700 font-semibold block mb-2">
              Select Role
            </Label>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-orange-800">
                <input
                  type="radio"
                  name="role"
                  value="worker"
                  checked={input.role === "worker"}
                  onChange={changeEventHandler}
                  className="accent-orange-500"
                />
                Worker
              </label>
              <label className="flex items-center gap-2 text-orange-800">
                <input
                  type="radio"
                  name="role"
                  value="recruiter"
                  checked={input.role === "recruiter"}
                  onChange={changeEventHandler}
                  className="accent-orange-500"
                />
                Recruiter
              </label>
            </div>
          </div>

          {loading ? (
            <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Logging in...
            </Button>
          ) : (
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold"
            >
              Login
            </Button>
          )}

          <p className="text-sm text-center mt-4 text-orange-700">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-orange-500 hover:underline font-semibold">
              Sign Up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
