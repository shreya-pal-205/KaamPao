import React, { useEffect, useState } from "react";
import Navbar from "../shared/Navbar";
import JobCard from "./JobCard";
import FilterCard from "./FilterCard";
import { useSelector } from "react-redux";
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

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);
  const { user } = useSelector((store) => store.auth);

  const [language, setLanguage] = useState("en");
  const [translatedJobs, setTranslatedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const navigate = useNavigate();

  // 🧭 Filter by searchedQuery
  useEffect(() => {
    if (searchedQuery) {
      const filtered = allJobs.filter((job) =>
        [job.title, job.description, job.location]
          .some((field) =>
            field.toLowerCase().includes(searchedQuery.toLowerCase())
          )
      );
      setFilterJobs(filtered);
    } else {
      setFilterJobs(allJobs);
    }
  }, [allJobs, searchedQuery]);

  // 🧭 Filter by location
  useEffect(() => {
    if (locationSearch.trim() === "") {
      setFilterJobs(allJobs);
      return;
    }

    const filtered = allJobs.filter((job) =>
      job.location.toLowerCase().includes(locationSearch.toLowerCase())
    );
    setFilterJobs(filtered);
  }, [locationSearch, allJobs]);

  // 🧭 Redirect to signup if not logged in
  useEffect(() => {
    if (!user) navigate("/signup");
  }, [user, navigate]);

  // 🌐 Translate jobs when language changes
  useEffect(() => {
    if (language === "en") {
      setTranslatedJobs(filterJobs);
      return;
    }

    const doTranslate = async () => {
      setLoading(true);
      const translated = await Promise.all(
        filterJobs.map(async (job) => {
          const title = await translateText(job.title, language);
          const description = await translateText(job.description, language);
          const location = await translateText(job.location, language);
          const requirements = await translateText(job.requirements, language);
          const salary = await translateText(job.salary, language);
          return { ...job, title, description, location, requirements, salary };
        })
      );
      setTranslatedJobs(translated);
      setLoading(false);
    };

    doTranslate();
  }, [language, filterJobs]);

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-orange-50 via-orange-100 to-orange-200 min-h-screen py-4 px-3 sm:px-6 md:px-10 lg:px-20">

        {/* 🌍 Sleek Top Bar */}
        <div className="bg-white w-full rounded-xl shadow-md px-4 py-3 flex flex-col lg:flex-row items-center justify-between gap-4 mb-6 transition-all duration-300">
          
          {/* 🔍 Location Search */}
          <input
            type="text"
            placeholder="🔍 Search jobs by location (e.g., Kolkata)"
            value={locationSearch}
            onChange={(e) => setLocationSearch(e.target.value)}
            className="w-full lg:w-1/3 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all"
          />

          {/* 🧩 FilterCard */}
          <div className="w-full lg:w-1/2">
            <FilterCard compact />
          </div>

          {/* 🌐 Language Selector */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            <option value="en">English</option>
            <option value="hi">Hindi</option>
            <option value="bn">Bengali</option>
            <option value="ta">Tamil</option>
            <option value="mr">Marathi</option>
          </select>
        </div>

        {/* 💼 Job Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {loading ? (
            <div className="col-span-full text-center text-gray-500 animate-pulse">
              Translating jobs...
            </div>
          ) : translatedJobs.length <= 0 ? (
            <div className="col-span-full text-center text-gray-500 text-lg">
              ❌ No job found in your location
            </div>
          ) : (
            translatedJobs.map((job) => <JobCard key={job._id} job={job} />)
          )}
        </div>
      </div>
    </>
  );
};

export default Jobs;
