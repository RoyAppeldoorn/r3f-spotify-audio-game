import type { NextPage } from "next";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useSpotifyPlayer } from "../application/hooks/useSpotifyPlayer";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const [paused, setPaused] = useState<boolean>();
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track>();

  const onPlayerStateChanged = useCallback((state: Spotify.PlaybackState) => {
    if (!state) {
      return;
    }
    setPaused(state.paused);
    setCurrentTrack(state.track_window.current_track);
  }, []);

  const onError = useCallback((e: Spotify.Error) => {
    console.log(e.message);
  }, []);

  const { player } = useSpotifyPlayer({
    onPlayerStateChanged,
    onError,
  });

  if (!currentTrack) {
    return <div>Start a song from your spotify client</div>;
  }

  return (
    <div className={styles.container}>
      <Image
        src={currentTrack.album.images[0].url}
        priority={true}
        alt=""
        width={250}
        height={250}
      />
      <div>{currentTrack.name}</div>
      <div>{currentTrack.artists[0].name}</div>

      <div>
        <button
          onClick={async () => {
            await player?.previousTrack();
          }}
        >
          &lt;&lt;
        </button>
        <button
          onClick={async () => {
            await player?.togglePlay();
          }}
        >
          {paused ? "PLAY" : "PAUSE"}
        </button>
        <button
          onClick={async () => {
            await player?.nextTrack();
          }}
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
};

export default Home;
