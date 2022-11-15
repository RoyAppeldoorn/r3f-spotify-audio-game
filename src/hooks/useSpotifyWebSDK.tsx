import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

type SpotifyPlayerProps = {
  onPlayerStateChanged: (e: Spotify.PlaybackState) => void;
  onError: (e: Spotify.Error) => void;
};

export type ErrorState = Spotify.Error & { type: Spotify.ErrorTypes };

export const useSpotifyWebSDK = ({
  onPlayerStateChanged,
  onError,
}: SpotifyPlayerProps) => {
  // Retrieves Spotify authToken from current next-auth session
  const { data: session } = useSession();
  const authToken = session?.user.accessToken ?? "";

  const [isSpotifyPlayerReady, setIsSpotifyPlayerReady] = useState(false);
  const spotifyPlayer = useRef<Spotify.Player | null>(null);

  useEffect(() => {
    if (spotifyPlayer.current) return;
    if (!authToken) return;

    if (!window.Spotify) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;

      document.head.appendChild(script);
    }

    window.onSpotifyWebPlaybackSDKReady = () => {
      spotifyPlayer.current = new window.Spotify.Player({
        name: "Audiosurf",
        getOAuthToken: (cb) => {
          cb(authToken);
        },
        volume: 0.5,
      });
      setIsSpotifyPlayerReady(true);
    };
  }, [authToken]);

  useEffect(() => {
    if (!isSpotifyPlayerReady || spotifyPlayer.current === null) return;
    const player = spotifyPlayer.current;

    // automatically transfer Spotify playback to this app (device)
    const onReady = (data: Spotify.WebPlaybackInstance) => {
      setTimeout(() => {
        fetch("https://api.spotify.com/v1/me/player", {
          method: "PUT",
          body: JSON.stringify({
            device_ids: [data.device_id],
            play: false,
          }),
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }).catch((e) => console.error(e));
      }, 100);
    };

    player.addListener("player_state_changed", onPlayerStateChanged);
    player.addListener("ready", onReady);
    player.addListener("initialization_error", onError);
    player.addListener("authentication_error", onError);
    player.addListener("account_error", onError);
    player.addListener("playback_error", onError);

    // Connect to the spotify player
    spotifyPlayer.current.connect();

    return () => {
      player.removeListener("player_state_changed", onPlayerStateChanged);
      player.removeListener("ready", onReady);
      player.removeListener("initialization_error", onError);
      player.removeListener("authentication_error", onError);
      player.removeListener("account_error", onError);
      player.removeListener("playback_error", onError);
      player.disconnect();
    };
  }, [authToken, isSpotifyPlayerReady, onError, onPlayerStateChanged]);

  return {
    player: spotifyPlayer.current,
    isReady: isSpotifyPlayerReady,
  };
};
