import ProductCategoryList from "@/components/ui/ProductCategoryList"
import BrandLogoList from "@/components/common/BrandLogoList";


export default function Home() {
    return (
        <main className="min-h-screen w-full">
            <BrandLogoList />
            <ProductCategoryList />
        </main>
    );
}