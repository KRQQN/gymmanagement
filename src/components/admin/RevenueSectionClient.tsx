"use client";

import { RevenueDisplay } from "@/components/admin/RevenueDisplay";
import { RevenueGraphs } from "@/components/admin/RevenueGraphs";

export function RevenueSectionClient() {
  return (
    <>
      <div className="mb-8">
        <RevenueDisplay />
      </div>
      <div className="mb-8">
        <RevenueGraphs />
      </div>
    </>
  );
} 