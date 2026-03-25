"use client";

import { useSearchParams } from "next/navigation";
import ViewAllProducts from "@/components/pages/ViewAllProducts";

export default function ShopPage() {
  const searchParams = useSearchParams();
  const category = searchParams.get("category") || "ALL ITEMS";

  return <ViewAllProducts initialCategory={category} />;
}
