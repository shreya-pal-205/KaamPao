import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import { FaMicrophone, FaKeyboard, FaLanguage, FaRegLightbulb, FaRobot, FaStopCircle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const JobSuggestion = () => {
  const { user } = useSelector(store => store.auth);
  const [transcript, setTranscript] = useState('');
  const [inputText, setInputText] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [language, setLanguage] = useState('hi-IN');
  const recognitionRef = useRef(null);
  const utteranceRef = useRef(null);

  const navigate = useNavigate();

  const languages = {
    Hindi: 'hi-IN',
    English: 'en-US',
    Bengali: 'bn-IN',
  };

  const getLanguageName = (code) => {
    return Object.keys(languages).find((key) => languages[key] === code);
  };

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synth.cancel(); // stop previous speech
    utteranceRef.current = utterance;
    synth.speak(utterance);
  };

  const stopSpeaking = () => {
    const synth = window.speechSynthesis;
    synth.cancel();
    setIsSpeaking(false);
  };

  const fetchJobSuggestions = async (query) => {
    const prompt = `Act like a job assistant for daily wage laborers. The user said: "${query}". Based on this, suggest job categories or types and nearby location suggestions in simple ${getLanguageName(language)}. Keep your answer short and friendly.`;

    try {
      const res = await axios.post('http://localhost:8000/api/gemini-suggest', { prompt });
      const text = res.data.suggestions;
      setSuggestions(text);
      speakText(text);
    } catch (err) {
      setSuggestions('❌ Sorry, could not fetch job suggestions.');
      console.error(err);
    }
  };

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Browser does not support voice input');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const spoken = event.results[0][0].transcript;
      setTranscript(spoken);
      fetchJobSuggestions(spoken);
    };
    recognition.onerror = (e) => {
      console.error('Speech error:', e);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const handleTextSubmit = () => {
    if (inputText.trim()) {
      setTranscript(inputText);
      fetchJobSuggestions(inputText);
    }
  };

  useEffect(() => {
    if (!user) {
      navigate("/signup");
    }
  }, []);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen font-sans bg-gradient-to-br from-orange-100 via-orange-200 to-yellow-100">

        {/* Sidebar fixed left */}
        <aside className="w-64 hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] bg-orange-700 text-white p-6 shadow-xl z-10">
          <h2 className="text-xl font-bold mb-6 tracking-wide">📘 How to Use</h2>
          <ul className="space-y-5 text-base leading-relaxed">
            <li><FaLanguage className="inline mr-2 text-yellow-300" /> Select your language.</li>
            <li><FaKeyboard className="inline mr-2 text-yellow-300" /> Type your job skill or interest.</li>
            <li><FaMicrophone className="inline mr-2 text-yellow-300" /> Tap mic to speak your input.</li>
            <li><FaRobot className="inline mr-2 text-yellow-300" /> Let AI suggest jobs for you.</li>
            <li><FaRegLightbulb className="inline mr-2 text-yellow-300" /> Use clear voice and enable mic permission.</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-0 md:ml-64 p-6 md:p-12">
          <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-md rounded-3xl shadow-lg p-8 border border-orange-200">
            <h1 className="text-4xl font-extrabold text-orange-700 text-center mb-6">🎤 Job Finder Assistant</h1>

            {/* Language Selector */}
            <div className="mb-6">
              <label className="block text-lg font-semibold text-orange-800 mb-2">🌐 Choose Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-xl border border-orange-300 shadow-inner"
              >
                {Object.entries(languages).map(([name, code]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>

            {/* Text Input */}
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Type your job skills or experience..."
                className="flex-1 p-3 border border-orange-300 rounded-xl focus:outline-none"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <button
                onClick={handleTextSubmit}
                className="bg-orange-500 text-white px-5 py-2 rounded-xl hover:bg-orange-600 transition"
              >
                Suggest
              </button>
            </div>

            {/* Voice Input Button */}
            <button
              onClick={startListening}
              className={`w-full mt-4 py-3 font-bold text-lg rounded-xl shadow-md ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-white'
              }`}
            >
              {isListening ? '🎧 Listening...' : '🎤 Tap to Speak'}
            </button>

            {/* Stop Voice Button */}
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="w-full mt-3 py-3 font-bold text-lg rounded-xl shadow-md bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
              >
                <FaStopCircle /> Stop Voice
              </button>
            )}

            {/* Transcript Display */}
            {transcript && (
              <div className="mt-6 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-lg shadow-sm">
                <p className="text-orange-700 font-medium">🗣️ You said:</p>
                <p className="italic">{transcript}</p>
              </div>
            )}

            {/* Suggestions */}
            {suggestions && (
              <div className="mt-6 p-5 bg-yellow-50 border-l-4 border-yellow-400 rounded-lg shadow-sm">
                <p className="text-yellow-700 font-semibold mb-2">🤖 Job Suggestions:</p>
                <p className="text-gray-900 whitespace-pre-line">{suggestions}</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default JobSuggestion;
