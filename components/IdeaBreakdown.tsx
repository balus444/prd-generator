import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight } from "lucide-react";

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
  roadmaps: {
    p0?: string;
    p1?: string;
    p2?: string;
  };
  suggestedTechStack: TechStackSuggestion;
  successMetrics: SuccessMetrics;
  overview: string;
  priorities: string[];
  developmentSteps: string[];
}

interface IdeaBreakdownProps {
  breakdown: Breakdown;
}

export default function IdeaBreakdown({ breakdown }: IdeaBreakdownProps) {
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "overview",
    "p0",
  ]);
  const [expandedComponents, setExpandedComponents] = useState<string[]>([]);

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((name) => name !== sectionName)
        : [...prev, sectionName]
    );
  };

  const toggleComponentExpansion = (componentName: string) => {
    setExpandedComponents((prev) =>
      prev.includes(componentName)
        ? prev.filter((name) => name !== componentName)
        : [...prev, componentName]
    );
  };

  const renderComponent = (component: Feature, index: number) => (
    <Card key={index} className="mt-4 blueprint-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between blueprint-text">
          <span>{component.featureName}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleComponentExpansion(component.featureName)}
            className="blueprint-button"
          >
            {expandedComponents.includes(component.featureName) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 blueprint-text">{component.featureDescription}</p>
        {expandedComponents.includes(component.featureName) && (
          <div>
            <h5 className="blueprint-subheading mb-2 mt-6">Requirements:</h5>
            <ul className="list-disc pl-5 blueprint-text">
              {component.userStories.map((userStory, idx) => (
                <li key={idx}>{userStory.userStory}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderService = (service: Epic, index: number) => (
    <Card key={index} className="mt-4 blueprint-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between blueprint-text">
          <span>{service.epicName}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleComponentExpansion(service.epicName)}
            className="blueprint-button"
          >
            {expandedComponents.includes(service.epicName) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-2 blueprint-text">{service.description}</p>
        {expandedComponents.includes(service.epicName) && (
          <div>
            <h5 className="blueprint-subheading mb-2 mt-6">Requirements:</h5>
            <ul className="list-disc pl-5 blueprint-text">
              {service.userStories.map((userStory, idx) => (
                <li key={idx}>{userStory.userStory}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderPriorityLevel = (priority: "p0" | "p1" | "p2") => (
    <Card key={priority} className="mt-6 blueprint-card">
      <CardHeader>
        <CardTitle className="flex items-center justify-between blueprint-text">
          <span>Priority {priority.toUpperCase()}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleSection(priority)}
            className="blueprint-button"
          >
            {expandedSections.includes(priority) ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </CardTitle>
      </CardHeader>
      {expandedSections.includes(priority) && (
        <CardContent>
          <h4 className="blueprint-subheading mt-6 mb-2">
            Frontend Components:
          </h4>
          {breakdown.priorities[priority]?.frontend?.components?.map(
            (component, index) => renderComponent(component, index)
          ) || (
            <p className="blueprint-text">
              No frontend components for this priority level.
            </p>
          )}
          <h4 className="blueprint-subheading mt-8">Backend Services:</h4>
          {breakdown.priorities[priority]?.backend?.services?.map(
            (service, index) => renderService(service, index)
          ) || (
            <p className="blueprint-text">
              No backend services for this priority level.
            </p>
          )}
          <div className="mt-4">
            <h4 className="blueprint-subheading mb-2 mt-8">Data Model:</h4>
            {breakdown.priorities[priority]?.backend?.dataModel?.length > 0 ? (
              <ul className="list-disc pl-5 blueprint-text">
                {breakdown.priorities[priority].backend.dataModel.map(
                  (item, index) => (
                    <li key={index}>{item}</li>
                  )
                )}
              </ul>
            ) : (
              <p className="blueprint-text">
                No data model defined for this priority level.
              </p>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card className="blueprint-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between blueprint-text">
            <span>Overview</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection("overview")}
              className="blueprint-button"
            >
              {expandedSections.includes("overview") ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {expandedSections.includes("overview") && (
          <CardContent>
            <p className="blueprint-text pr-8">{breakdown.overview}</p>
          </CardContent>
        )}
      </Card>

      {renderPriorityLevel("p0")}
      {renderPriorityLevel("p1")}
      {renderPriorityLevel("p2")}

      <Card className="blueprint-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between blueprint-text">
            <span>Development Steps</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleSection("developmentSteps")}
              className="blueprint-button"
            >
              {expandedSections.includes("developmentSteps") ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        {expandedSections.includes("developmentSteps") && (
          <CardContent>
            {breakdown.developmentSteps.map((phase, index) => (
              <div key={index} className="mb-4 mt-6">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="blueprint-subheading">{phase.phase}</h4>
                  <Badge className="mx-1 blueprint-text bg-blue-200/10">
                    {phase.priority}
                  </Badge>
                </div>
                <ul className="list-disc pl-5 blueprint-text">
                  {phase.tasks.map((task, taskIndex) => (
                    <li key={taskIndex}>{task}</li>
                  ))}
                </ul>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
