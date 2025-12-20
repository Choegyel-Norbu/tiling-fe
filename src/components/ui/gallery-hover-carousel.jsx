import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import { Card } from "./card";
import { Button } from "./Button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "./carousel";
import { Link } from "react-router-dom";


export default function GalleryHoverCarousel({
  heading = "Featured Projects",
  items = [],
}) {
  const [carouselApi, setCarouselApi] = useState();
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  // Carousel scroll tracking logic needs to be adapted for the custom carousel component
  // The provided carousel component might expose API differently or we need to bridge it.
  // For simplicity in this adaptation, we'll implement basic prev/next controls if the API supports it.
  
  // Note: The custom carousel implementation provided earlier uses context and doesn't explicitly expose
  // an imperative API object like shadcn/embla-carousel does in the same way. 
  // However, we added a 'setApi' shim in the Carousel component to support this pattern roughly.
  
  useEffect(() => {
    if (!carouselApi) return;
    
    // Initial check
    setCanScrollPrev(carouselApi.canScrollPrev());
    setCanScrollNext(carouselApi.canScrollNext());

    // Mock event listener for selection change if supported
    const onSelect = () => {
       setCanScrollPrev(carouselApi.canScrollPrev());
       setCanScrollNext(carouselApi.canScrollNext());
    };

    if(carouselApi.on) carouselApi.on("select", onSelect);
    
    return () => {
        if(carouselApi.off) carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  return (
    <section className="py-24 bg-slate-50">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-col justify-between md:mb-14 md:flex-row md:items-end lg:mb-16">
          <div className="max-w-2xl mx-auto md:mx-0 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 leading-relaxed">
             {heading}{" "}
             <span className="text-slate-500 text-lg block mt-2 font-normal">
               Explore our collection of innovative solutions and masterfully crafted spaces designed to transform your home.
             </span>
            </h3>
          </div>
          <div className="flex gap-2 mt-4 md:mt-0">
            <Button
              variant="outline"
              size="icon"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="h-10 w-10 rounded-full bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext} // In a real infinite carousel this might always be true
              className="h-10 w-10 rounded-full bg-white border-slate-200 hover:bg-slate-50 text-slate-700"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <div className="w-full max-w-full overflow-hidden">
          <Carousel
            setApi={setCarouselApi}
            className="relative w-full max-w-full"
          >
            <CarouselContent className="flex w-full">
              {items.map((item) => (
                <CarouselItem key={item.id} className="min-w-0 shrink-0 grow-0 basis-full md:basis-1/2 lg:basis-1/3 pl-4">
                  <Link to={item.url} className="group block relative w-full h-[300px] md:h-[400px]">
                    <Card className="overflow-hidden h-full w-full rounded-3xl border-0 shadow-lg">
                      {/* Image */}
                      <div className="relative h-full w-full transition-all duration-500 group-hover:h-1/2">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="h-full w-full object-cover object-center"
                        />
                        {/* Fade overlay at bottom */}
                        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>

                      {/* Text Section */}
                      <div className="absolute bottom-0 left-0 w-full h-1/2 px-6 py-8 flex flex-col justify-center bg-white transition-all duration-500 translate-y-full group-hover:translate-y-0 opacity-0 group-hover:opacity-100">
                        <h3 className="text-xl font-bold text-slate-900 mb-2">{item.title}</h3>
                        <p className="text-slate-600 text-sm md:text-base line-clamp-3 mb-4">
                          {item.summary}
                        </p>
                        <div className="mt-auto flex justify-end">
                            <Button
                            variant="outline"
                            size="icon"
                            className="rounded-full border-slate-200 text-accent hover:text-accent hover:border-accent hover:bg-accent/5 transition-colors"
                            >
                            <ArrowRight className="h-4 w-4" />
                            </Button>
                        </div>
                      </div>
                      
                      {/* Default Title Overlay (visible when not hovering) */}
                      <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent transition-opacity duration-300 group-hover:opacity-0">
                          <p className="text-white font-bold text-xl">{item.title}</p>
                      </div>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  );
}

