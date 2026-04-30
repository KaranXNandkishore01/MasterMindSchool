import React, { useState, useEffect } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { X } from 'lucide-react';

// Import all brochure images
import page1 from '../../assets/mmps brochure/mmps1.png';
import page2 from '../../assets/mmps brochure/mmps2.png';
import page3 from '../../assets/mmps brochure/mmps3.png';
import page4 from '../../assets/mmps brochure/mmps4.png';
import page5 from '../../assets/mmps brochure/mmps5.png';
import page6 from '../../assets/mmps brochure/mmps6.png';
import page7 from '../../assets/mmps brochure/mmps7.png';
import page8 from '../../assets/mmps brochure/mmps8.png';
import page9 from '../../assets/mmps brochure/mmps9.png';
import page10 from '../../assets/mmps brochure/mmps10.png';
import page11 from '../../assets/mmps brochure/mmps11.png';
import page12 from '../../assets/mmps brochure/mmps12.png';

const pages = [
  page1, page2, page3, page4, page5, page6, 
  page7, page8, page9, page10, page11, page12
];

const Page = React.forwardRef((props, ref) => {
  return (
    <div className="page" ref={ref}>
      <div className="page-content h-full w-full bg-white shadow-md border border-gray-200">
        <img src={props.image} alt={`Page ${props.number}`} className="w-full h-full object-contain bg-white" />
      </div>
    </div>
  );
});

Page.displayName = 'Page';

const Brochure = () => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    // Basic responsive calculation
    const updateDimensions = () => {
      const isMobile = window.innerWidth < 768;
      // Use standard A4 or brochure proportions roughly (e.g. 1 : 1.414)
      if (isMobile) {
        setDimensions({
          width: window.innerWidth,
          height: window.innerWidth * 1.414
        });
      } else {
        setDimensions({
          width: 500, // width of one page
          height: 707 // 500 * 1.414
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  if (dimensions.width === 0) return null;

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 lg:p-8 relative overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-900 via-gray-900 to-black"></div>
      </div>

      <div className="absolute top-4 right-4 md:top-8 md:right-8 z-50">
        <button 
          onClick={() => window.close()} 
          className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-all backdrop-blur-sm"
          title="Close Brochure"
        >
          <X size={24} />
        </button>
      </div>

      <div className="text-center mb-8 md:mb-12 z-10 relative">
         <h1 className="text-4xl md:text-5xl font-black text-white mb-3 tracking-wider drop-shadow-lg">School Brochure</h1>
         <p className="text-gray-300 text-sm md:text-base bg-black/40 px-6 py-2 rounded-full inline-block backdrop-blur-sm border border-white/10">
           Drag the corners or click the edges to turn pages.
         </p>
      </div>

      <div className="shadow-2xl z-10 relative max-w-[100vw] overflow-hidden rounded-md">
        <HTMLFlipBook 
          width={dimensions.width} 
          height={dimensions.height}
          size="stretch"
          minWidth={300}
          maxWidth={1000}
          minHeight={424}
          maxHeight={1414}
          maxShadowOpacity={0.5}
          showCover={true}
          mobileScrollSupport={true}
          className="flip-book"
        >
          {pages.map((img, index) => (
            <Page key={index} number={index + 1} image={img} />
          ))}
        </HTMLFlipBook>
      </div>
    </div>
  );
};

export default Brochure;
