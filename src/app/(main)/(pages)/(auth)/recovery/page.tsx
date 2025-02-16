"use client";

import RecoveryConfirm from "@/components/RecoveryConfirm";
import { Suspense } from "react";

const RecoveryHomePage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <RecoveryConfirm />
    </div>
  );
};

const RecoveryPage = () => {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <RecoveryHomePage />
    </Suspense>
  );
};

export default RecoveryPage;

