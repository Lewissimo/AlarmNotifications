// use-sound.d.ts
declare module 'use-sound' {
    type Options = {
      volume?: number;
      playbackRate?: number;
      soundEnabled?: boolean;
      interrupt?: boolean;
      onload?: () => void;
      onend?: () => void;
      onerror?: (error: any) => void;
      onplay?: () => void;
    };
  
    type PlayFunction = (options?: Options) => void;
  
    function useSound(url: string, options?: Options): [PlayFunction];
  
    export default useSound;
  }
  