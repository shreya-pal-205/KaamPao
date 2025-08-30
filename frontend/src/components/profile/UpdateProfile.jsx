import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader2, Pencil, Save, UploadCloud } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";
import store from "@/redux/store";

const UpdateProfile = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.map((skill) => skill) || "",
    file: user?.profile?.resume || "",
  });

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const changeFileHandler = (e) => {
    const file = e.target.files?.[0];
    setInput({ ...input, file });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phone", input.phone);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills);
    if (input.file) {
      formData.append("file", input.file);
    }
    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    } finally {
      setLoading(false);
    }
    setOpen(false);
    console.log(input);
  };

  return (
    <Dialog open={open}>
      <DialogTrigger asChild>
        <Button className="bg-orange-600 hover:bg-orange-700 text-white flex items-center gap-2">
          <Pencil size={18} />
          Edit Profile ✍️
        </Button>
      </DialogTrigger>

      <DialogContent
        className="max-w-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-200 shadow-xl rounded-xl p-6"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-700 flex items-center gap-2">
            🔧 Update Your Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Update your personal information and resume here.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitHandler} className="grid gap-4 mt-4">
          {/* Full Name */}
          <div className="grid gap-1">
            <Label className="text-orange-700 font-medium">Full Name</Label>
            <Input
              placeholder="e.g. Shreyashi Pal"
              className="bg-white border border-orange-200"
              id="fullname"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
            />
          </div>

          {/* Email */}
          <div className="grid gap-1">
            <Label className="text-orange-700 font-medium">Email</Label>
            <Input
              placeholder="e.g. shreyashi@email.com"
              type="email"
              id="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="bg-white border border-orange-200"
            />
          </div>

          {/* Phone */}
          <div className="grid gap-1">
            <Label className="text-orange-700 font-medium">Phone</Label>
            <Input
              placeholder="e.g. +91 9876543210"
              id="phone"
              name="phone"
              value={input.phone}
              onChange={changeEventHandler}
              className="bg-white border border-orange-200"
            />
          </div>

          {/* Skills */}
          <div className="grid gap-1">
            <Label className="text-orange-700 font-medium">Skill Set</Label>
            <Input
              placeholder="e.g. React, Node.js, MongoDB"
              id="skills"
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
              className="bg-white border border-orange-200"
            />
          </div>

          {/* Resume Upload */}
          <div className="grid gap-1">
            <Label className="text-orange-700 font-medium">Resume</Label>
            <Input
              type="file"
              id="file"
              name="file"
              accept="application/pdf"
              onChange={changeFileHandler}
              className="bg-white border border-orange-200 cursor-pointer"
            />
          </div>

          {/* Description */}
          <div className="grid gap-1">
            <Label className="text-orange-700 font-medium">About You</Label>
            <Input
              placeholder="bio"
              id="bio"
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              className="bg-white border border-orange-200"
            />
          </div>

          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4">
                {" "}
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait{" "}
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Update
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;
