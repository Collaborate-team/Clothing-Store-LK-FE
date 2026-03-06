"use client";

import { useEffect, useState } from "react";

const carouselItems = [
    "/images/carousel/carousel-1.jpg",
    "/images/carousel/carousel-2.jpg",
    "/images/carousel/carousel-3.jpg",
    "/images/carousel/carousel-4.jpg",
    "/images/carousel/carousel-5.jpg",
];

export default function Carousel() {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setActiveIndex((currentIndex) =>
                currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1,
            );
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    const goToPrevious = () => {
        setActiveIndex((currentIndex) =>
            currentIndex === 0 ? carouselItems.length - 1 : currentIndex - 1,
        );
    };

    const goToNext = () => {
        setActiveIndex((currentIndex) =>
            currentIndex === carouselItems.length - 1 ? 0 : currentIndex + 1,
        );
    };

    return (
        <div id="controls-carousel" className="relative w-full ">
            {/* Carousel wrapper */}
            <div className="relative h-64 overflow-hidden md:h-128">
                {carouselItems.map((item, index) => (
                    <div
                        key={item}
                        className={`${index === activeIndex ? "block" : "hidden"} duration-700 ease-in-out`}
                    >
                        <img
                            src={item}
                            className="absolute left-1/2 top-1/2 block h-full w-full -translate-x-1/2 -translate-y-1/2 object-cover"
                            alt={`Carousel item ${index + 1}`}
                        />

                        {/* Gradient layer to keep text readable on top of photos */}
                        <div className="absolute inset-0 bg-linear-to-r from-black/65 via-black/30 to-transparent" />

                        <div className="absolute inset-0 z-10 flex items-center">
                            <div className="w-full px-6 md:px-16 lg:px-24">
                                <div className="max-w-xl text-white">
                                    <h2 className="text-3xl font-bold leading-tight md:text-5xl">
                                        A dedicated team to grow your company
                                    </h2>
                                    <p className="mt-4 text-sm text-white/90 md:text-lg">
                                        Lorem ipsum dolor sit amet consectetur adipiscing elit mattis sit
                                        phasellus mollis sit aliquam sit nullam neque ultrices.
                                    </p>
                                    <button
                                        type="button"
                                        className="mt-8 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 md:text-base"
                                    >
                                        Explore Collections -&gt;
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Slider controls */}
            <button
                type="button"
                className="absolute inset-s-0 top-0 z-30 flex h-full cursor-pointer items-center justify-center px-4 group focus:outline-none"
                onClick={goToPrevious}
                aria-label="Show previous slide"
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
                onClick={goToNext}
                aria-label="Show next slide"
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
