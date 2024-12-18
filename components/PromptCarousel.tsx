"use client";

import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  BookText,
  ListChecks,
  KanbanSquare,
  LayoutDashboard,
  Rocket,
  BrainCog,
} from "lucide-react";

interface Prompt {
  id: string;
  icon: React.ReactNode;
  text: string;
  vision: string;
  targetAudience: string;
  problemStatement: string;
}

const topRowPrompts: Prompt[] = [
  {
    id: "1",
    icon: <BookText className="w-4 h-4" />,
    text: "E-commerce platform",
    vision:
      "Create a seamless online shopping experience that connects buyers with sellers",
    targetAudience: "Small to medium-sized businesses and online shoppers",
    problemStatement:
      "Traditional retail businesses struggle to establish online presence and reach customers digitally",
  },
  {
    id: "2",
    icon: <ListChecks className="w-4 h-4" />,
    text: "Project management tool",
    vision: "Streamline project workflows and enhance team collaboration",
    targetAudience: "Project managers and distributed teams",
    problemStatement:
      "Teams lack efficient tools to manage projects and track progress in remote work environments",
  },
  {
    id: "3",
    icon: <KanbanSquare className="w-4 h-4" />,
    text: "Task management application",
    vision: "Enhance productivity and collaboration through task management",
    targetAudience: "Project managers and distributed teams",
    problemStatement:
      "Teams struggle to manage tasks and track progress in remote work environments",
  },
  {
    id: "4",
    icon: <LayoutDashboard className="w-4 h-4" />,
    text: "Analytics dashboard",
    vision: "Gain insights and make data-driven decisions",
    targetAudience: "Business owners and data analysts",
    problemStatement:
      "Limited access to data analytics tools and difficulty in interpreting data",
  },
  { id: "5", icon: <Rocket className="w-4 h-4" />, text: "Mobile game app" },
  {
    id: "6",
    icon: <BrainCog className="w-4 h-4" />,
    text: "AI-powered chatbot",
    vision:
      "Enhance customer engagement and support through AI-powered chatbots",
    targetAudience: "Customer service teams and end-users",
    problemStatement:
      "Limited access to AI-powered chatbot platforms and difficulty in integrating them into customer support",
  },
];

const bottomRowPrompts: Prompt[] = [
  {
    id: "7",
    icon: <BookText className="w-4 h-4" />,
    text: "Online learning platform",
    vision: "Democratize education through accessible online learning",
    targetAudience: "Students, educators, and lifelong learners",
    problemStatement:
      "Limited access to quality education and difficulty in finding relevant courses",
  },
  {
    id: "8",
    icon: <ListChecks className="w-4 h-4" />,
    text: "Customer relationship management (CRM) system",
    vision: "Enhance customer relationships and improve sales through CRM",
    targetAudience: "Sales teams and customer service teams",
    problemStatement:
      "Limited access to CRM platforms and difficulty in integrating them into sales and customer service",
  },
  {
    id: "9",
    icon: <KanbanSquare className="w-4 h-4" />,
    text: "Social media marketing tool",
    vision:
      "Increase brand awareness and engagement through social media marketing",
    targetAudience: "Marketing teams and social media managers",
    problemStatement:
      "Limited access to social media marketing tools and difficulty in creating effective social media campaigns",
  },
  {
    id: "10",
    icon: <LayoutDashboard className="w-4 h-4" />,
    text: "Personal finance app",
    vision:
      "Manage personal finances effectively through a personal finance app",
    targetAudience: "Individuals and families",
    problemStatement:
      "Limited access to personal finance apps and difficulty in managing personal finances",
  },
  {
    id: "11",
    icon: <Rocket className="w-4 h-4" />,
    text: "Healthcare mobile app",
    vision:
      "Improve healthcare accessibility and quality through a healthcare mobile app",
    targetAudience: "Healthcare professionals and patients",
    problemStatement:
      "Limited access to healthcare mobile apps and difficulty in accessing healthcare services",
  },
  {
    id: "12",
    icon: <BrainCog className="w-4 h-4" />,
    text: "AI-powered recommendation engine",
    vision:
      "Enhance user experience and increase sales through AI-powered recommendation engines",
    targetAudience: "Online retailers and consumers",
    problemStatement:
      "Limited access to AI-powered recommendation engines and difficulty in implementing them into online retail",
  },
];

interface PromptCarouselProps {
  onPromptSelect: (prompt: Prompt) => void;
}

export default function PromptCarousel({
  onPromptSelect,
}: PromptCarouselProps) {
  const [topRowOffset, setTopRowOffset] = useState(0);
  const [bottomRowOffset, setBottomRowOffset] = useState(0);
  const topRowRef = useRef<HTMLDivElement>(null);
  const bottomRowRef = useRef<HTMLDivElement>(null);
  const [isTopRowPaused, setIsTopRowPaused] = useState(false);
  const [isBottomRowPaused, setIsBottomRowPaused] = useState(false);

  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = 0;

    const animate = (timestamp: number) => {
      if (lastTimestamp === 0) {
        lastTimestamp = timestamp;
      }

      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      if (!isTopRowPaused && topRowRef.current) {
        setTopRowOffset((prevOffset) => {
          const newOffset =
            (prevOffset + 0.02 * deltaTime) %
            (topRowRef.current!.scrollWidth / 2);
          return newOffset;
        });
      }
      if (!isBottomRowPaused && bottomRowRef.current) {
        setBottomRowOffset((prevOffset) => {
          const newOffset =
            (prevOffset -
              0.02 * deltaTime +
              bottomRowRef.current!.scrollWidth / 2) %
            (bottomRowRef.current!.scrollWidth / 2);
          return newOffset;
        });
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isTopRowPaused, isBottomRowPaused]);

  const handlePromptClick = (prompt: Prompt) => {
    onPromptSelect(prompt);
  };

  return (
    <div className="relative w-full overflow-hidden py-4 mb-6 rounded-md ">
      <div className="flex flex-col gap-4">
        <div className="relative overflow-hidden">
          <div
            ref={topRowRef}
            className="flex gap-4 whitespace-nowrap"
            style={{ transform: `translateX(-${topRowOffset}px)` }}
            onMouseEnter={() => setIsTopRowPaused(true)}
            onMouseLeave={() => setIsTopRowPaused(false)}
          >
            {[...topRowPrompts, ...topRowPrompts].map((prompt, index) => (
              <Button
                key={`${prompt.id}-${index}`}
                variant="outline"
                className="flex items-center gap-2 whitespace-nowrap blueprint-button"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt.icon}
                <span className="blueprint-text">{prompt.text}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="relative overflow-hidden">
          <div
            ref={bottomRowRef}
            className="flex gap-4 whitespace-nowrap"
            style={{ transform: `translateX(-${bottomRowOffset}px)` }}
            onMouseEnter={() => setIsBottomRowPaused(true)}
            onMouseLeave={() => setIsBottomRowPaused(false)}
          >
            {[...bottomRowPrompts, ...bottomRowPrompts].map((prompt, index) => (
              <Button
                key={`${prompt.id}-${index}`}
                variant="outline"
                className="flex items-center gap-2 whitespace-nowrap blueprint-button"
                onClick={() => handlePromptClick(prompt)}
              >
                {prompt.icon}
                <span className="blueprint-text">{prompt.text}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>

      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-[#1e3a8a] to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-[#1e3a8a] to-transparent pointer-events-none" />
    </div>
  );
}
