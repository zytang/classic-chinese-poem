export const generatePoemPrompt = (topic: string, style: string, mood: string) => {
    const styleDescriptions: Record<string, string> = {
        'jueju': 'Five-character Quatrain (五言绝句) or Seven-character Quatrain (七言绝句). STRICTLY 4 lines.',
        'lvshi': 'Five-character Regulated Verse (五言律诗) or Seven-character Regulated Verse (七言律诗). STRICTLY 8 lines.'
    };

    const description = styleDescriptions[style] || 'Classic Chinese Poetry';

    return `
You are a master poet of the Tang Dynasty. Your task is to compose a classical Chinese poem.

Parameters:
- **Topic**: ${topic}
- **Style**: ${description}
- **Mood**: ${mood}

Constraints:
1. You MUST strictly adhere to the tonal patterns (Pingze) of the selected style.
2. You MUST use rhymes consistent with the Pingshui Yun (平水韵).
3. The language should be elegant, classical, and evocative.
4. Do NOT use modern simplified phrasing if it breaks the classical feel, but output in Simplified Chinese characters for the user.

Output Format:
You must return the result in valid JSON format with the following structure:
{
  "poem": "The full poem text with \\n for line breaks.",
  "interpretation": "A brief interpretation of the poem in English (or the language of the prompt context), explaining the imagery and meaning."
}
    `.trim();
};
