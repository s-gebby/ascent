import { useEffect } from 'react';

const MotivationalVideo = () => {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://platform.twitter.com/widgets.js';
    script.async = true;
    script.charset = 'utf-8';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div className="flex justify-center items-center w-full h-full">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl">
        <blockquote className="twitter-tweet" data-media-max-width="100%">
          <p lang="en" dir="ltr">
            Watch this at least once a day!<a href="https://t.co/4DuxY6k7dp">pic.twitter.com/4DuxY6k7dp</a>
          </p>
          — luffy (@0xluffyb) <a href="https://twitter.com/0xluffyb/status/1845842750761279627?ref_src=twsrc%5Etfw">October 14, 2024</a>
        </blockquote>
      </div>
    </div>
  );
};

export default MotivationalVideo;