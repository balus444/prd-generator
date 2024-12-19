"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import IdeaBreakdown from "@/components/IdeaBreakdown";
import QueryHistory from "@/components/QueryHistory";
import PromptCarousel from "@/components/PromptCarousel";
import LoadingScreen from "@/components/LoadingScreen";
import { Label } from "@/components/ui/label";
import UserComfortLevel from "@/components/UserComfortLevel";

interface Feature {
  featureName: string;
  featureDescription: string;
  priority: string;
  userStories: {
    userStory: string;
    acceptanceCriteria: string[];
  }[];
}

interface Epic {
  epicName: string;
  description: string;
  userStories: string[];
  acceptanceCriteria: string[];
}

interface NonFunctionalRequirements {
  performance: string;
  scalability: string;
  security: string;
  usability: string;
  reliability: string;
  maintainability: string;
}

interface Roadmaps {
  p0?: string;
  p1?: string;
  p2?: string;
}

interface TechStackSuggestion {
  frontend: string[];
  backend: string[];
  database: string[];
  devops: string[];
  rationale: string;
}

interface SuccessMetrics {
  businessMetrics: string[];
  technicalMetrics: string[];
  userMetrics: string[];
}

interface Breakdown {
  productName: string;
  productVision: string;
  targetAudience: string;
  problemStatement: string;
  proposedSolution: string;
  features: Feature[];
  epics: Epic[];
  nonFunctionalRequirements: NonFunctionalRequirements;
  roadmaps: Roadmaps;
  suggestedTechStack: TechStackSuggestion;
  successMetrics: SuccessMetrics;
}

