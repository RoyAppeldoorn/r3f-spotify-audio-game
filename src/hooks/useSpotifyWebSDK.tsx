import { useEffect, useState } from "react";

const spotifySDK = new Promise<void>((resolve) => {
  if (typeof window === "undefined") return;
  if (window.Spotify) {
    resolve();
    return;
  }
  window.onSpotifyWebPlaybackSDKReady = resolve;
  const script = document.createElement("script");
  script.src = "https://sdk.scdn.co/spotify-player.js";
  script.async = true;

  document.head.appendChild(script);
});

export const useSpotifyWebSDK = () => {
  const [isSDKReady, setIsSDKReady] = useState(false);
  useEffect(() => {
    spotifySDK.then(() => {
      setIsSDKReady(true);
    });
  }, []);
  return isSDKReady;
};
