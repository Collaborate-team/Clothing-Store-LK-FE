import Carousel from "@/components/ui/carousel";
import BrandLogoList from "@/components/common/BrandLogoList";
import CategoryGrid from "@/components/ui/categoryGrid";
import ProductCategoryList from "@/components/ui/ProductCategoryList";

export default function Home() {
    return (
        <main className="min-h-screen w-full">
            <Carousel/>
            <CategoryGrid/>
            <ProductCategoryList/>
            <BrandLogoList />
        </main>
    );
}
