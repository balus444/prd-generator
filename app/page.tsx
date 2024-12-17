'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import IdeaBreakdown from '@/components/IdeaBreakdown'
import PRDDisplay from '@/components/PRDDisplay'
import QueryHistory from '@/components/QueryHistory'
import PromptCarousel from '@/components/PromptCarousel'
import LoadingScreen from '@/components/LoadingScreen'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { cn } from '@/lib/utils'


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

interface QueryState {
  productName: string;
  productVision: string;
  targetAudience: string;
  problemStatement: string;
  proposedSolution: string;
  granularity: 'High-Level' | 'Detailed';
  nfrs: NonFunctionalRequirements;
  techStack: string;
  apis: string;
  dataModel: string;
  kpis: string;
  breakdown: Breakdown | null;
}

export default function Home() {
  const [currentQuery, setCurrentQuery] = useState<QueryState>({
    productName: '',
    productVision: '',
    targetAudience: '',
    problemStatement: '',
    proposedSolution: '',
    granularity: 'High-Level',
    nfrs: {},
    techStack: '',
    apis: '',
    dataModel: '',
    kpis: '',
    breakdown: null
  })
  const [queryHistory, setQueryHistory] = useState<QueryState[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)


    const nfrOptions = [
      { id: 'performance', label: 'Performance' },
      { id: 'scalability', label: 'Scalability' },
      { id: 'security', label: 'Security' },
      { id: 'usability', label: 'Usability' },
      { id: 'reliability', label: 'Reliability' },
      { id: 'maintainability', label: 'Maintainability' },
    ];


    const handleNFRChange = (id: string, checked: boolean) => {
      setCurrentQuery((prev) => {
        const newNfrs = { ...prev.nfrs };
        if (checked) {
          newNfrs[id] = ''; // Initialize with a placeholder, will be updated when user puts input in text field.
        } else {
          delete newNfrs[id];
        }

        return { ...prev, nfrs: newNfrs };
      });
    };


    const handleNFRDescriptionChange = (id: string, value: string) => {
      setCurrentQuery((prev) => ({
        ...prev,
        nfrs: { ...prev.nfrs, [id]: value },
      }));
    };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault()
    }
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentQuery)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process the PRD')
      }
       if (!data || typeof data !== 'object' || !data.productName) {
        throw new Error('Invalid response from server')
      }

      const newQueryState = {
        ...currentQuery,
        breakdown: data
      }
      setCurrentQuery(newQueryState)
      setQueryHistory(prev => [...prev, newQueryState])
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleNavigateToQuery = (index: number) => {
    setCurrentQuery(queryHistory[index])
  }

   const handlePromptSelect = async (prompt: string) => {
       const newQuery = {
           productName: prompt,
           productVision: '',
           targetAudience: '',
           problemStatement: '',
           proposedSolution: '',
           granularity: 'High-Level',
           nfrs: {},
           techStack: '',
           apis: '',
           dataModel: '',
           kpis: '',
           breakdown: null
      }

    setCurrentQuery(newQuery)
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/breakdown', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newQuery)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process the PRD')
      }

      if (!data || typeof data !== 'object' || !data.productName) {
        throw new Error('Invalid response from server')
      }

       const newQueryState = {
          ...newQuery,
          breakdown: data
       }

      setCurrentQuery(newQueryState)
      setQueryHistory(prev => [...prev, newQueryState])
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 flex-grow flex items-center justify-center">
        <div className="w-full max-w-4xl">
          <Card className="p-12 blueprint-card">
            <h1 className="text-3xl font-bold mb-4 blueprint-title">PRD Generator</h1>
            <p className="blueprint-text mb-8">Have an idea? Get a detailed PRD and start building!</p>

            <div className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                          type="text"
                          id="productName"
                          value={currentQuery.productName}
                          onChange={(e) => setCurrentQuery(prev => ({ ...prev, productName: e.target.value }))}
                          placeholder="Name of the product"
                          disabled={isLoading}
                        className="w-full blueprint-input border border-2"
                        />
                    </div>
                    <div>
                        <Label htmlFor="productVision">Product Vision</Label>
                         <Input
                          type="text"
                          id="productVision"
                          value={currentQuery.productVision}
                          onChange={(e) => setCurrentQuery(prev => ({ ...prev, productVision: e.target.value }))}
                          placeholder="Vision for the product"
                        disabled={isLoading}
                          className="w-full blueprint-input border border-2"
                        />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                     <div>
                      <Label htmlFor="targetAudience">Target Audience</Label>
                      <Input
                        type="text"
                         id="targetAudience"
                        value={currentQuery.targetAudience}
                        onChange={(e) => setCurrentQuery(prev => ({ ...prev, targetAudience: e.target.value }))}
                         placeholder="Who is this product for?"
                        disabled={isLoading}
                        className="w-full blueprint-input border border-2"
                      />
                    </div>
                      <div>
                       <Label htmlFor="problemStatement">Problem Statement</Label>
                        <Input
                          type="text"
                          id="problemStatement"
                         value={currentQuery.problemStatement}
                           onChange={(e) => setCurrentQuery(prev => ({ ...prev, problemStatement: e.target.value }))}
                           placeholder="What problem does this solve?"
                         disabled={isLoading}
                         className="w-full blueprint-input border border-2"
                        />
                      </div>
                </div>
                  <div>
                    <Label htmlFor="proposedSolution">Proposed Solution</Label>
                   <Textarea
                     id="proposedSolution"
                     value={currentQuery.proposedSolution}
                     onChange={(e) => setCurrentQuery(prev => ({ ...prev, proposedSolution: e.target.value }))}
                     placeholder="How does this product address the problem"
                    disabled={isLoading}
                     className="w-full blueprint-input border border-2"
                   />
                </div>
                <div>
                <Label> Granularity Level </Label>
                  <div className="flex items-center space-x-4">
                      <Button
                        type="button"
                        variant={currentQuery.granularity === 'High-Level' ? 'default' : 'outline'}
                         onClick={() => setCurrentQuery(prev => ({ ...prev, granularity: 'High-Level' }))}
                          disabled={isLoading}
                      >
                      High-Level
                      </Button>
                      <Button
                          type="button"
                          variant={currentQuery.granularity === 'Detailed' ? 'default' : 'outline'}
                         onClick={() => setCurrentQuery(prev => ({ ...prev, granularity: 'Detailed' }))}
                           disabled={isLoading}
                      >
                       Detailed
                      </Button>
                 </div>
                </div>

                  <div>
                      <Label>Non-Functional Requirements</Label>
                      <div className="space-y-2 mt-2">
                       {nfrOptions.map((option) => (
                           <div key={option.id} className="flex items-center space-x-2">
                              <Checkbox
                                id={option.id}
                                checked={!!currentQuery.nfrs[option.id]}
                                onCheckedChange={(checked) => handleNFRChange(option.id, !!checked)}
                              />
                              <Label htmlFor={option.id}>{option.label}</Label>
                              {currentQuery.nfrs[option.id] !== undefined && (
                                <Input
                                  type="text"
                                  placeholder={`Enter description for ${option.label}`}
                                  value={currentQuery.nfrs[option.id]}
                                  onChange={(e) => handleNFRDescriptionChange(option.id, e.target.value)}
                                  disabled={isLoading}
                                  className="blueprint-input border border-2"
                                />
                            )}
                         </div>
                        ))}
                     </div>
                  </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <Label htmlFor="techStack">Tech Stack</Label>
                      <Input
                        type="text"
                        id="techStack"
                       value={currentQuery.techStack}
                        onChange={(e) => setCurrentQuery(prev => ({ ...prev, techStack: e.target.value }))}
                       placeholder="e.g., React, Node.js, PostgreSQL"
                         disabled={isLoading}
                         className="w-full blueprint-input border border-2"
                      />
                  </div>
                    <div>
                      <Label htmlFor="apis">APIs</Label>
                       <Input
                         type="text"
                         id="apis"
                         value={currentQuery.apis}
                        onChange={(e) => setCurrentQuery(prev => ({ ...prev, apis: e.target.value }))}
                        placeholder="List any API requirements"
                        disabled={isLoading}
                          className="w-full blueprint-input border border-2"
                      />
                    </div>
                </div>

                <div>
                  <Label htmlFor="dataModel">Data Model</Label>
                    <Input
                      type="text"
                      id="dataModel"
                      value={currentQuery.dataModel}
                      onChange={(e) => setCurrentQuery(prev => ({ ...prev, dataModel: e.target.value }))}
                      placeholder="High-level data model description"
                      disabled={isLoading}
                      className="w-full blueprint-input border border-2"
                    />
                </div>

                   <div>
                    <Label htmlFor="kpis">Success Metrics</Label>
                     <Input
                       type="text"
                       id="kpis"
                       value={currentQuery.kpis}
                       onChange={(e) => setCurrentQuery(prev => ({ ...prev, kpis: e.target.value }))}
                       placeholder="Key performance indicators"
                       disabled={isLoading}
                       className="w-full blueprint-input border border-2"
                     />
                   </div>

                <Button
                  type="submit"
                  disabled={isLoading || !currentQuery.productName.trim()}
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
              <Alert variant="destructive" className="mt-4 border border-2 border-blue-200 bg-blue-50/50 text-blue-900">
                <AlertDescription className="font-medium">⚠️ {error}</AlertDescription>
              </Alert>
            )}

            {currentQuery.breakdown && (
              <div className="mt-8">
                 <QueryHistory
                    history={queryHistory.map(q => ({ idea: q.productName, focusArea: null }))}
                    currentIndex={queryHistory.length - 1}
                    onSelect={handleNavigateToQuery}
                />
                <IdeaBreakdown
                   breakdown={currentQuery.breakdown}
                 />
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
          floguo 2024 • {' '}
          <a
            href="https://x.com/floguo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            Twitter
          </a>
          {' '} • {' '}
          <a
            href="https://github.com/floguo"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:opacity-80 transition-opacity"
          >
            GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}