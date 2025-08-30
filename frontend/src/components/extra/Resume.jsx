// Resume.jsx
import React, { useState, useEffect } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import jsPDF from "jspdf";
import Navbar from "../shared/Navbar";

const Resume = () => {
  const languages = [
    { code: "en-IN", name: "English" },
    { code: "hi-IN", name: "Hindi" },
    { code: "bn-IN", name: "Bengali" },
    { code: "ta-IN", name: "Tamil" },
    { code: "mr-IN", name: "Marathi" },
  ];

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    skills: "",
    experience: "",
  });

  const [selectedLang, setSelectedLang] = useState("en-IN");
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  useEffect(() => {
    const saved = localStorage.getItem("resumeData");
    if (saved) {
      setFormData(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("resumeData", JSON.stringify(formData));
  }, [formData]);

  const handleVoiceInput = (field) => {
    resetTranscript();
    SpeechRecognition.startListening({ continuous: true, language: selectedLang });
    setTimeout(() => {
      SpeechRecognition.stopListening();
      setFormData((prev) => ({ ...prev, [field]: transcript }));
    }, 5000);
  };

  const handleDownload = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text(formData.name || "Name", 10, 20);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Email: ${formData.email || ""}`, 10, 30);
    doc.text(`Phone: ${formData.phone || ""}`, 10, 40);

    

    doc.text("Skills:", 10, 75);
    doc.text(formData.skills || "", 10, 82);

    doc.text("Experience:", 10, 95);
    doc.text(formData.experience || "", 10, 102);

    doc.save(`${formData.name || "resume"}.pdf`);
  };

  if (!SpeechRecognition.browserSupportsSpeechRecognition()) {
    return <p className="text-center text-red-500">Your browser does not support speech recognition.</p>;
  }

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 to-orange-200 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-3xl font-bold text-orange-500 text-center mb-6">Resume Builder</h2>

        <label className="block font-semibold text-orange-600 mb-1">Language:</label>
        <select
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="w-full p-2 rounded-lg border border-orange-300 mb-4 focus:outline-none focus:ring-2 focus:ring-orange-400"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>

        {["name", "email", "phone", "skills", "experience"].map((field) => (
          <div key={field} className="mb-4">
            <label className="block font-semibold text-orange-600 mb-1">
              {field.charAt(0).toUpperCase() + field.slice(1)}:
            </label>
            <textarea
              value={formData[field]}
              onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
              rows={["education", "skills", "experience"].includes(field) ? 3 : 1}
              className="w-full p-2 rounded-lg border border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-orange-50"
            />
            <button
              onClick={() => handleVoiceInput(field)}
              className={`mt-2 px-4 py-2 rounded-lg text-white transition-colors ${
                listening ? "bg-orange-300" : "bg-orange-500 hover:bg-orange-600"
              }`}
            >
              🎤 {listening ? "Listening..." : "Speak"}
            </button>
          </div>
        ))}

        <button
          onClick={handleDownload}
          className="w-full mt-4 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition-colors"
        >
          📄 Download PDF
        </button>
      </div>
    </div>
    </>
  );
};

export default Resume;
