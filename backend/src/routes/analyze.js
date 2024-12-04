var express = require("express");
var router = express.Router();
var { genAI } = require("../modules/googleClient");

router.use(express.json());

router.post("/", async function (req, res, next) {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        let analysisResults = {};

        const { track } = req.body;
        if (!track) {
            return res.status(400).json({ error: "Invalid or missing track" });
        }
        const prompt = `Generate a JSON object containing detailed information about a song. Include the following keys:
song_name: ${track.name}.
artist:  ${track.artist}.
tempo: The tempo of the song in beats per minute (BPM)
energy: A value between 0 and 1 indicating the song's energy level.
valence: A value between 0 and 1 representing the emotional positivity of the song.
danceability: A value between 0 and 1 representing how suitable the song is for dancing.
duration_ms: Duration of the song in milliseconds.
acousticness: A value between 0 and 1 indicating how acoustic the song is.
instrumentalness: A value between 0 and 1 representing the likelihood the track is instrumental.
segments: An array where each object represents a segment of the song. Each segment should include:start: The starting time of the segment in seconds.
duration: The duration of the segment in seconds.
confidence: A value between 0 and 1 indicating the confidence level in this segments distinctiveness.
frequency_spectrum: An array of 10 numerical values between 0 and 1 representing the normalized amplitude of 10 frequency bands in the segment (from bass to treble).
color: give me an rgb color that represents the mood of the song.

Make sure the values are correct and the data is complete. Ensure the JSON is formatted correctly and provide realistic sample values.`;

        console.log(prompt);

        result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: {
                response_mime_type: "application/json",
                temperature: 0.8,
                maxOutputTokens: 1500,
            },
        });
        analysisResults = JSON.parse(result.response.text());
        console.log(analysisResults);
        res.json({ analysisResults });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;