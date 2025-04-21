
import React from "react";

const CalculatorDemoVideo = () => {
  return (
    <section className="py-10 md:py-16 bg-background" id="calculator-demo">
      <div className="container mx-auto px-4 md:px-6 flex flex-col items-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4 text-center">
          See how our Calculator works
        </h2>
        <p className="text-md md:text-lg text-muted-foreground mb-8 text-center max-w-xl">
          Watch a quick walkthrough of our carbon calculator in action — calculate emissions from materials, transport, and energy to see your project's full carbon footprint.
        </p>
        {/* Embedded video (replace src with your own video or YouTube link if you want) */}
        <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-lg">
          <div className="aspect-w-16 aspect-h-9 bg-black">
            <iframe
              title="Carbon Calculator Demo"
              src="https://www.youtube.com/embed/7d5l3v06h3U"  {/* Example placeholder video */}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-64 md:h-96"
              style={{ border: "none" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorDemoVideo;

