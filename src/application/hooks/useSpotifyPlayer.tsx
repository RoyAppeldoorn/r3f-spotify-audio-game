import { useSession } from "next-auth/react";
import { useEffect, useMemo } from "react";
import { useSpotifyWebSDK } from "./useSpotifyWebSDK";

type SpotifyPlayerProps = {
  onPlayerStateChanged: (e: Spotify.PlaybackState) => void;
  onError: (e: Spotify.Error) => void;
};

export type ErrorState = Spotify.Error & { type: Spotify.ErrorTypes };

export const useSpotifyPlayer = ({
  onPlayerStateChanged,
  onError,
}: SpotifyPlayerProps) => {
  // Retrieves Spotify authToken from current next-auth session
  const { data: session } = useSession();
  const authToken = session?.user.accessToken;

  const isSDKReady = useSpotifyWebSDK();

  const spotifyPlayer = useMemo(
    () =>
      authToken && isSDKReady
        ? new window.Spotify.Player({
            name: "Audiosurf",
            getOAuthToken: (cb) => {
              cb(authToken);
            },
            volume: 0.5,
          })
        : undefined,
    [authToken, isSDKReady]
  );

  useEffect(() => {
    if (!spotifyPlayer) return;

    // automatically transfer Spotify playback to this app (device)
    const onReady = (data: Spotify.WebPlaybackInstance) => {
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
    };

    spotifyPlayer.addListener("player_state_changed", onPlayerStateChanged);
    spotifyPlayer.addListener("ready", onReady);
    spotifyPlayer.addListener("initialization_error", onError);
    spotifyPlayer.addListener("authentication_error", onError);
    spotifyPlayer.addListener("account_error", onError);
    spotifyPlayer.addListener("playback_error", onError);

    // Connect to the spotify player
    spotifyPlayer.connect();

    return () => {
      spotifyPlayer.removeListener(
        "player_state_changed",
        onPlayerStateChanged
      );
      spotifyPlayer.removeListener("ready", onReady);
      spotifyPlayer.removeListener("initialization_error", onError);
      spotifyPlayer.removeListener("authentication_error", onError);
      spotifyPlayer.removeListener("account_error", onError);
      spotifyPlayer.removeListener("playback_error", onError);
      spotifyPlayer.disconnect();
    };
  }, [authToken, onError, onPlayerStateChanged, spotifyPlayer]);

  return {
    player: spotifyPlayer,
    isReady: !!spotifyPlayer,
  };
};
