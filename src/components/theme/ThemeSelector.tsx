
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTheme } from "./ThemeProvider";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeSelector() {
  const { theme, setTheme, themes } = useTheme();
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-9 w-9 rounded-md">
          <Palette className="h-4 w-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-3">
        <div className="space-y-1">
          <p className="text-sm font-medium">Appearance</p>
          <p className="text-xs text-muted-foreground mb-2">
            Select your preferred theme
          </p>
          <div className="grid grid-cols-3 gap-2">
            {themes.map((t) => (
              <Button
                key={t.name}
                variant="outline"
                size="sm"
                onClick={() => setTheme(t.name)}
                className={cn(
                  "justify-start px-2 py-6 h-auto flex-col items-center gap-2",
                  theme === t.name && "border-2 border-primary"
                )}
              >
                <div className={cn("h-5 w-5 rounded-full border", t.colorClass)} />
                <span className="text-xs">{t.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
