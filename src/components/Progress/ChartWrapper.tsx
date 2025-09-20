"use client";

import { ReactNode } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/Buttons/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

type ChartWrapperProps = {
  title: string;
  description: string;
  isLoading: boolean;
  isError: boolean;
  hasData: boolean;
  noDataMessage: string;
  children: ReactNode;

  // Controls
  timeframe?: "1m" | "3m";
  onTimeframeChange?: (value: "1m" | "3m") => void;
  onPrevious?: () => void;
  onNext?: () => void;
  isPreviousDisabled?: boolean;
  isNextDisabled?: boolean;
  showTimeframeToggle?: boolean;
  customControls?: ReactNode;
};

export function ChartWrapper({
  title,
  description,
  isLoading,
  isError,
  hasData,
  noDataMessage,
  children,
  timeframe,
  onTimeframeChange,
  onPrevious,
  onNext,
  isPreviousDisabled,
  isNextDisabled,
  showTimeframeToggle = true,
  customControls
}: ChartWrapperProps) {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex h-80 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      );
    }
    if (isError) {
      return (
        <div className="flex h-80 items-center justify-center">
          <p className="text-destructive">Error loading chart data.</p>
        </div>
      );
    }
    if (!hasData) {
      return (
        <div className="flex h-80 items-center justify-center">
          <p className="text-muted-foreground">{noDataMessage}</p>
        </div>
      );
    }
    return children;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="grid gap-1">
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            {customControls}
            {showTimeframeToggle && timeframe && onTimeframeChange && (
              <ToggleGroup
                type="single"
                value={timeframe}
                onValueChange={onTimeframeChange}
                aria-label="Select timeframe"
              >
                <ToggleGroupItem value="1m" aria-label="Monthly view">
                  Monthly
                </ToggleGroupItem>
                <ToggleGroupItem value="3m" aria-label="3-month view">
                  3 Months
                </ToggleGroupItem>
              </ToggleGroup>
            )}
            {onPrevious && (
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={isPreviousDisabled}
                onClick={onPrevious}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            {onNext && (
              <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                disabled={isNextDisabled}
                onClick={onNext}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
