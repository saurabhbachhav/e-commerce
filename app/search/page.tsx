import React, { Suspense } from "react";
import SearchResultPage from "./SearchResultPage";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="w-full min-h-screen flex items-center justify-center">
          <p className="text-lg text-gray-500">Loading search…</p>
        </div>
      }
    >
      <SearchResultPage />
    </Suspense>
  );
}
