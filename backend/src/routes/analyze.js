var express = require("express");
var router = express.Router();
var { genAI } = require("../modules/googleClient");

router.use(express.json());

const ANALYZE_DEBUG_LOGS = process.env.ANALYZE_DEBUG_LOGS !== "false";
const CONFIGURED_MODEL = (process.env.GEMINI_MODEL || "").trim();
const MODEL_FALLBACKS = [
    CONFIGURED_MODEL,
    "gemini-2.5-flash",
    "gemini-2.5-flash-lite",
].filter(Boolean);

function debugLog(label, payload) {
    if (!ANALYZE_DEBUG_LOGS) {
        return;
    }
    console.log(`[analyze] ${label}:`, payload);
}

async function generateWithModelFallback(prompt) {
    let lastError = null;

    for (const modelName of MODEL_FALLBACKS) {
        try {
            debugLog("trying model", modelName);
            const result = await genAI.models.generateContent({
                model: modelName,
                contents: prompt,
                config: {
                    responseMimeType: "application/json",
                    temperature: 0.8,
                    maxOutputTokens: 1500,
                },
            });
            debugLog("model success", modelName);
            return result;
        } catch (error) {
            lastError = error;
            debugLog("model failed", `${modelName} -> ${error?.message || error}`);
        }
    }

    throw lastError || new Error("No Gemini model succeeded");
}

function defaultAnalysis(track) {
    return {
        song_name: track?.name || "Unknown Song",
        artist: track?.artist || "Unknown Artist",
        tempo: 100,
        energy: 0.5,
        valence: 0.5,
        danceability: 0.5,
        color: "rgb(180, 180, 180)",
    };
}

function clamp01(value, fallback) {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
        return fallback;
    }
    return Math.max(0, Math.min(1, parsed));
}

function clampRgbChannel(value) {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) {
        return 180;
    }
    return Math.max(0, Math.min(255, Math.round(parsed)));
}

function normalizeColor(color, fallbackColor) {
    const raw = (color || "").toString().trim();
    const fallback = fallbackColor || "rgb(180, 180, 180)";

    if (!raw) {
        return fallback;
    }

    const rgbMatch = raw.match(/rgba?\(([^)]+)\)/i);
    if (rgbMatch?.[1]) {
        const channels = rgbMatch[1]
            .split(",")
            .slice(0, 3)
            .map((value) => clampRgbChannel(value));

        if (channels.length === 3) {
            return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
        }
    }

    const hex = raw.replace("#", "").trim();
    if (/^[0-9a-fA-F]{6}$/.test(hex)) {
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgb(${r}, ${g}, ${b})`;
    }

    if (/^[0-9a-fA-F]{3}$/.test(hex)) {
        const r = parseInt(hex[0] + hex[0], 16);
        const g = parseInt(hex[1] + hex[1], 16);
        const b = parseInt(hex[2] + hex[2], 16);
        return `rgb(${r}, ${g}, ${b})`;
    }

    const channelMatch = raw.match(/\d+/g);
    if (channelMatch && channelMatch.length >= 3) {
        const channels = channelMatch.slice(0, 3).map((value) => clampRgbChannel(value));
        return `rgb(${channels[0]}, ${channels[1]}, ${channels[2]})`;
    }

    return fallback;
}

function sanitizeAnalysis(raw, track) {
    const defaults = defaultAnalysis(track);

    return {
        song_name: raw?.song_name || defaults.song_name,
        artist: raw?.artist || defaults.artist,
        tempo: Number(raw?.tempo) > 0 ? Number(raw.tempo) : defaults.tempo,
        energy: clamp01(raw?.energy, defaults.energy),
        valence: clamp01(raw?.valence, defaults.valence),
        danceability: clamp01(raw?.danceability, defaults.danceability),
        color: normalizeColor(raw?.color, defaults.color),
    };
}

router.post("/", async function (req, res, next) {
    console.log("[analyze] request received");
    try {
        let analysisResults = {};

        const { track } = req.body;
        if (!track || !track.name || !track.artist) {
            return res.status(400).json({ error: "Invalid or missing track" });
        }
        const prompt = `Generate a JSON object containing detailed information about a song. Include the following keys:
song_name: ${track.name}.
artist:  ${track.artist}.
tempo: The tempo of the song in beats per minute (BPM) as a number.
energy: A value between 0 and 1 indicating the song's energy level.
valence: A value between 0 and 1 representing the emotional positivity of the song.
danceability: A value between 0 and 1 representing how suitable the song is for dancing.
color: A color that represents the mood of the song in rgb(r, g, b) format. If you want, you can use the color palette from the album cover. or the song title.

Make sure the values are correct and the data is complete. Ensure the JSON is formatted correctly and provide realistic sample values.`;

        const result = await generateWithModelFallback(prompt);
        const rawResponse = result?.text || "";
        debugLog("track", { name: track.name, artist: track.artist });
        debugLog("gemini raw response", rawResponse);

        let parsed;
        try {
            parsed = JSON.parse(rawResponse);
            debugLog("gemini parsed response", parsed);
        } catch (parseError) {
            parsed = null;
            debugLog("gemini parse error", parseError?.message || parseError);
        }

        analysisResults = sanitizeAnalysis(parsed, track);
        debugLog("sanitized analysis", analysisResults);
        res.json({ analysisResults });
    } catch (error) {
        const fallback = defaultAnalysis(req.body?.track);
        debugLog("route error", error?.message || error);
        res.json({
            analysisResults: fallback,
            warning: "Fallback analysis returned due to upstream error",
        });
    }
});

module.exports = router;