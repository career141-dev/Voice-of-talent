export {};

declare global {
  interface Window {
    YT: {
      Player: new (
        container: string | HTMLElement,
        options: {
          width?: string | number;
          height?: string | number;
          videoId: string;
          playerVars?: Record<string, number | string | string[]>;
          events?: {
            onReady?: (event: { target: { playVideo: () => void } }) => void;
            onStateChange?: (event: any) => void;
            onError?: (event: any) => void;
          };
        }
      ) => {
        playVideo: () => void;
        stopVideo: () => void;
        seekTo: (seconds: number) => void;
      };
      PlayerState: {
        UNSTARTED: number;
        ENDED: number;
        PLAYING: number;
        PAUSED: number;
        BUFFERING: number;
        CUED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}
