import ProductCategoryList from "@/components/ui/ProductCategoryList"
import BrandLogoList from "@/components/common/BrandLogoList";
import Footer from "@/components/common/Footer";
import ContactUsForm from "@/components/pages/ContactUsForm";


export default function Home() {
    return (
        <main className="min-h-screen w-full">
            <BrandLogoList />
            <ProductCategoryList />
            <Footer />
            <ContactUsForm />
        </main>
    );
}