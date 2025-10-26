import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";
import { Loader2, Pencil } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { USER_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { setUser } from "@/redux/authSlice";

const UpdateProfile = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);

  const [input, setInput] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
  });

  const dispatch = useDispatch();

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  // Function to auto-generate a short worker summary
  const generateSummary = (input) => {
    const { fullname, bio, phone, email, skills } = input;
    return `
👷‍♂️ ${fullname} is a hardworking and skilled worker.
💬 About: ${bio || "No bio provided yet."}
📞 Contact: ${phone || "N/A"} | ✉️ ${email || "N/A"}
🛠️ Skills: ${skills || "Not specified"}
    `.trim();
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const summary = generateSummary(input);

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        {
          fullname: input.fullname,
          email: input.email,
          phone: input.phone,
          bio: input.bio,
          skills: input.skills,
          summary,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success("Profile updated successfully!");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Update failed!");
    } finally {
      setLoading(false);
    }
    setOpen(false);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-2xl bg-gradient-to-br from-orange-50 to-white border border-orange-200 shadow-xl rounded-xl p-6"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-orange-700 flex items-center gap-2">
            🔧 Update Your Profile
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Update your personal information and skills. Your auto-summary will be generated automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submitHandler} className="grid gap-4 mt-4">
          <div className="grid gap-1">
            <Label className="text-orange-700 font-medium">Full Name</Label>
            <Input
              placeholder="e.g. Shreyashi Pal"
              name="fullname"
              value={input.fullname}
              onChange={changeEventHandler}
              className="bg-white border border-orange-200"
            />
          </div>

          <div className="grid gap-1">
            <Label className="text-orange-700 font-medium">Email</Label>
            <Input
              type="email"
              name="email"
              value={input.email}
              onChange={changeEventHandler}
              className="bg-white border border-orange-200"
            />
          </div>

          <div className="grid gap-1">
            <Label className="text-orange-700 font-medium">Phone</Label>
            <Input
              name="phone"
              value={input.phone}
              onChange={changeEventHandler}
              className="bg-white border border-orange-200"
            />
          </div>

          <div className="grid gap-1">
            <Label className="text-orange-700 font-medium">Skill Set</Label>
            <Input
              name="skills"
              value={input.skills}
              onChange={changeEventHandler}
              className="bg-white border border-orange-200"
            />
          </div>

          <div className="grid gap-1">
            <Label className="text-orange-700 font-medium">About You</Label>
            <Input
              name="bio"
              value={input.bio}
              onChange={changeEventHandler}
              className="bg-white border border-orange-200"
            />
          </div>

          <DialogFooter>
            {loading ? (
              <Button className="w-full my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full my-4">
                Save Changes
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfile;
