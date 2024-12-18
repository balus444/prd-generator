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
      comfortLevel,
    } = await req.json();

    if (
      !productName ||
      !productVision ||
      !targetAudience ||
      !problemStatement ||
      !comfortLevel
    ) {
      return Response.json(
        { error: "Invalid input: Missing required fields" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const technicalDepthPrompt = {
      Beginner: `
        - Focus on essential, well-established technologies
        - Provide clear, beginner-friendly technical explanations
        - Emphasize maintainable and well-documented solutions
        - Suggest popular, stable tech stack with extensive community support
        - Include learning resources and getting started guides
      `,
      Intermediate: `
        - Balance between modern and established technologies
        - Include some advanced architectural patterns
        - Suggest scalable solutions with moderate complexity
        - Recommend industry-standard practices and tools
        - Include performance optimization considerations
      `,
      Expert: `
        - Incorporate cutting-edge technologies where appropriate
        - Suggest advanced architectural patterns and design principles
        - Include complex scalability and performance optimizations
        - Consider microservices and distributed systems approaches
        - Recommend advanced monitoring and DevOps practices
      `,
    }[comfortLevel];

    const prompt = `
      Provide a detailed Product Requirements Document (PRD) for the product: "${productName}".

      Product Vision: ${productVision}
      Target Audience: ${targetAudience}
      Problem Statement: ${problemStatement}
      Technical Expertise Level: ${comfortLevel}

      Technical Depth Considerations:
      ${technicalDepthPrompt}

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
      2. Adjust technical complexity based on the user's comfort level (${comfortLevel})
      3. For features and user stories:
         - Beginner: Focus on essential features with clear, straightforward implementations
         - Intermediate: Include moderately complex features with some advanced patterns
         - Expert: Include advanced features with sophisticated technical solutions
      4. Provide technology suggestions appropriate for the user's comfort level
      5. Include specific, measurable criteria in all NFRs
      6. Success metrics should be specific and measurable
      7. Make all responses specific to the product domain
      8. Provide thorough acceptance criteria for each user story
      9. Tech stack suggestions should match the user's comfort level
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
