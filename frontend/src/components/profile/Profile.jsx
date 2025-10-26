import React, { useState } from "react";
import { Mail, Phone, BadgeCheck } from "lucide-react";
import { Button } from "../ui/button";
import Navbar from "../shared/Navbar";
import AppliedJobTable from "./AppliedJobTable";
import UpdateProfile from "./UpdateProfile";
import { useSelector } from "react-redux";
import { Label } from "@radix-ui/react-label";
import useGetAppliedJobs from "@/hooks/useGetAppliedJobs";

const Profile = () => {
  useGetAppliedJobs();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 min-h-screen py-14 px-4 md:px-16 lg:px-28">
        <div className="relative bg-white/70 backdrop-blur-lg border border-orange-200 shadow-xl rounded-3xl p-10 max-w-4xl w-full space-y-8">
          {/* Edit Button */}
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => setOpen(true)}
              variant="outline"
              className="border-orange-300 text-orange-700 hover:bg-orange-100 font-medium rounded-full px-4 py-1 flex items-center gap-2 text-sm"
            >
              ✏️ Edit Profile
            </Button>
          </div>

          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl font-bold text-orange-700 tracking-tight">
              {user?.fullname}
            </h1>
            <p className="text-gray-600 mt-2 text-md max-w-2xl mx-auto">
              {user?.profile?.bio}
            </p>
          </div>

          {/* Contact Info */}
          <div className="grid sm:grid-cols-2 gap-6 text-sm text-gray-700">
            <div className="flex items-center gap-3 bg-orange-100 rounded-xl p-3">
              <Mail className="text-orange-600 w-5 h-5" />
              <span>{user?.email}</span>
            </div>
            <div className="flex items-center gap-3 bg-orange-100 rounded-xl p-3">
              <Phone className="text-orange-600 w-5 h-5" />
              <span>{user?.phone}</span>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xl font-semibold text-orange-700 mb-3">
              Skills
            </h2>
            <div className="flex flex-wrap gap-3">
              {user?.profile?.skills?.length ? (
                user?.profile?.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="bg-orange-50 text-orange-700 border border-orange-300 px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1"
                  >
                    <BadgeCheck className="w-4 h-4" /> {skill}
                  </span>
                ))
              ) : (
                <span>NA</span>
              )}
            </div>
          </div>

          {/* Auto-Generated Resume Summary */}
          <div className="w-full mt-6">
            <Label className="text-md font-bold text-orange-700">
              Auto-Generated Summary
            </Label>
            <div className="bg-orange-50 border border-orange-200 text-gray-800 rounded-xl p-4 mt-2 whitespace-pre-line">
              {user?.profile?.summary ? (
                user.profile.summary
              ) : (
                <span className="text-gray-500 italic">
                  No summary yet — edit your profile to generate it automatically.
                </span>
              )}
            </div>
          </div>

          {/* Applied Jobs */}
          <div className="my-8">
            <h1 className="text-3xl font-extrabold text-orange-800 tracking-wide mb-4">
              Your Applied Jobs :)
            </h1>
            <AppliedJobTable />
          </div>

          <UpdateProfile open={open} setOpen={setOpen} />
        </div>
      </div>
    </>
  );
};

export default Profile;
