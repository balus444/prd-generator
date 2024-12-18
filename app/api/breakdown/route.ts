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
      granularity,
    } = await req.json();

    if (
      !productName ||
      !productVision ||
      !targetAudience ||
      !problemStatement ||
      !granularity
    ) {
      return Response.json(
        { error: "Invalid input: Missing required fields" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = `
      Provide a detailed Product Requirements Document (PRD) for the product: "${productName}".

      Product Vision: ${productVision}
      Target Audience: ${targetAudience}
      Problem Statement: ${problemStatement}
      Granularity Level: ${granularity}

      Format your response as a valid JSON object with this structure:
      {
        "productName": "${productName}",
        "productVision": "${productVision}",
        "targetAudience": "${targetAudience}",
        "problemStatement": "${problemStatement}",
        "proposedSolution": "AI-generated comprehensive solution description",
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
            "userStories": ["list of user stories"],
            "acceptanceCriteria": ["high level acceptance criteria for the epic"]
          }
        ],
        "nonFunctionalRequirements": {
          "performance": "Detailed performance requirements and benchmarks",
          "scalability": "Specific scalability targets and architecture considerations",
          "security": "Comprehensive security requirements and compliance needs",
          "usability": "Detailed usability and accessibility requirements",
          "reliability": "Specific reliability targets and SLAs",
          "maintainability": "Code quality standards and maintenance requirements"
        },
        "roadmaps": {
          "p0": "Detailed P0 (MVP) features and timeline",
          "p1": "P1 features and enhancements roadmap",
          "p2": "Future considerations and potential expansions"
        },
        "suggestedTechStack": {
          "frontend": ["List modern frontend technologies for 2024/2025"],
          "backend": ["List modern backend technologies for 2024/2025"],
          "database": ["List appropriate database technologies"],
          "devops": ["List modern DevOps tools and practices"],
          "rationale": "Detailed explanation of technology choices and trade-offs"
        },
        "successMetrics": {
          "businessMetrics": ["List key business KPIs"],
          "technicalMetrics": ["List key technical performance indicators"],
          "userMetrics": ["List key user satisfaction metrics"]
        }
      }

      Rules:
      1. Generate a comprehensive proposed solution based on the problem statement and vision
      2. For features and user stories:
         - In High-Level mode: Provide core features with 1 user story each
         - In Detailed mode: Provide comprehensive features with 2-3 user stories each
      3. Provide modern, production-ready technology suggestions for 2024/2025
      4. Include specific, measurable criteria in all NFRs
      5. Ensure roadmap aligns with granularity level
      6. Success metrics should be specific and measurable
      7. Make all responses specific to the product domain
      8. Provide thorough acceptance criteria for each user story
      9. Ensure tech stack suggestions are cutting-edge but production-stable
      10. Response must be only the JSON object, no additional text
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

      if (
        !jsonResponse.productName ||
        !jsonResponse.productVision ||
        !jsonResponse.targetAudience ||
        !jsonResponse.problemStatement ||
        !jsonResponse.proposedSolution ||
        !jsonResponse.features ||
        !jsonResponse.epics ||
        !jsonResponse.nonFunctionalRequirements ||
        !jsonResponse.roadmaps ||
        !jsonResponse.suggestedTechStack ||
        !jsonResponse.successMetrics
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
