import React, { useEffect, useState } from "react";
import {
  Briefcase,
  MapPin,
  FileText,
  Calendar,
  Users,
  DollarSign,
  Clock,
} from "lucide-react";
import { Button } from "../ui/button";
import Navbar from "../shared/Navbar";
import { useParams } from "react-router-dom";
import { setSingleJob } from "@/redux/jobSlice";
import axios from "axios";
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from "@/utils/constant";
import { useDispatch, useSelector } from "react-redux";
import store from "@/redux/store";
import { toast } from "sonner";
import { FaRupeeSign } from "react-icons/fa";

// 🌐 Translation API helper
const translateText = async (text, targetLang) => {
  try {
    const res = await fetch(
      `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(
        text
      )}`
    );
    const data = await res.json();
    return data[0][0][0];
  } catch (err) {
    console.error("Translation Error:", err);
    return text;
  }
};

// 🗺️ Function to redirect to Google Maps
const openInGoogleMaps = (address) => {
  if (!address) {
    toast.error("Location not available");
    return;
  }
  const mapUrl = `https://www.google.com/maps?q=${encodeURIComponent(address)}`;
  window.open(mapUrl, "_blank");
};

const JobDescription = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const jobId = params.id;
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);

  const isIntiallyApplied =
    singleJob?.applications?.some(
      (application) => application.applicant === user?._id
    ) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  // 🌐 Language state
  const [language, setLanguage] = useState("en");
  const [translatedJob, setTranslatedJob] = useState(null);
  const [loading, setLoading] = useState(false);

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(
        `${APPLICATION_API_END_POINT}/apply/${jobId}`,
        { withCredentials: true }
      );

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  // 🔄 Translate job fields when language changes
  useEffect(() => {
    if (!singleJob) return;
    if (language === "en") {
      setTranslatedJob(singleJob);
      return;
    }

    const doTranslate = async () => {
      setLoading(true);
      const title = await translateText(singleJob.title, language);
      const description = await translateText(singleJob.description, language);
      const location = await translateText(singleJob.location, language);
      const requirements = singleJob.requirements
        ? await translateText(singleJob.requirements, language)
        : "";
      const salary = singleJob.salary
        ? await translateText(singleJob.salary.toString(), language)
        : "";

      setTranslatedJob({
        ...singleJob,
        title,
        description,
        location,
        requirements,
        salary,
      });
      setLoading(false);
    };

    doTranslate();
  }, [language, singleJob]);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto mt-10 p-8 rounded-2xl bg-gradient-to-br from-orange-50 to-white shadow-lg border border-orange-100">
        {/* 🌐 Language Selector */}
        <div className="flex justify-end mb-6">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 shadow-sm"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
            <option value="ta">Tamil</option>
            <option value="mr">Marathi</option>
          </select>
        </div>

        {loading || !translatedJob ? (
          <div className="text-center text-gray-500">Translating...</div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-orange-700 flex items-center gap-2">
                📝 Job Description
              </h1>

              <Button
                onClick={isApplied ? null : applyJobHandler}
                disabled={isApplied}
                className={`rounded-lg ${
                  isApplied
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-[#7209b7] hover:bg-[#5f32ad]"
                }`}
              >
                {isApplied ? "Already Applied" : "Apply Now"}
              </Button>
            </div>

            <div className="space-y-6 text-gray-800">
              {/* 🧑 Role */}
              <div className="text-xl font-semibold text-orange-600 flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                Role:{" "}
                <span className="font-normal text-gray-700">
                  {translatedJob?.title}
                </span>
              </div>

              {/* 📍 Location with map redirect */}
              <div
                className="text-xl font-semibold text-orange-600 flex items-center gap-2 cursor-pointer hover:underline"
                onClick={() => openInGoogleMaps(translatedJob?.location)}
                title="View on Google Maps"
              >
                <MapPin className="w-5 h-5 text-red-600" />
                Location:{" "}
                <span className="font-normal text-blue-600 hover:text-blue-800">
                  {translatedJob?.location}
                </span>
              </div>

              {/* 📝 Description */}
              <div className="text-xl font-semibold text-orange-600 flex items-start gap-2">
                <FileText className="w-5 h-5 mt-1" />
                <div>
                  Description:
                  <p className="text-gray-500 leading-relaxed pl-8">
                    {translatedJob?.description}
                  </p>
                </div>
              </div>

              {/* 📊 Other job details */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-6 text-gray-700">
                <div className="flex items-center gap-2">
                  <Clock className="text-orange-500" />
                  <span>Experience: {translatedJob?.requirements}</span>
                </div>

                <div className="flex items-center gap-2">
                  <FaRupeeSign className="text-orange-500" />
                  <span>Salary: {translatedJob?.salary} per month</span>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="text-orange-500" />
                  <span>
                    Total Applicants: {translatedJob?.applications?.length}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="text-orange-500" />
                  <span>
                    Posted on: {singleJob?.createdAt.split("T")[0]}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default JobDescription;
