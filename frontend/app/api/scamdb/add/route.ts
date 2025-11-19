import { NextRequest, NextResponse } from "next/server";
import { writeFile, readFile } from "fs/promises";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const required = [
      "url",
      "type",
      "description",
      "severity",
      "reports",
      "lastReported",
    ];

    for (const key of required) {
      if (!body[key]) {
        return NextResponse.json(
          { error: `Missing field: ${key}` },
          { status: 400 }
        );
      }
    }

    // Path to the scam database file
    const filePath = path.join(
      process.cwd(),
      "frontend",
      "lib",
      "scamDatabase.ts"
    );

    // Read file as text
    let fileContent = await readFile(filePath, "utf8");

    // Build the new entry text
    const entryText = `
  {
    url: "${body.url}",
    type: "${body.type}",
    description: "${body.description}",
    severity: "${body.severity}",
    reports: ${body.reports},
    lastReported: "${body.lastReported}",
  },`;

    // Insert before the final closing ]
    fileContent = fileContent.replace(/]\s*$/, `${entryText}\n]`);

    // Write updated file
    await writeFile(filePath, fileContent);

    return NextResponse.json({
      success: true,
      added: body.url,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
