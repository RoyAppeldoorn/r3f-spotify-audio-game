import type { NextPage } from "next";
import Head from "next/head";
import { useCallback, useState } from "react";
import { useThemeContext } from "../contexts/ThemeContext";
import { useSpotifyWebSDK } from "../hooks/useSpotifyWebSDK";
import styles from "../styles/Home.module.css";
import { ThemeToggle } from "../ui-components";
import { Navbar } from "../ui-components";

const Home: NextPage = () => {
  const [paused, setPaused] = useState<boolean>();
  const [currentTrack, setCurrentTrack] = useState<Spotify.Track>();
  const { isDarkMode, toggle } = useThemeContext();

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

  const { player, isReady } = useSpotifyWebSDK({
    onPlayerStateChanged,
    onError,
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>Spotify audio game</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <div className={styles.main}>
        <ThemeToggle isDarkMode={isDarkMode} toggle={toggle} />

        {player && isReady && (
          <>
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

            {currentTrack && (
              <>
                <img src={currentTrack.album.images[0].url} alt="" />
                <div>{currentTrack.name}</div>
                <div>{currentTrack.artists[0].name}</div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
