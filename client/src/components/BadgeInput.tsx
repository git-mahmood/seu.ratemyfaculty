import { useState, KeyboardEvent } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus } from "lucide-react";

interface BadgeInputProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}

export function BadgeInput({ value = [], onChange, placeholder = "Type and press Enter..." }: BadgeInputProps) {
  const [inputValue, setInputValue] = useState("");

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addBadge();
    }
  };

  const addBadge = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
      setInputValue("");
    }
  };

  const removeBadge = (badgeToRemove: string) => {
    onChange(value.filter((badge) => badge !== badgeToRemove));
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button type="button" onClick={addBadge} variant="secondary" size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="flex flex-wrap gap-2 min-h-[2.5rem]">
        {value.length === 0 && (
          <span className="text-sm text-muted-foreground italic self-center">No items added yet.</span>
        )}
        {value.map((badge, idx) => (
          <Badge key={idx} variant="secondary" className="pl-2 pr-1 py-1 text-sm gap-1">
            {badge}
            <button
              type="button"
              onClick={() => removeBadge(badge)}
              className="hover:bg-destructive/10 hover:text-destructive rounded-full p-0.5 transition-colors"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
      </div>
    </div>
  );
}
