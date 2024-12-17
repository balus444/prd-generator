import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_AI_API_KEY) {
  throw new Error("Missing GOOGLE_AI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY);

export async function POST(req: Request) {
  try {
    console.log("Google AI Key exists:", !!process.env.GOOGLE_AI_API_KEY);

    const {
      productName,
      productVision,
      targetAudience,
      problemStatement,
      proposedSolution,
      granularity,
      nfrs = {},
      techStack,
      apis,
      dataModel,
      kpis,
    } = await req.json();

    if (
      !productName ||
      !productVision ||
      !targetAudience ||
      !problemStatement ||
      !proposedSolution ||
      !granularity
    ) {
      return Response.json(
        { error: "Invalid input: Missing required fields" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const nfrsString = Object.entries(nfrs)
      .map(([key, value]) => `${key}: ${value}`)
      .join(", ");

    const prompt = `
          Provide a detailed Product Requirements Document (PRD) for the product: "${productName}".

          Product Vision: ${productVision}
          Target Audience: ${targetAudience}
          Problem Statement: ${problemStatement}
          Proposed Solution: ${proposedSolution}
          Granularity Level: ${granularity}
          Non-Functional Requirements: ${nfrsString}
          Tech Stack: ${techStack || "Not specified"}
          APIs: ${apis || "Not specified"}
          Data Model: ${dataModel || "Not specified"}
          KPIs: ${kpis || "Not specified"}

          Format your response as a valid JSON object with this structure:
           {
             "productName": "${productName}",
              "productVision": "${productVision}",
              "targetAudience": "${targetAudience}",
              "problemStatement": "${problemStatement}",
              "proposedSolution": "${proposedSolution}",
              "features": [
                 {
                   "featureName": "Name of the Feature",
                   "featureDescription": "Description of the feature",
                    "priority": "P0/P1/P2/P3",
                    "userStories": [
                       {
                         "userStory": "As a [user role], I want [goal/desire], so that [benefit]",
                           "acceptanceCriteria": ["Criterion 1", "Criterion 2"]
                         }
                     ]
                  }
                ],
             "epics": [
                {
                  "epicName": "Name of the Epic",
                  "description": "Description of the epic",
                  "userStories": ["list of user stories ids or user story names"],
                  "acceptanceCriteria": ["high level acceptance criteria for the epic"]
                }
             ],
              "nonFunctionalRequirements": {
                 "performance": "Description of performance requirements",
                 "scalability": "Description of scalability requirements",
                 "security": "Description of security requirements",
                 "usability": "Description of usability requirements",
                 "reliability": "Description of reliability requirements",
                 "maintainability": "Description of maintainability requirements"
              },
             "roadmaps": {
                 "p0": "Roadmap overview for P0",
                 "p1": "Roadmap overview for P1",
                 "p2": "Roadmap overview for P2"
              }
          }

          Rules:
          1. Provide user stories and acceptance criteria based on the specified granularity.
          2. Provide user stories for each feature.
          3. Include 2-3 user stories per feature in the detailed mode. 1 user story per feature in high-level mode.
          4. Provide acceptance criteria for each user story, 2-3 acceptance criteria per user story.
          5. Provide high level overview for epics.
          6. Ensure all descriptions are clear, concise, and free from special formatting
          7. Do not use markdown formatting or special characters in any text fields.
          8. Response must be ONLY the JSON object, no other text.
        `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("No JSON found in response");
      }

      const jsonStr = jsonMatch[0];
      const jsonResponse = JSON.parse(jsonStr);

      // Basic validation of the response structure
      if (
        !jsonResponse.productName ||
        !jsonResponse.productVision ||
        !jsonResponse.targetAudience ||
        !jsonResponse.problemStatement ||
        !jsonResponse.proposedSolution ||
        !jsonResponse.features ||
        !jsonResponse.epics ||
        !jsonResponse.nonFunctionalRequirements ||
        !jsonResponse.roadmaps
      ) {
        throw new Error("Invalid response structure");
      }

      return Response.json(jsonResponse);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      console.error("Raw response:", text);
      return Response.json(
        { error: "Failed to parse the AI response. Please try again." },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("API Error:", error);
    return Response.json(
      { error: "Failed to process the PRD. Please try again." },
      { status: 500 }
    );
  }
}
