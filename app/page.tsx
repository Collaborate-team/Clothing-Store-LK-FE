import Carousel from "@/components/ui/carousel";
import CategoryGrid from "@/components/ui/categoryGrid";

export default function Home() {
    return (
        <main className="min-h-screen w-full">
            <Carousel />
            <CategoryGrid />
        </main>
    );
}