import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';

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
    performance?: string;
    scalability?: string;
    security?: string;
    usability?: string;
    reliability?: string;
    maintainability?: string;
  }


  interface Roadmaps {
    p0?: string;
    p1?: string;
    p2?: string;
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
}


interface PRDDisplayProps {
    breakdown: Breakdown;
}

export default function PRDDisplay({ breakdown }: PRDDisplayProps) {
    const [expandedSections, setExpandedSections] = useState<string[]>(['overview', 'features', 'epics', 'nfrs', 'roadmaps']);
    const [expandedFeatures, setExpandedFeatures] = useState<string[]>([]);
    const [expandedEpics, setExpandedEpics] = useState<string[]>([]);

    const toggleSection = (sectionName: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionName)
                ? prev.filter(name => name !== sectionName)
                : [...prev, sectionName]
        );
    };

    const toggleFeatureExpansion = (featureName: string) => {
      setExpandedFeatures(prev =>
          prev.includes(featureName)
              ? prev.filter(name => name !== featureName)
              : [...prev, featureName]
      )
    }

    const toggleEpicExpansion = (epicName: string) => {
      setExpandedEpics(prev =>
          prev.includes(epicName)
            ? prev.filter(name => name !== epicName)
              : [...prev, epicName]
      )
    }


    const renderFeature = (feature: Feature, index: number) => (
      <Card key={index} className="mt-4 blueprint-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between blueprint-text">
            <span>{feature.featureName}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleFeatureExpansion(feature.featureName)}
              className="blueprint-button"
            >
              {expandedFeatures.includes(feature.featureName) ? (
                <ChevronDown className="h-4 w-4" />
              ) : (
                <ChevronRight className="h-4 w-4" />
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 blueprint-text">{feature.featureDescription}</p>
          {expandedFeatures.includes(feature.featureName) && (
             <div>
               <h5 className="blueprint-subheading mb-2 mt-6">User Stories:</h5>
               <ul className="space-y-4">
                {feature.userStories.map((story, index) => (
                  <li key={index} className="blueprint-text">
                      <p className="font-semibold mb-2">{story.userStory}</p>
                      <h6 className="blueprint-subheading mb-2 mt-2">Acceptance Criteria</h6>
                      <ul className="list-disc pl-5">
                      {story.acceptanceCriteria.map((criteria, index) => (
                        <li key={index} className="blueprint-text">{criteria}</li>
                        ))}
                    </ul>
                  </li>
                  ))}
               </ul>
             </div>
             )}
        </CardContent>
      </Card>
    );

  const renderEpic = (epic: Epic, index: number) => (
    <Card key={index} className="mt-4 blueprint-card">
        <CardHeader>
        <CardTitle className="flex items-center justify-between blueprint-text">
            <span>{epic.epicName}</span>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleEpicExpansion(epic.epicName)}
                className="blueprint-button"
            >
            {expandedEpics.includes(epic.epicName) ? (
                <ChevronDown className="h-4 w-4" />
                ) : (
                <ChevronRight className="h-4 w-4" />
                )}
            </Button>
        </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="mb-2 blueprint-text">{epic.description}</p>
            {expandedEpics.includes(epic.epicName) && (
              <div>
              <h5 className="blueprint-subheading mb-2 mt-6">User Stories:</h5>
              <ul className="list-disc pl-5 blueprint-text">
                  {epic.userStories.map((story, index) => (
                    <li key={index}>{story}</li>
                    ))}
              </ul>
              <h5 className="blueprint-subheading mb-2 mt-6">Acceptance Criteria:</h5>
               <ul className="list-disc pl-5 blueprint-text">
                  {epic.acceptanceCriteria.map((criteria, index) => (
                    <li key={index}>{criteria}</li>
                    ))}
                </ul>
             </div>
            )}
        </CardContent>
    </Card>
  )


  return (
        <div className="space-y-6">
            <Card className="blueprint-card">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between blueprint-text">
                        <span>Overview</span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleSection('overview')}
                            className="blueprint-button"
                        >
                            {expandedSections.includes('overview') ? (
                                <ChevronDown className="h-4 w-4" />
                            ) : (
                                <ChevronRight className="h-4 w-4" />
                            )}
                        </Button>
                    </CardTitle>
                </CardHeader>
                {expandedSections.includes('overview') && (
                    <CardContent>
                      <h4 className="blueprint-subheading mb-2 mt-2">Product Name</h4>
                        <p className="blueprint-text mb-2">{breakdown.productName}</p>
                      <h4 className="blueprint-subheading mb-2 mt-2">Product Vision</h4>
                         <p className="blueprint-text mb-2">{breakdown.productVision}</p>
                      <h4 className="blueprint-subheading mb-2 mt-2">Target Audience</h4>
                         <p className="blueprint-text mb-2">{breakdown.targetAudience}</p>
                      <h4 className="blueprint-subheading mb-2 mt-2">Problem Statement</h4>
                       <p className="blueprint-text mb-2">{breakdown.problemStatement}</p>
                       <h4 className="blueprint-subheading mb-2 mt-2">Proposed Solution</h4>
                         <p className="blueprint-text pr-8">{breakdown.proposedSolution}</p>
                    </CardContent>
                )}
            </Card>


            <Card className="mt-6 blueprint-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between blueprint-text">
                  <span>Features</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSection('features')}
                    className="blueprint-button"
                  >
                    {expandedSections.includes('features') ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              {expandedSections.includes('features') && (
                <CardContent>
                    {breakdown.features.map((feature, index) => renderFeature(feature, index))}
                </CardContent>
              )}
            </Card>

          <Card className="mt-6 blueprint-card">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between blueprint-text">
                    <span>Epics</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleSection('epics')}
                        className="blueprint-button"
                    >
                     {expandedSections.includes('epics') ? (
                        <ChevronDown className="h-4 w-4" />
                        ) : (
                        <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                    </CardTitle>
                </CardHeader>
               {expandedSections.includes('epics') && (
                  <CardContent>
                     {breakdown.epics.map((epic, index) => renderEpic(epic, index))}
                    </CardContent>
                 )}
            </Card>


              <Card className="mt-6 blueprint-card">
                  <CardHeader>
                  <CardTitle className="flex items-center justify-between blueprint-text">
                        <span>Non-Functional Requirements</span>
                         <Button
                           variant="ghost"
                            size="sm"
                            onClick={() => toggleSection('nfrs')}
                            className="blueprint-button"
                          >
                           {expandedSections.includes('nfrs') ? (
                             <ChevronDown className="h-4 w-4" />
                            ) : (
                           <ChevronRight className="h-4 w-4" />
                        )}
                   </Button>
                   </CardTitle>
                  </CardHeader>
                 {expandedSections.includes('nfrs') && (
                   <CardContent>
                    <div className="space-y-4">
                         {Object.entries(breakdown.nonFunctionalRequirements).map(([key, value]) => (
                           <div key={key} className="space-y-2">
                            <h4 className="blueprint-subheading">{key}</h4>
                               <p className="blueprint-text">{value || 'No specific requirements'}</p>
                          </div>
                       ))}
                       </div>
                   </CardContent>
                 )}
            </Card>
             <Card className="mt-6 blueprint-card">
                <CardHeader>
                    <CardTitle className="flex items-center justify-between blueprint-text">
                      <span>Roadmaps</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSection('roadmaps')}
                           className="blueprint-button"
                        >
                           {expandedSections.includes('roadmaps') ? (
                              <ChevronDown className="h-4 w-4" />
                            ) : (
                             <ChevronRight className="h-4 w-4" />
                         )}
                      </Button>
                   </CardTitle>
               </CardHeader>
                {expandedSections.includes('roadmaps') && (
                    <CardContent className="space-y-4">
                      {Object.entries(breakdown.roadmaps).map(([key, value]) => (
                        <div key={key} className="space-y-2">
                          <h4 className="blueprint-subheading">{key}</h4>
                           <p className="blueprint-text">{value || 'No roadmap available'}</p>
                        </div>
                       ))}
                    </CardContent>
                )}
            </Card>
        </div>
    );
}