import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Middleware for parsing large image payloads
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// Lazy Gemini client helper
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    timestamp: new Date().toISOString(),
  });
});

// Style prompt templates
const STYLE_PROMPTS: Record<string, string> = {
  miami_vice:
    "Transform this person into an authentic 1980s Miami Vice character. Keep the person's recognizable facial features and gender, but give them a retro 1985 pastel linen blazer or tropical Hawaiian floral shirt, classic aviator or wayfarer sunglasses perched on the nose or shirt, 1980s styled hair, leaning against a vintage 80s sports car or near palm trees at golden hour sunset. Kodak Kodachrome 64 35mm film grain, warm nostalgic colors, genuine 1980s cinematic film photograph.",
  yearbook:
    "Transform this portrait into an iconic 1986 High School Yearbook photo. Keep the person's face recognizable, but style them with voluminous 80s feathered hair, pastel knit sweater with rolled collar or vintage denim jacket, classic laser-beam grid studio backdrop in blue and magenta, soft glamour diffused glow lens, vintage school portrait photography, 1980s film texture.",
  synthwave:
    "Transform this portrait into an electric 1980s synthwave arcade aesthetic. Retain facial features while styling with retro neon magenta and cyan rim lighting, vintage cassette Walkman with orange foam headphones around the neck, acid wash denim jacket with retro pins, glowing vector grid and neon arcade cabinet in the background, authentic 1980s VHS tape glow.",
  glamour:
    "Transform this portrait into a high-drama 1980s studio glamour shot. Retain facial likeness, give them voluminous perm styling, dramatic 1980s fashion lighting with soft focus diffuser, metallic foil or pastel geometric background, vintage magazine cover aesthetic from 1985.",
  vhs_camcorder:
    "Transform this photo into an authentic 1988 home video VHS recording snapshot. Keep the person recognizable in casual 80s mall attire, with authentic magnetic tape tracking scanlines, slight chromatic aberration color fringe, warm analog grain, and orange VCR on-screen display timestamp in the corner.",
};

// Transform photo with Gemini Image Generation or Image Editing
app.post("/api/transform-80s", async (req, res) => {
  try {
    const { imageBase64, mimeType = "image/jpeg", styleId = "miami_vice", customNotes = "" } = req.body;

    const basePrompt = STYLE_PROMPTS[styleId] || STYLE_PROMPTS.miami_vice;
    const fullPrompt = customNotes
      ? `${basePrompt} Additional user direction: ${customNotes}. Make it look like a real authentic 1980s photograph.`
      : `${basePrompt} Make it look like a real authentic 1980s photograph.`;

    const ai = getGeminiClient();

    // If imageBase64 is provided, attempt image editing/generation with gemini-3.1-flash-lite-image
    if (imageBase64) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, "");
      
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.1-flash-lite-image",
          contents: {
            parts: [
              {
                inlineData: {
                  data: cleanBase64,
                  mimeType,
                },
              },
              {
                text: fullPrompt,
              },
            ],
          },
        });

        // Search for generated image part
        let generatedImageUrl: string | null = null;
        let generatedText: string | null = null;

        if (response.candidates?.[0]?.content?.parts) {
          for (const part of response.candidates[0].content.parts) {
            if (part.inlineData?.data) {
              const mime = part.inlineData.mimeType || "image/png";
              generatedImageUrl = `data:${mime};base64,${part.inlineData.data}`;
            } else if (part.text) {
              generatedText = part.text;
            }
          }
        }

        if (generatedImageUrl) {
          return res.json({
            success: true,
            imageUrl: generatedImageUrl,
            commentary: generatedText || "Transformed into authentic 1980s aesthetic!",
          });
        }
      } catch (imageErr: any) {
        console.warn("Image model edit warning:", imageErr?.message || imageErr);
        // Fallback: If image model fails or lacks quota, try text-to-image or generate stylized commentary & persona
      }
    }

    // Try text-to-image if no image provided or fallback
    try {
      const genResponse = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite-image",
        contents: {
          parts: [{ text: fullPrompt }],
        },
      });

      if (genResponse.candidates?.[0]?.content?.parts) {
        for (const part of genResponse.candidates[0].content.parts) {
          if (part.inlineData?.data) {
            const mime = part.inlineData.mimeType || "image/png";
            return res.json({
              success: true,
              imageUrl: `data:${mime};base64,${part.inlineData.data}`,
              commentary: "Generated authentic 1980s look.",
            });
          }
        }
      }
    } catch (txtImgErr: any) {
      console.warn("Text-to-image fallback warning:", txtImgErr?.message || txtImgErr);
    }

    // Secondary fallback: Gemini 3.8 Flash persona & yearbook styling profile
    const profileResponse = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `You are an expert 1980s creative director and photo archivist.
Generate an authentic 1980s persona profile for someone getting an 80s photo shoot in style: "${styleId}".
Return a concise JSON object with:
{
  "characterName": "e.g. Sonny or Tiffany or Bryce",
  "yearbookQuote": "a funny authentic 1980s quote or movie reference",
  "favoriteSong": "e.g. Africa by Toto or Careless Whisper",
  "outfitBreakdown": "description of their 80s wardrobe",
  "retroVibeRating": "10/10 Tubular"
}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const persona = JSON.parse(profileResponse.text || "{}");
    return res.json({
      success: true,
      persona,
      message: "80s Persona generated successfully!",
    });
  } catch (error: any) {
    console.error("Error in /api/transform-80s:", error);
    res.status(500).json({
      error: error.message || "Failed to process 80s transformation",
    });
  }
});

// Vite middleware & Static Serving
async function start() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`80s Retro Studio running on port ${PORT}`);
  });
}

start();
