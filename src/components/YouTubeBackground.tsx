'use client';

interface YouTubeBackgroundProps {
  videoId: string;
}

export default function YouTubeBackground({ videoId }: YouTubeBackgroundProps) {
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&modestbranding=1&rel=0&loop=1&playlist=${videoId}`}
        title="Background Video"
        allow="autoplay"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}
