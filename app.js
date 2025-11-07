import express from "express";
import fetch from "node-fetch";
import path from "path";

const app = express();
app.use(express.json());

// خدمة الملفات الثابتة للواجهة الأمامية
app.use(express.static(path.join(process.cwd(), "public")));

// API Key DeepSeek
const apiKey = process.env.deepseek1;

// اسم النموذج على DeepSeek
const model = "default"; // لاحقًا يمكن تغييره لنموذجك الخاص

// Endpoint للطلاب لإرسال الأسئلة
app.post("/ask", async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === "") {
    return res.json({ answer: "الرجاء إدخال سؤال صالح." });
  }

  try {
    const response = await fetch("https://api.deepseek.ai/v1/generate", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt: question, model })
    });

    const data = await response.json();
    console.log("DeepSeek response:", data);

    let answer = data.output_text || (data.output && data.output[0] && data.output[0].content) || "لا يوجد رد من النموذج";
    res.json({ answer });

  } catch (error) {
    console.error("DeepSeek API Error:", error);
    res.status(500).json({ answer: "حدث خطأ في معالجة السؤال. " + (error.message || "") });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
