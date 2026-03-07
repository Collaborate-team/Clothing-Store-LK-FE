import ProductCategoryList from "@/components/ui/ProductCategoryList"
import BrandLogoList from "@/components/common/BrandLogoList";
import Footer from "@/components/common/Footer";


export default function Home() {
    return (
        <main className="min-h-screen w-full">
            <BrandLogoList />
            <ProductCategoryList />
            <Footer />
        </main>
    );
}