import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Navbar from "../shared/Navbar";
import {
  FaUpload,
  FaVolumeUp,
  FaVolumeMute,
  FaFileAlt,
  FaExclamationTriangle,
  FaSearch,
  FaLanguage,
} from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const ContractReader = () => {
  const { user } = useSelector((store) => store.auth);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [explanation, setExplanation] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [language, setLanguage] = useState("en-US"); // default English
  const recognitionRef = useRef(null);

  const navigate = useNavigate();

  // Available languages
  const languages = {
    English: "en-US",
    Hindi: "hi-IN",
    Bengali: "bn-IN",
    Marathi: "mr-IN",
    Tamil: "ta-IN",
  };

  const getLanguageName = (code) =>
    Object.keys(languages).find((key) => languages[key] === code);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setExplanation("");
  };

  const handleUpload = async () => {
    if (!image) return alert("Please upload a contract image first.");

    const formData = new FormData();
    formData.append("file", image);
    formData.append(
      "prompt",
      `Explain this job contract in simple ${getLanguageName(
        language
      )}. Highlight any warning signs or unfair terms.`
    );

    try {
      setLoading(true);
      const res = await axios.post(
        "http://localhost:8000/api/gemini-contract",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const text = res.data.explanation;
      setExplanation(text);

      if (voiceEnabled) speakText(text);
    } catch (err) {
      console.error("Error processing contract:", err);
      setExplanation("❌ Failed to process contract. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!text || !voiceEnabled) return;
    const synth = window.speechSynthesis;
    synth.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    const voice = synth
      .getVoices()
      .find((v) => v.lang === language) || synth.getVoices()[0];
    utterance.voice = voice;
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
  };

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">
        {/* Sidebar */}
        <aside className="w-64 hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] bg-orange-700 text-white p-6 shadow-xl z-10">
          <h2 className="text-xl font-bold mb-6 tracking-wide">📘 How to Use</h2>
          <ul className="space-y-5 text-base leading-relaxed">
            <li>
              <FaLanguage className="inline mr-2 text-yellow-300" /> Select your
              preferred language
            </li>
            <li>
              <FaUpload className="inline mr-2 text-yellow-300" /> Upload job
              contract image
            </li>
            <li>
              <FaSearch className="inline mr-2 text-yellow-300" /> Tap “Analyze
              Contract”
            </li>
            <li>
              <FaFileAlt className="inline mr-2 text-yellow-300" /> AI explains
              it clearly
            </li>
            <li>
              <FaExclamationTriangle className="inline mr-2 text-yellow-300" /> Flags warning signs
            </li>
            <li>
              <FaVolumeUp className="inline mr-2 text-yellow-300" /> Listen to the explanation
            </li>
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-0 md:ml-64 p-6 md:p-12">
          <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-orange-200">
            <h2 className="text-4xl font-extrabold text-orange-700 text-center mb-6">
              🧾 Contract Reader & Explainer
            </h2>

            {/* Language Selector */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-orange-800 mb-2">
                🌐 Choose Explanation Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-xl border border-orange-300 shadow-inner"
              >
                {Object.entries(languages).map(([name, code]) => (
                  <option key={code} value={code}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Upload input */}
            <div className="mb-4">
              <label className="block text-lg text-orange-800 font-medium mb-2">
                📸 Upload or Take Photo of Contract
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full p-3 border border-orange-300 rounded-xl shadow-inner"
              />
            </div>

            {/* Image Preview */}
            {preview && (
              <div className="mb-4">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-h-64 rounded-lg shadow-md"
                />
              </div>
            )}

            {/* Voice toggle */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={() => setVoiceEnabled(!voiceEnabled)}
                className="w-5 h-5 accent-orange-600"
                id="voiceToggle"
              />
              <label
                htmlFor="voiceToggle"
                className="text-lg text-orange-700 font-medium"
              >
                🔊 Enable Voice Output
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 mb-4">
              <button
                onClick={handleUpload}
                className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white rounded-xl font-semibold text-lg transition"
                disabled={loading}
              >
                {loading ? "⏳ Processing..." : "🔍 Analyze Contract"}
              </button>

              <button
                onClick={stopSpeaking}
                className="flex items-center justify-center gap-2 py-3 px-5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-lg transition"
              >
                <FaVolumeMute /> Stop Audio
              </button>
            </div>

            {/* Explanation */}
            {explanation && (
              <div className="mt-6 bg-white border border-yellow-400 rounded-xl p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">
                  📝 Explanation
                </h3>
                <p className="whitespace-pre-line text-gray-900 leading-relaxed text-[1.05rem]">
                  {explanation}
                </p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default ContractReader;
