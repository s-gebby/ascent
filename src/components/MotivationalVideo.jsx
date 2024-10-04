import { useState, useEffect } from 'react';

const MotivationalVideo = () => {
  const [videoId, setVideoId] = useState('');

  const videoIds = ['E0MHHWCC1j4',
    'TInB_CShwWI',
    '9pBZjCUq5EQ',
    'ex7c-kcfeXk',
    '9kol1-legXI',
    '7sxpKhIbr0E',
    'v1ojZKWfShQ',
    'w-HYZv6HzAs',
    '80UVjkcxGmA',
    '9vqOmiM9PyM',
    'B5q9hCbga44',
    'fLeJJPxua3E',
    'b-Pn0yXL9y8',
    '7UGTvERKcwM',
    'XGKn3u5xwgM',
    '1q_PpE_M8bo',
    'Nn0bZ0hBzCw',
    'w3B3sKs8dvM',
    'Fm0G-4DEIuM',
    'dTRBnHtHehQ',
    '71Il_7aWnrQ',
    'fia4HY9pWuo',
    'lPQN83HVz4U',
    'ndZcH-Ze738',
    'XENzRS11Maw',
    'TJg9wd8agQY',
    '5xbADDvciko',
    'mAL03fAQZQk'
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
