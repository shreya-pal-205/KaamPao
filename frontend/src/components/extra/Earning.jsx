import React, { useState, useEffect } from "react";
import Navbar from "../shared/Navbar";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const jobRates = {
  Painter: 80,
  Plumber: 100,
  Carpenter: 90,
  Electrician: 110,
  Helper: 60,
};

const Earning = () => {
  const {user} = useSelector(store => store.auth);
  const [jobType, setJobType] = useState("Painter");
  const [hoursPerDay, setHoursPerDay] = useState(8);
  const [daysPerMonth, setDaysPerMonth] = useState(26);
  const [rate, setRate] = useState(jobRates["Painter"]);
  const [estimatedEarnings, setEstimatedEarnings] = useState(0);
  const [voiceEnabled, setVoiceEnabled] = useState(true);


  const navigate = useNavigate();

  useEffect(() => {
    const earning = rate * hoursPerDay * daysPerMonth;
    setEstimatedEarnings(earning);
    if (voiceEnabled) {
      speakText(`Aapka estimated earning hoga ₹${earning}`);
    }
  }, [jobType, rate, hoursPerDay, daysPerMonth]);

  const speakText = (text) => {
    if (!text || !voiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => v.lang === "hi-IN");
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };



  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, []);



  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-tr from-yellow-100 via-orange-200 to-yellow-200 flex justify-center items-center p-6">
        <div className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl p-10 relative">
          <h1 className="text-4xl font-extrabold text-orange-700 text-center mb-8">
            💰 Earning Estimator
          </h1>

          <div className="mb-6 px-4 py-3 bg-orange-200 border-l-4 border-orange-500 rounded-xl shadow-sm text-sm text-orange-800 font-medium">
            💡 Tip: Select your job and working hours to get an estimated
            monthly earning!
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block font-semibold text-orange-800 mb-1">
                👷 Job Type
              </label>
              <select
                value={jobType}
                onChange={(e) => {
                  const selected = e.target.value;
                  setJobType(selected);
                  setRate(jobRates[selected]);
                }}
                className="w-full p-3 rounded-xl border border-orange-300 shadow-inner text-lg"
              >
                {Object.keys(jobRates).map((job) => (
                  <option key={job} value={job}>
                    {job}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-orange-800 mb-1">
                💵 Hourly Rate (₹)
              </label>
              <input
                type="number"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-orange-300 shadow-inner text-lg"
                min={1}
              />
            </div>

            <div>
              <label className="block font-semibold text-orange-800 mb-1">
                ⏰ Hours Per Day
              </label>
              <input
                type="number"
                value={hoursPerDay}
                onChange={(e) => setHoursPerDay(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-orange-300 shadow-inner text-lg"
                min={1}
                max={24}
              />
            </div>

            <div>
              <label className="block font-semibold text-orange-800 mb-1">
                📆 Days Per Month
              </label>
              <input
                type="number"
                value={daysPerMonth}
                onChange={(e) => setDaysPerMonth(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-orange-300 shadow-inner text-lg"
                min={1}
                max={31}
              />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={() => setVoiceEnabled(!voiceEnabled)}
              className="w-5 h-5 accent-orange-500"
              id="voiceToggle"
            />
            <label
              htmlFor="voiceToggle"
              className="text-lg text-orange-800 font-medium"
            >
              🔊 Enable Voice Output
            </label>
          </div>

          <div className="mt-8 bg-yellow-50 border-l-4 border-yellow-400 rounded-xl p-6 shadow-md">
            <h3 className="text-2xl font-semibold text-yellow-800 mb-2">
              📊 Estimated Monthly Income
            </h3>
            <p className="text-4xl font-bold text-green-700">
              ₹ {estimatedEarnings.toLocaleString()}
            </p>
            <p className="mt-2 text-gray-700">
              Based on your selected job type, working hours, and days.
            </p>
          </div>

          <p className="mt-10 text-center text-sm text-gray-500">
            ⚠️ Note: This is just an estimate. Actual income may vary based on
            your location, experience, and employer.
          </p>
        </div>
      </div>
    </>
  );
};

export default Earning;
