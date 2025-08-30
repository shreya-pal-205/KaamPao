import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar.jsx";
import { Label } from "@radix-ui/react-label";
import { Input } from "../ui/input.jsx";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { Button } from "../ui/button.jsx";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant.js";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setLoading } from "@/redux/authSlice.js";
import { Loader2 } from "lucide-react";

const Signup = () => {
  const [input, setInput] = useState({
    fullname: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    file: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    setInput({ ...input, file: e.target.files?.[0] });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phone", input.phone);
    formData.append("password", input.password);
    formData.append("role", input.role);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      dispatch(setLoading(true));
      const res = await axios.post(`${USER_API_END_POINT}/register`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      if (res.data.success) {
        navigate("/login");
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      dispatch(setLoading(false));
    }
  };

     useEffect(()=>{
          if(user){
              navigate("/");
          }
      },[])

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 text-orange-900">
        <Navbar />
        <div className="flex items-center justify-center px-4 py-16">
          <form
            onSubmit={submitHandler}
            className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-10 border border-orange-200"
          >
            <h1 className="text-3xl font-extrabold text-orange-500 text-center mb-8">
              Create Your JobHunt Account
            </h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-orange-700">
                  Full Name
                </Label>
                <Input
                  type="text"
                  name="fullname"
                  value={input.fullname}
                  onChange={changeEventHandler}
                  placeholder="John Doe"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-orange-700">
                  Email
                </Label>
                <Input
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={changeEventHandler}
                  placeholder="john@example.com"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-orange-700">
                  Phone Number
                </Label>
                <Input
                  type="text"
                  name="phone"
                  value={input.phone}
                  onChange={changeEventHandler}
                  placeholder="+91 9876543210"
                  className="mt-1"
                />
              </div>

              <div>
                <Label className="text-sm font-medium text-orange-700">
                  Password
                </Label>
                <Input
                  type="password"
                  name="password"
                  value={input.password}
                  onChange={changeEventHandler}
                  placeholder="******"
                  className="mt-1"
                />
              </div>
            </div>

            <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex gap-6 items-center">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="worker"
                    checked={input.role === "worker"}
                    onChange={changeEventHandler}
                    className="accent-orange-500"
                  />
                  <Label className="text-sm text-orange-800">Worker</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="role"
                    value="recruiter"
                    checked={input.role === "recruiter"}
                    onChange={changeEventHandler}
                    className="accent-orange-500"
                  />
                  <Label className="text-sm text-orange-800">Recruiter</Label>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
                <Label className="text-sm text-orange-800">
                  Profile Picture
                </Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={changeFileHandler}
                  className="cursor-pointer border border-orange-300"
                />
              </div>
            </div>

            <div className="mt-8">
              {loading ? (
                <Button
                  disabled
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                >
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                  account...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-700 hover:from-orange-600 hover:to-orange-800 text-white font-semibold"
                >
                  Sign Up
                </Button>
              )}
            </div>

            <p className="text-center mt-4 text-sm text-orange-700">
              Already have an account?{" "}
              <Link
                to="/login"
                className="underline text-orange-500 hover:text-orange-600"
              >
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default Signup;