interface QueryState {
  productName: string;
  productVision: string;
  targetAudience: string;
  problemStatement: string;
  proposedSolution: string;
  comfortLevel: "Beginner" | "Intermediate" | "Expert";
  breakdown: Breakdown | null;
}

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState<QueryState>({
    productName: "",
    productVision: "",
    targetAudience: "",
    problemStatement: "",
    proposedSolution: "",
    comfortLevel: "Beginner" as const,
    breakdown: null,
  });
  const [queryHistory, setQueryHistory] = useState<QueryState[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentQuery),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process the PRD");
      }
      if (!data || typeof data !== "object" || !data.productName) {
        throw new Error("Invalid response from server");
      }

      const newQueryState = {
        ...currentQuery,
        breakdown: data,
      };
      setCurrentQuery(newQueryState);
      setQueryHistory((prev) => [...prev, newQueryState]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNavigateToQuery = (index: number) => {
    setCurrentQuery(queryHistory[index]);
  };

  const handlePromptSelect = async (prompt: {
    text: string;
    vision: string;
    targetAudience: string;
    problemStatement: string;
  }) => {
    if (
      !prompt.text ||
      !prompt.vision ||
      !prompt.targetAudience ||
      !prompt.problemStatement
    ) {
      setError("Invalid prompt data");
      return;
    }
    const newQuery = {
      productName: prompt.text,
      productVision: prompt.vision,
      targetAudience: prompt.targetAudience,
      problemStatement: prompt.problemStatement,
      proposedSolution: "",
      comfortLevel: "Beginner" as const,
      breakdown: null,
    };

    setCurrentQuery(newQuery);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/breakdown", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newQuery),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
      }
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format");
      }
      if (
        !data.productName ||
        !data.productVision ||
        !data.targetAudience ||
        !data.problemStatement
      ) {
        throw new Error("Missing required fields in response");
      }

      const newQueryState = {
        ...newQuery,
        breakdown: data,
      };

      setCurrentQuery(newQueryState);
      setQueryHistory((prev) => [...prev, newQueryState]);
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleError = (error: unknown) => {
    console.error("Error:", error);
    if (error instanceof Error) {
      setError(error.message);
    } else if (typeof error === "string") {
      setError(error);
    } else {
      setError("An unexpected error occurred");
    }
  };

  const sanitizeInput = (input: string) => {
    return input.trim().replace(/[<>]/g, ""); // Basic XSS prevention
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <Card className="p-12 blueprint-card">
            <h1 className="text-3xl font-bold mb-4 blueprint-title">
              PRD Generator
            </h1>
            <p className="blueprint-text mb-8">
              Transform high-level product ideas into detailed PRDs
            </p>

            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="productName"
                      className="blueprint-text mb-8"
                    >
                      Product Name
                    </Label>
                    <Input
                      type="text"
                      id="productName"
                      value={currentQuery.productName}
                      onChange={(e) =>
                        setCurrentQuery((prev) => ({
                          ...prev,
                          productName: sanitizeInput(e.target.value),
                        }))
                      }
                      placeholder="Name of the product"
                      disabled={isLoading}
                      className="w-full blueprint-input border border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="productVision"
                      className="blueprint-text mb-8"
                    >
                      Product Vision
                    </Label>
                    <Input
                      type="text"
                      id="productVision"
                      value={currentQuery.productVision}
                      onChange={(e) =>
                        setCurrentQuery((prev) => ({
                          ...prev,
                          productVision: sanitizeInput(e.target.value),
                        }))
                      }
                      placeholder="Vision for the product"
                      disabled={isLoading}
                      className="w-full blueprint-input border border-2"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="targetAudience"
                      className="blueprint-text mb-8"
                    >
                      Target Audience
                    </Label>
                    <Input
                      type="text"
                      id="targetAudience"
                      value={currentQuery.targetAudience}
                      onChange={(e) =>
                        setCurrentQuery((prev) => ({
                          ...prev,
                          targetAudience: sanitizeInput(e.target.value),
                        }))
                      }
                      placeholder="Who is this product for?"
                      disabled={isLoading}
                      className="w-full blueprint-input border border-2"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label
                      htmlFor="problemStatement"
                      className="blueprint-text mb-8"
                    >
                      Problem Statement
                    </Label>
                    <Input
                      type="text"
                      id="problemStatement"
                      value={currentQuery.problemStatement}
                      onChange={(e) =>
                        setCurrentQuery((prev) => ({
                          ...prev,
                          problemStatement: sanitizeInput(e.target.value),
                        }))
                      }
                      placeholder="What problem does this solve?"
                      disabled={isLoading}
                      className="w-full blueprint-input border border-2"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="blueprint-text mb-8">Comfort Level</Label>
                  <UserComfortLevel
                    value={currentQuery.comfortLevel}
                    onChange={(value) =>
                      setCurrentQuery((prev) => ({
                        ...prev,
                        comfortLevel: value,
                      }))
                    }
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="submit"
                  disabled={
                    isLoading ||
                    !currentQuery.productName.trim() ||
                    !currentQuery.productVision.trim() ||
                    !currentQuery.targetAudience.trim() ||
                    !currentQuery.problemStatement.trim() ||
                    !currentQuery.comfortLevel
                  }
                  className="blueprint-button-primary font-bold"
                >
                  Generate PRD
                </Button>
              </form>
              {!currentQuery.breakdown && !isLoading && (
                <PromptCarousel onPromptSelect={handlePromptSelect} />
              )}
            </div>

            {isLoading && <LoadingScreen />}

            {error && (
              <Alert
                variant="destructive"
                className="mt-4 border border-2 border-blue-200 bg-blue-50/50 text-blue-900"
              >
                <AlertDescription className="font-medium">
                  ⚠️ {error}
                </AlertDescription>
              </Alert>
            )}

            {currentQuery.breakdown && (
              <div className="mt-8">
                <QueryHistory
                  history={queryHistory.map((q) => ({
                    idea: q.productName,
                    focusArea: null,
                  }))}
                  currentIndex={queryHistory.length - 1}
                  onSelect={handleNavigateToQuery}
                />
                <IdeaBreakdown breakdown={currentQuery.breakdown} />
              </div>
            )}
            <style jsx>{`
              :global(.blueprint-button-primary) {
                background-color: white !important;
                color: #1e3a8a !important;
                border: 1px solid #93c5fd !important;
              }
              :global(.blueprint-button-primary:hover) {
                background-color: #f0f9ff !important;
              }
            `}</style>
          </Card>
        </div>
      </div>

      <footer className="w-full py-4 mt-auto">
        <p className="text-center text-xs blueprint-text opacity-50">
          balasubbiah 2024 •{" "}
          <a
            href="https://x.com/@1balasubbiah"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            Twitter
          </a>{" "}
          •{" "}
          <a
            href="https://github.com/balus444"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  );
}
