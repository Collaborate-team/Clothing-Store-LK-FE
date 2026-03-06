const carouselItems = [
    "/docs/images/carousel/carousel-1.svg",
    "/docs/images/carousel/carousel-2.svg",
    "/docs/images/carousel/carousel-3.svg",
    "/docs/images/carousel/carousel-4.svg",
    "/docs/images/carousel/carousel-5.svg",
];

export default function Carousel() {
    return (
        <div id="controls-carousel" className="relative w-full" data-carousel="static">
            {/* Carousel wrapper */}
            <div className="relative h-56 overflow-hidden rounded-base md:h-96">
                {carouselItems.map((item, index) => (
                    <div
                        key={item}
                        className="hidden duration-700 ease-in-out"
                        data-carousel-item={index === 1 ? "active" : ""}
                    >
                        <img
                            src={item}
                            className="absolute left-1/2 top-1/2 block w-full -translate-x-1/2 -translate-y-1/2"
                            alt={`Carousel item ${index + 1}`}
                        />
                    </div>
                ))}
            </div>

            {/* Slider controls */}
            <button
                type="button"
                className="absolute inset-s-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 group focus:outline-none"
                data-carousel-prev
            >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-base bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70">
                    <svg
                        className="h-5 w-5 text-white rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m15 19-7-7 7-7"
                        />
                    </svg>
                    <span className="sr-only">Previous</span>
                </span>
            </button>

            <button
                type="button"
                className="absolute inset-e-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 group focus:outline-none"
                data-carousel-next
            >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-base bg-white/30 group-hover:bg-white/50 group-focus:outline-none group-focus:ring-4 group-focus:ring-white dark:bg-gray-800/30 dark:group-hover:bg-gray-800/60 dark:group-focus:ring-gray-800/70">
                    <svg
                        className="h-5 w-5 text-white rtl:rotate-180"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m9 5 7 7-7 7"
                        />
                    </svg>
                    <span className="sr-only">Next</span>
                </span>
            </button>
        </div>
    );
}
