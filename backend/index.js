import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from "dotenv";
import mongoDB from "./utils/mongo.js";
import userRoute from "./routes/user.js";
import companyRoute from "./routes/company.js";
import jobRoute from "./routes/job.js";
import applicationRoute from "./routes/application.js";
import axios from 'axios';
import multer from 'multer';
import Tesseract from 'tesseract.js';
dotenv.config({});




const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // your React app's origin
  credentials: true                // allow cookies, authorization headers, etc.
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));





// Sample route
app.get('/', (req, res) => {
  res.send('welcome everybody!');
});



//api's...
app.use("/api/v1/user", userRoute);
app.use("/api/v1/company", companyRoute);
app.use("/api/v1/job", jobRoute);
app.use("/api/v1/application", applicationRoute);





app.post('/api/gemini-suggest', async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    const response = result.data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No suggestions found.';
    res.json({ suggestions: response });
  } catch (error) {
    console.error('Gemini API error:', error.message);
    res.status(500).json({ error: 'Gemini API request failed.' });
  }
});









const upload = multer({ storage: multer.memoryStorage() });

app.post('/api/gemini-contract', upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  try {
    const imageBuffer = req.file.buffer;

    const {
      data: { text: extractedText }
    } = await Tesseract.recognize(imageBuffer, 'eng');

    const prompt = `
Read the following job contract text and:

1. Summarize it in simple language.
2. Highlight any suspicious clauses (like unpaid trial, salary penalties, vague terms, etc.).
3. Give advice if the worker should sign or ask questions.

Contract Text:
"""
${extractedText}
"""
Use a supportive and protective tone for a vulnerable job seeker.
    `;

    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );

    const responseText =
      geminiRes.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      'Could not understand the contract. Please try again.';

    res.json({ explanation: responseText });

  } catch (error) {
    console.error('Contract reading failed:', error.message);
    res.status(500).json({ error: 'Failed to analyze contract.' });
  }
});








const PORT = process.env.PORT;
app.listen(PORT, () => {
  mongoDB();
  console.log(`Server started on port no:${PORT}`);
});

