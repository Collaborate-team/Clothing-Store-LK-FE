import React, { Suspense } from 'react';
import SingleProductPage from "@/components/pages/SingleProductPage";

export default function ShopPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SingleProductPage />
        </Suspense>
    );
}
