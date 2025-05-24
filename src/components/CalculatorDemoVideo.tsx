
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
        
        {/* Fixed video container with proper Edge browser support */}
        <div className="w-full max-w-2xl rounded-lg overflow-hidden shadow-lg">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
            <iframe
              title="Carbon Calculator Demo"
              src="https://www.youtube.com/embed/do1AHeLpAsw"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full border-0 rounded-lg"
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                borderRadius: '0.5rem'
              }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CalculatorDemoVideo;
