import { setSearchedQuery } from '@/redux/jobSlice';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();


  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query));
    navigate("/browse");
  }

  return (
    <section className="bg-gradient-to-br from-orange-100 via-orange-300 to-orange-500 py-24 px-6">
      <div className="max-w-6xl mx-auto text-center">
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-orange-900 leading-tight mb-6 tracking-tight">
          Elevate Your <span className="text-orange-700">Career</span><br /> with Smart Job Search
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-orange-800 max-w-2xl mx-auto mb-10">
          Discover your perfect role across thousands of listings — fast, focused, and free.
        </p>

        {/* Search Box */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <input
            type="text"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search job title, company, or keyword..."
            className="px-5 py-3 w-full sm:w-[400px] rounded-lg border border-orange-200 shadow-md bg-white text-gray-800 focus:ring-2 focus:ring-orange-400 focus:outline-none"
          />
          <button onClick={searchJobHandler} className="px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-semibold rounded-lg shadow transition-all">
            🔍 Search
          </button>
        </div>

        {/* Call to Action Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-14 max-w-4xl mx-auto">
          {[
            { title: '1,000+ Jobs Added Weekly', bg: 'bg-orange-200' },
            { title: 'Top Companies Hiring', bg: 'bg-orange-300' },
            { title: 'Easy Apply System', bg: 'bg-orange-400' },
          ].map((item, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl text-orange-900 font-semibold text-center shadow-md ${item.bg}`}
            >
              {item.title}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
