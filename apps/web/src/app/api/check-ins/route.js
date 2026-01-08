import sql from "@/app/api/utils/sql";

export async function GET(request) {
  try {
    const checkIns = await sql`
      SELECT * FROM check_ins 
      ORDER BY created_at DESC
    `;

    return Response.json(checkIns);
  } catch (error) {
    console.error("Error fetching check-ins:", error);
    return Response.json(
      { error: "Failed to fetch check-ins" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      mood,
      stress_level,
      sleep_quality,
      focus_level,
      journal_text,
      analysis_state,
      analysis_confidence,
    } = body;

    // Validate required fields
    if (!mood || !stress_level || !sleep_quality || !focus_level) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Validate stress level range
    if (stress_level < 1 || stress_level > 10) {
      return Response.json(
        { error: "Stress level must be between 1 and 10" },
        { status: 400 },
      );
    }

    const result = await sql`
      INSERT INTO check_ins (
        mood, 
        stress_level, 
        sleep_quality, 
        focus_level, 
        journal_text,
        analysis_state,
        analysis_confidence
      )
      VALUES (
        ${mood},
        ${stress_level},
        ${sleep_quality},
        ${focus_level},
        ${journal_text || null},
        ${analysis_state || null},
        ${analysis_confidence || null}
      )
      RETURNING *
    `;

    return Response.json(result[0], { status: 201 });
  } catch (error) {
    console.error("Error creating check-in:", error);
    return Response.json(
      { error: "Failed to create check-in" },
      { status: 500 },
    );
  }
}
