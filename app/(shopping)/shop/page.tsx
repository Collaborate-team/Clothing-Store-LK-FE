"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ViewAllProducts from "@/components/pages/ViewAllProducts";

function ShopPageContent() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "ALL ITEMS";

  return <ViewAllProducts initialCategory={category} />;
}

export default function ShopPage() {
  return (
    <Suspense fallback={<ViewAllProducts initialCategory="ALL ITEMS" />}>
      <ShopPageContent />
    </Suspense>
  );
}
