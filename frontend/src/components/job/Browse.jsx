import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import JobCard from "./JobCard";
import { useDispatch, useSelector } from "react-redux";
import { setSearchedQuery } from "@/redux/jobSlice";
import useGetAllJobs from "@/hooks/useGetAllJobs";
import { useNavigate } from "react-router-dom";

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

const Browse = () => {
  useGetAllJobs();

  const { user } = useSelector((store) => store.auth);
  const { allJobs } = useSelector((store) => store.job);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [language, setLanguage] = useState("en"); // default English
  const [translatedJobs, setTranslatedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [translatedHeading, setTranslatedHeading] = useState("Search Results");

  useEffect(() => {
    return () => {
      dispatch(setSearchedQuery(""));
    };
  }, []);

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, []);

  // 🔄 Translate all job fields + heading when language changes
  useEffect(() => {
    if (language === "en") {
      setTranslatedJobs(allJobs);
      setTranslatedHeading("Search Results");
      return;
    }

    const doTranslate = async () => {
      setLoading(true);

      // translate heading
      const heading = await translateText("Search Results", language);

      // translate job details
      const translated = await Promise.all(
        allJobs.map(async (job) => {
          const title = await translateText(job.title, language);
          const description = await translateText(job.description, language);
          const location = await translateText(job.location, language);
          const requirements = job.requirements
            ? await translateText(job.requirements, language)
            : "";
          const salary = job.salary
            ? await translateText(job.salary.toString(), language)
            : "";

          return { ...job, title, description, location, requirements, salary };
        })
      );

      setTranslatedJobs(translated);
      setTranslatedHeading(heading);
      setLoading(false);
    };

    doTranslate();
  }, [language, allJobs]);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 min-h-screen py-14 px-4 md:px-16 lg:px-28">
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

        <h1>
          {translatedHeading}...({allJobs.length})
        </h1>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gray-500">
              Translating jobs...
            </div>
          ) : translatedJobs.length <= 0 ? (
            <div className="text-center col-span-full text-gray-500 text-lg">
              No Job Available
            </div>
          ) : (
            translatedJobs.map((job) => (
              <JobCard key={job._id} job={job} />
            ))
          )}
        </div>
      </div>
    </>
  );
};

export default Browse;
