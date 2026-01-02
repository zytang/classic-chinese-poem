
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const rawKey = process.env.GOOGLE_API_KEY || "";
const apiKey = (rawKey.startsWith("'") && rawKey.endsWith("'")) || (rawKey.startsWith('"') && rawKey.endsWith('"'))
    ? rawKey.slice(1, -1)
    : rawKey;

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: Request) {
    try {
        const { topic, style, mood } = await request.json();
        const styleMap: Record<string, string> = {
            'wujue': 'Five-character Quatrain (五言绝句)',
            'qijue': 'Seven-character Quatrain (七言绝句)',
            'wulv': 'Five-character Regulated Verse (五言律诗)',
            'qilv': 'Seven-character Regulated Verse (七言律诗)',
            'jueju': 'Five-character Quatrain (五言绝句)', // Backward combat
            'lvshi': 'Five-character Regulated Verse (五言律诗)' // Backward compat
        };
        const styleName = styleMap[style] || style;

        // 1. Real Generation if Key exists
        if (genAI) {
            try {
                console.log("Attempting Real AI generation with gemini-2.0-flash...");
                const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

                const promptText = `
          You are a master Chinese poet from the Tang Dynasty.
          Compose a ${styleName} (Classic Chinese Poem) about "${topic}".
          Mood: ${mood}.
          
          Strict Rules:
          1. Follow the strict tonal patterns (Pingze) and rhyme scheme for ${styleName}.
          2. Output ONLY the poem content. No title, no explanation.
          3. Use Simplified Chinese characters (简体中文) ONLY.
          5. Keep the content purely Classical Chinese appropriate for Tang Dynasty.
          6. Format: Just the lines of the poem, separated by newlines.
          7. Punctuation: You MUST add a Chinese comma (，) at the end of every odd line, and a Chinese period (。) at the end of every even line.
        `;

                const result = await model.generateContent(promptText);
                const response = await result.response;
                const poem = response.text().trim();

                console.log("Gemini Success:", poem);
                return NextResponse.json({ poem });

            } catch (aiError: any) {
                console.error("Real AI Generation Failed (falling back to mock):", aiError.message);
                // Fallthrough to mock data below
            }
        }

        console.log("Using Mock Fallback...");
        await new Promise((resolve) => setTimeout(resolve, 3000));

        let poem = "";
        // Mock Data based on Style
        if (style === 'qijue') {
            // 7-char Quatrain
            poem = "朝辞白帝彩云间，\n千里江陵一日还。\n两岸猿声啼不住，\n轻舟已过万重山。";
        } else if (style === 'wulv') {
            // 5-char Regulated
            poem = "国破山河在，\n城春草木深。\n感时花溅泪，\n恨别鸟惊心。\n烽火连三月，\n家书抵万金。\n白头搔更短，\n浑欲不胜簪。";
        } else if (style === 'qilv') {
            // 7-char Regulated
            poem = "昔人已乘黄鹤去\n此地空余黄鹤楼\n黄鹤一去不复返\n白云千载空悠悠\n晴川历历汉阳树\n芳草萋萋鹦鹉洲\n日暮乡关何处是\n烟波江上使人愁";
        } else {
            // Default Wujue (5-char Quatrain)
            poem = "空山新雨后\n天气晚来秋\n明月松间照\n清泉石上流";
        }

        if (topic.includes("Moon") || topic.includes("月")) {
            poem = "床前明月光\n疑是地上霜\n举头望明月\n低头思故乡";
        } else if (topic.includes("Snow") || topic.includes("雪")) {
            poem = "千山鸟飞绝\n万径人踪灭\n孤舟蓑笠翁\n独钓寒江雪";
        }

        return NextResponse.json({ poem });

    } catch (error: any) {
        console.error("API Error Full Object:", JSON.stringify(error, null, 2));
        console.error("API Error Message:", error.message || error);
        return NextResponse.json({ error: 'Failed to generate poem', details: error.message || String(error) }, { status: 500 });
    }
}

