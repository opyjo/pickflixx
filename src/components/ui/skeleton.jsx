import React from "react";
import { cn } from "../../lib/utils";

const Skeleton = ({ className }) => {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted/60",
        className
      )}
    />
  );
};

export { Skeleton };

