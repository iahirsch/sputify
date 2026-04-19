require("dotenv").config();

const { GoogleGenAI } = require("@google/genai");

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

const genAI = new GoogleGenAI({ apiKey });

module.exports = { genAI, apiKey }; // Export genAI