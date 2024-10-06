import { useState, useEffect } from 'react';

const MotivationalVideo = () => {
  const [videoId, setVideoId] = useState('');

  const videoIds = [
    'OZDtRaksV9Q',
    'NAgEx_jg5-k',
    'oOEUCXoi6eA',
    'ODF7qHx9QcU',
    'u9Jl5Tc8QkQ',
    '5GWyYj9dqNI',
    'dhjiUlenL6k',
    '-vj2PMLbZjw',
    'ZBCW9IYgAEQ',
    '0hZJwQlM_L0',
    'SvPo3w3hgdg',
    'HdHs2ftS07g',
    'fXbKOs2cozU',
    'lc8ourcIe10',
    's_dgltP5SF4',
    '2ADaU9EXFzI',
    'IdTMDpizis8',
    'VSceuiPBpxY',
    'k9zTr2MAFRg',
]

  const fetchVideo = () => {
    const randomIndex = Math.floor(Math.random() * videoIds.length);
    setVideoId(videoIds[randomIndex]);
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  return (
    <div>
      <div className="aspect-w-16 aspect-h-9 h-96">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="Motivational Video"
          className="w-full h-full"
        ></iframe>
      </div>
    </div>
  );
};

export default MotivationalVideo;
