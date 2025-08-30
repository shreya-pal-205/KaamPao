import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import { FaUpload, FaVolumeUp, FaFileAlt, FaExclamationTriangle, FaSearch } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import store from '@/redux/store';
import { useNavigate } from 'react-router-dom';

const ContractReader = () => {
  const {user} = useSelector(store => store.auth);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [explanation, setExplanation] = useState('');
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);


  const navigate = useNavigate();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setExplanation('');
  };

  const handleUpload = async () => {
    if (!image) return alert('Please upload a contract image first.');

    const formData = new FormData();
    formData.append('file', image);

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:8000/api/gemini-contract', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setExplanation(res.data.explanation);
      if (voiceEnabled) speakText(res.data.explanation);
    } catch (err) {
      console.error('Error processing contract:', err);
      setExplanation('❌ Failed to process contract. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const speakText = (text) => {
    if (!text || !voiceEnabled) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    const voices = window.speechSynthesis.getVoices();
    utterance.voice = voices.find((v) => v.name.toLowerCase().includes('google')) || voices[0];
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  };

  useEffect(()=>{
            if(!user){
                navigate("/signup");
            }
        },[])

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-orange-100 to-yellow-100">

        {/* Sidebar */}
        <aside className="w-64 hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] bg-orange-700 text-white p-6 shadow-xl z-10">
          <h2 className="text-xl font-bold mb-6 tracking-wide">📘 How to Use</h2>
          <ul className="space-y-5 text-base leading-relaxed">
            <li><FaUpload className="inline mr-2 text-yellow-300" /> Upload job contract image</li>
            <li><FaSearch className="inline mr-2 text-yellow-300" /> Tap “Analyze Contract”</li>
            <li><FaFileAlt className="inline mr-2 text-yellow-300" /> AI reads and explains it</li>
            <li><FaExclamationTriangle className="inline mr-2 text-yellow-300" /> Flags warning signs</li>
            <li><FaVolumeUp className="inline mr-2 text-yellow-300" /> Listen to explanation</li>
          </ul>
        </aside>

        {/* Main content */}
        <main className="flex-1 ml-0 md:ml-64 p-6 md:p-12">
          <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-xl p-8 border border-orange-200">
            <h2 className="text-4xl font-extrabold text-orange-700 text-center mb-6">
              🧾 Contract Reader & Explainer
            </h2>

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
                <img src={preview} alt="Preview" className="max-h-64 rounded-lg shadow-md" />
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
              <label htmlFor="voiceToggle" className="text-lg text-orange-700 font-medium">
                🔊 Enable Voice Output
              </label>
            </div>

            {/* Upload button */}
            <button
              onClick={handleUpload}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500 text-white rounded-xl font-semibold text-lg transition"
              disabled={loading}
            >
              {loading ? '⏳ Processing...' : '🔍 Analyze Contract'}
            </button>

            {/* Explanation */}
            {explanation && (
              <div className="mt-6 bg-white border border-yellow-400 rounded-xl p-5 shadow-sm">
                <h3 className="text-xl font-semibold text-yellow-800 mb-2">📝 Explanation</h3>
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
