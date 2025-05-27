"use client";
import React from "react";
import classNames from "classnames";

interface SkeletonLoaderProps {
  type?: "cart" | "default";
}

const SkeletonLoader = ({ type = "default" }: SkeletonLoaderProps) => {
  const itemCount = type === "cart" ? 3 : 1;

  return (
    <div className="space-y-6 animate-pulse" role="status" aria-live="polite">
      {[...Array(itemCount)].map((_, i) => (
        <div
          key={i}
          className={classNames(
            "rounded-xl p-4 shadow",
            "bg-gray-200 dark:bg-gray-700"
          )}
        >
          <div className="flex items-center space-x-4">
            <div className="h-20 w-20 rounded-lg bg-gray-300 dark:bg-gray-600" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 bg-gray-300 dark:bg-gray-600 rounded" />
              <div className="h-4 w-1/2 bg-gray-300 dark:bg-gray-600 rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
