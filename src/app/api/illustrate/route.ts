
import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { title, content } = await request.json();

        const rawKey = process.env.GOOGLE_API_KEY || "";
        const apiKey = (rawKey.startsWith("'") && rawKey.endsWith("'")) || (rawKey.startsWith('"') && rawKey.endsWith('"'))
            ? rawKey.slice(1, -1)
            : rawKey;

        if (!apiKey) {
            // Mock Fallback for no API key
            return NextResponse.json({
                success: true,
                image: '/images/moods/peaceful.png', // Fallback to a safe default
                mock: true
            });
        }

        // 1. Generate a vivid image prompt from the poem
        const genAI = new GoogleGenerativeAI(apiKey);
        const textModel = genAI.getGenerativeModel({ model: "gemini-2.0-flash" }); // Upgraded to match generate route

        const promptPrompt = `You are an expert art director for traditional Chinese ink wash paintings. 
        Read this poem: "${title} - ${content}". 
        Create a concise, vivid English image prompt for an AI generator. 
        Focus on visual elements: landscape, season, weather, colors (ink wash style). 
        Output ONLY the prompt.`;

        const result = await textModel.generateContent(promptPrompt);
        const imagePrompt = result.response.text();

        console.log("Generated Image Prompt:", imagePrompt);

        // 2. Try to generate the image using Gemini 2.5 Flash Image
        try {
            console.log("Calling gemini-2.5-flash-image...");
            const imageModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash-image" });
            const result = await imageModel.generateContent(imagePrompt);
            const response = await result.response;

            // Extract Inline Data (Base64)
            // Robust check: It might not be the first part
            const candidates = response.candidates;
            let imgPart = null;

            if (candidates && candidates[0]?.content?.parts) {
                imgPart = candidates[0].content.parts.find((p: any) => p.inlineData);
            }

            if (imgPart && imgPart.inlineData) {
                const base64Data = imgPart.inlineData.data;
                const mimeType = imgPart.inlineData.mimeType || "image/png";

                return NextResponse.json({
                    success: true,
                    image: `data:${mimeType};base64,${base64Data}`,
                    prompt: imagePrompt
                });
            } else {
                console.warn("Gemini Image Response w/o inlineData:", JSON.stringify(response, null, 2));
                throw new Error("No inline image data found in Gemini response");
            }

        } catch (imgError: any) {
            console.error("Real Image Generation Failed:", imgError.message);
            // FALLBACK if API fails
            // (Fallthrough to mood logic below)

            let fallbackImage = '/images/moods/nostalgic.png';
            const lowerPrompt = imagePrompt.toLowerCase();

            if (lowerPrompt.includes('spring') || lowerPrompt.includes('joy') || lowerPrompt.includes('flower')) {
                fallbackImage = '/images/moods/joyful.png';
            } else if (lowerPrompt.includes('winter') || lowerPrompt.includes('snow') || lowerPrompt.includes('cold')) {
                fallbackImage = '/images/moods/melancholic.png';
            } else if (lowerPrompt.includes('mountain') || lowerPrompt.includes('eagle') || lowerPrompt.includes('hero')) {
                fallbackImage = '/images/moods/heroic.png';
            } else if (lowerPrompt.includes('moon') || lowerPrompt.includes('quiet') || lowerPrompt.includes('peace')) {
                fallbackImage = '/images/moods/peaceful.png';
            }

            return NextResponse.json({
                success: true,
                image: fallbackImage,
                prompt: imagePrompt,
                isFallback: true
            });
        }

    } catch (error: any) {
        console.error("Illustration failed - Full Error:", error);
        console.error("Error Message:", error.message);
        return NextResponse.json({
            success: false,
            error: error.message || 'Failed to generate illustration'
        }, { status: 500 });
    }
}
