import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '../shared/Navbar';
import { FaLightbulb, FaSmile, FaMicrophone, FaLanguage, FaVolumeUp, FaSave } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Motivation = () => {
  const {user} = useSelector(store => store.auth);
  const [promptInput, setPromptInput] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [language, setLanguage] = useState('hi-IN');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [availableVoices, setAvailableVoices] = useState([]);
  const recognitionRef = useRef(null);


  const navigate = useNavigate();

  const languages = {
    Hindi: 'hi-IN',
    English: 'en-US',
    Bengali: 'bn-IN',
  };

  const getLanguageLabel = (code) => {
    switch (code) {
      case 'hi-IN':
        return 'Hindi';
      case 'en-US':
        return 'English';
      case 'bn-IN':
        return 'Bengali';
      default:
        return 'English';
    }
  };

  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        setAvailableVoices(voices);
      } else {
        setTimeout(() => {
          setAvailableVoices(window.speechSynthesis.getVoices());
        }, 500);
      }
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Your browser does not support speech recognition.');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      const speech = event.results[0][0].transcript;
      setPromptInput(speech);
      sendPromptToGemini(speech);
    };
    recognition.onerror = (err) => {
      console.error('Speech error:', err);
      setIsListening(false);
    };
    recognition.onend = () => setIsListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  };

  const sendPromptToGemini = async (inputText) => {
    const langLabel = getLanguageLabel(language);

    const prompt = `
A poor job seeker said: "${inputText}"

Respond only in **${langLabel}** language.

Include:
1. Friendly confidence tips.
2. A couple of mock interview questions with sample answers.
3. Encourage them in a motivational tone.

Avoid Hinglish or mixing languages. Use pure "${langLabel}".
Keep the tone supportive, professional and uplifting.
    `;

    try {
      const res = await axios.post('http://localhost:8000/api/gemini-suggest', { prompt });
      const text = res.data.suggestions;
      setSuggestions(text);
      if (voiceEnabled) speakOut(text);
    } catch (err) {
      console.error('Gemini fetch error:', err);
      setSuggestions('❌ Motivation fetch failed. Please try again.');
    }
  };

  const speakOut = (text) => {
    if (!text) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    let voice = availableVoices.find(
      (v) => v.lang === language && v.name.toLowerCase().includes('google')
    );

    if (!voice) {
      voice = availableVoices.find((v) => v.lang === language);
    }

    if (!voice) {
      alert('⚠️ No voice found for selected language. Defaulting to English.');
      voice = availableVoices.find((v) => v.lang === 'en-US');
      utterance.lang = 'en-US';
    } else {
      utterance.lang = language;
    }

    utterance.voice = voice;
    synth.cancel();
    synth.speak(utterance);
  };

  const saveToNotes = () => {
    const blob = new Blob([suggestions], { type: 'text/plain' });
    const link = document.createElement('a');
    link.download = 'motivation.txt';
    link.href = URL.createObjectURL(blob);
    link.click();
  };


  useEffect(() => {
      if (!user) {
        navigate("/signup");
      }
    }, []);

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200">
        
        {/* Sidebar Tips */}
        <aside className="w-64 hidden md:flex flex-col fixed top-16 left-0 h-[calc(100vh-4rem)] bg-orange-700 text-white p-6 shadow-xl z-10">
          <h2 className="text-xl font-bold mb-5">💡 Usage Tips</h2>
          <ul className="space-y-5 text-base">
            <li><FaMicrophone className="inline mr-2 text-yellow-300" /> Speak your fear</li>
            <li><FaLightbulb className="inline mr-2 text-yellow-300" /> Get confidence tips</li>
            <li><FaSmile className="inline mr-2 text-yellow-300" /> Practice answers</li>
            <li><FaVolumeUp className="inline mr-2 text-yellow-300" /> Hear motivation</li>
            <li><FaSave className="inline mr-2 text-yellow-300" /> Save as note</li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="flex-1 ml-0 md:ml-64 p-6 md:p-12">
          <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-lg shadow-xl rounded-3xl p-8">
            <h2 className="text-4xl font-extrabold text-orange-700 text-center mb-4">
              💬 AI Motivation Coach
            </h2>
            <p className="text-center text-gray-600 mb-8">
              🎯 <span className="font-medium">We believe in your potential.</span> You just need a little push.
            </p>

            {/* Language Selector */}
            <div className="mb-4">
              <label className="block text-lg font-semibold text-orange-800 mb-2">
                🌐 Select Language
              </label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-xl border border-orange-300 shadow-inner text-lg"
              >
                {Object.entries(languages).map(([name, code]) => (
                  <option key={code} value={code}>{name}</option>
                ))}
              </select>
            </div>

            {/* Voice Toggle */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="checkbox"
                checked={voiceEnabled}
                onChange={() => setVoiceEnabled(!voiceEnabled)}
                className="w-5 h-5 accent-orange-500"
                id="voiceToggle"
              />
              <label htmlFor="voiceToggle" className="text-lg text-orange-800 font-medium">
                🔊 Enable Voice Output
              </label>
            </div>

            {/* Start Listening */}
            <button
              onClick={startListening}
              className={`w-full py-3 rounded-xl font-bold text-lg mb-6 transition ${
                isListening
                  ? 'bg-red-500 hover:bg-red-600'
                  : 'bg-gradient-to-r from-orange-500 to-yellow-400 hover:from-orange-600 hover:to-yellow-500'
              } text-white`}
            >
              {isListening ? '🎧 Listening...' : '🎤 Speak Your Interview Fear'}
            </button>

            {/* Transcript Display */}
            {promptInput && (
              <div className="mb-4 p-4 bg-orange-50 border-l-4 border-orange-400 rounded-lg shadow-sm">
                <p className="text-sm font-medium text-orange-700 mb-1">🗣️ You said:</p>
                <p className="italic text-gray-800">{promptInput}</p>
              </div>
            )}

            {/* Suggestions Output */}
            {suggestions && (
              <div className="p-5 bg-white border border-yellow-400 rounded-xl shadow-sm mt-4">
                <h3 className="text-xl font-semibold text-yellow-800 mb-3">✨ Gemini Suggestions</h3>
                <p className="whitespace-pre-line text-gray-900 leading-relaxed text-[1.05rem]">
                  {suggestions}
                </p>

                <div className="flex gap-4 mt-6">
                  {voiceEnabled && (
                    <button
                      onClick={() => speakOut(suggestions)}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold transition"
                    >
                      🔊 Replay
                    </button>
                  )}
                  <button
                    onClick={saveToNotes}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-semibold transition"
                  >
                    💾 Save as Note
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  );
};

export default Motivation;
