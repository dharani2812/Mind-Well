export async function POST(request) {
  try {
    const body = await request.json();
    const { mood, stressLevel, sleepQuality, focusLevel, journalText } = body;

    // Build a comprehensive prompt for AI analysis
    const systemPrompt = `You are a supportive mental health companion for college students. Your role is to:
1. Analyze multiple wellbeing indicators together (mood, stress, sleep, focus)
2. Classify the student's state as: "Normal", "Mild Stress", "Moderate Stress", or "High Stress"
3. Provide a confidence percentage (0-100) for your classification
4. Give a brief, supportive explanation in simple, non-medical language
5. Suggest 3-4 personalized, actionable recommendations

Important guidelines:
- Use weighted scoring (stress and sleep are particularly important indicators)
- Be supportive and encouraging, never alarming
- Avoid medical terminology or diagnosis
- Focus on practical, student-friendly suggestions
- If stress is high, gently suggest professional support`;

    const userPrompt = `Analyze this student's check-in:
- Mood: ${mood}
- Stress Level: ${stressLevel}/10
- Sleep Quality: ${sleepQuality}
- Focus Level: ${focusLevel}
${journalText ? `- Journal: ${journalText}` : ""}

Provide analysis in this exact JSON structure (no markdown, just JSON):
{
  "state": "Normal|Mild Stress|Moderate Stress|High Stress",
  "confidence": 85,
  "explanation": "Brief supportive explanation of their current state",
  "recommendations": [
    "Specific actionable tip 1",
    "Specific actionable tip 2",
    "Specific actionable tip 3"
  ]
}`;

    const response = await fetch("/integrations/chat-gpt/conversationgpt4", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        json_schema: {
          name: "mental_health_analysis",
          schema: {
            type: "object",
            properties: {
              state: {
                type: "string",
                enum: [
                  "Normal",
                  "Mild Stress",
                  "Moderate Stress",
                  "High Stress",
                ],
              },
              confidence: {
                type: "number",
              },
              explanation: {
                type: "string",
              },
              recommendations: {
                type: "array",
                items: {
                  type: "string",
                },
              },
            },
            required: ["state", "confidence", "explanation", "recommendations"],
            additionalProperties: false,
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("AI analysis failed");
    }

    const data = await response.json();
    const analysis = JSON.parse(data.choices[0].message.content);

    return Response.json(analysis);
  } catch (error) {
    console.error("Error analyzing mental state:", error);
    return Response.json(
      { error: "Failed to analyze mental state" },
      { status: 500 },
    );
  }
}
