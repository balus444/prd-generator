import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface UserComfortLevelProps {
  value: "Beginner" | "Intermediate" | "Expert";
  onChange: (value: "Beginner" | "Intermediate" | "Expert") => void;
  disabled?: boolean;
}

export default function UserComfortLevel({
  value,
  onChange,
  disabled = false,
}: UserComfortLevelProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      className="grid grid-cols-3 gap-4"
      disabled={disabled}
    >
      {["Beginner", "Intermediate", "Expert"].map((level) => (
        <div key={level} className="relative blueprint-button">
          <Label
            htmlFor={level.toLowerCase()}
            className={cn(
              "flex flex-col space-y-2 rounded-xl p-4 cursor-pointer border-2",
              value === level
                ? "bg-blue-950/50 border-blue-400 shadow-lg"
                : "bg-blue-950/20 hover:bg-blue-950/30 border-transparent"
            )}
          >
            <div className="flex items-center gap-2">
              <RadioGroupItem
                value={level}
                id={level.toLowerCase()}
                className="border-2 border-blue-300"
              />
              <span
                className={cn(
                  "blueprint-text",
                  value === level ? "font-semibold" : "text-blue-300"
                )}
              >
                {level}
              </span>
            </div>
            <span
              className={cn(
                "text-sm",
                value === level ? "text-blue-300" : "text-blue-300/50"
              )}
            >
              {level === "Beginner" && "New to software development"}
              {level === "Intermediate" && "Some development experience"}
              {level === "Expert" && "Experienced developer"}
            </span>
          </Label>
        </div>
      ))}
    </RadioGroup>
  );
}
