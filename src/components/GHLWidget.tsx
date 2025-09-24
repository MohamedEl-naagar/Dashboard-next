'use client';

import { useEffect } from 'react';

export default function GHLWidget() {
  useEffect(() => {
    // Load the GHL widget script
    const script = document.createElement('script');
    script.src = 'https://widgets.leadconnectorhq.com/loader.js';
    script.setAttribute('data-resources-url', 'https://widgets.leadconnectorhq.com/chat-widget/loader.js');
    script.setAttribute('data-widget-id', '68c54621fa0aac6637791517');
    script.async = true;

    document.head.appendChild(script);

    // Cleanup function to remove script when component unmounts
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="w-full h-full min-h-[450px] flex items-center justify-center">
      <div
        data-chat-widget
        data-widget-id="68c54621fa0aac6637791517"
        data-location-id="7NgnhFiOKZT0uLHtKnwZ"
        className="w-full h-full min-h-[450px] scale-175 origin-center"
        style={{
          transform: 'scale(1.75)',
          transformOrigin: 'center center'
        }}
      />
    </div>
  );
}
