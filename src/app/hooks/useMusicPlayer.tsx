import {useEffect, useState, useCallback} from 'react';
import TrackPlayer, {
  State,
  Event,
  useTrackPlayerEvents,
  useProgress,
  Track,
} from 'react-native-track-player';
import {MusicStoreState, useMusicStore} from '../zustand/store';

interface Props {
  track: Track[];
}

// Subscribing to the following events inside MyComponent
const events: Event[] = [Event.PlaybackState, Event.PlaybackError];

// Custom hook to control music playback using react-native-track-player
const useMusicPlayer = ({track}: Props) => {
  // Save and update the current player state
  const [playerState, setPlayerState] = useState<State>(State.None);
  const [currentTrack, setCurrentTrack] = useState<Track | undefined>(
    {} as Track,
  );

  // Update tracks in zustand store
  const updateCurrentStoreTrack = useMusicStore(
    (state: MusicStoreState) => state.setCurrentlyPlayingTrack,
  );

  // Update store state
  const updatePlayerState = useMusicStore(
    (state: MusicStoreState) => state.setPlayerState,
  );

  // Set currently playing track
  const fetchCurrentTrack = useCallback(
    async () =>
      await TrackPlayer.getActiveTrack().then(response => {
        setCurrentTrack(response);
        updateCurrentStoreTrack(response ?? ({} as Track));
      }),
    [updateCurrentStoreTrack],
  );

  useEffect(() => {
    fetchCurrentTrack();
  }, [playerState, fetchCurrentTrack]);

  // Play the current track
  const play = async () => {
    await TrackPlayer.play();
  };

  // Pause the current track
  const pause = () => TrackPlayer.pause();

  // Reset the player, clearing the queue and stopping playback
  const reset = () => TrackPlayer.reset();

  // Seek to a specific position in the current track
  const seekTo = (duration: number) => TrackPlayer.seekTo(duration);

  // Skip to a specific track in the queue by its index
  const skipToTrack = async (trackIndex: number) =>
    await TrackPlayer.skip(trackIndex);

  // Skip to the next track in the queue
  const skipToNext = async () => await TrackPlayer.skipToNext();

  // Skip to the previous track in the queue
  const skipToPrevious = async () => await TrackPlayer.skipToPrevious();

  // Handle Player current state
  useTrackPlayerEvents(events, event => {
    if (event.type === Event.PlaybackError) {
      console.warn('An error occured while playing the current track.');
    }
    if (event.type === Event.PlaybackState) {
      setPlayerState(event.state);
      updatePlayerState(event.state);
    }
  });

  // Get the current player progress
  const {position, buffered, duration} = useProgress();

  // Stop track from playing
  const stop = async () => await TrackPlayer.stop();

  // Remove track from queue
  const removeTrack = async () =>
    await TrackPlayer.remove(0).then(async () => [
      await TrackPlayer.removeUpcomingTracks(),
    ]);

  // Check if music player is playing
  const isPlaying = playerState === State.Playing;

  // Check if music player is paused
  const isPaused = playerState === State.Paused;

  // Check if music player is paused
  const isStopped = playerState === State.None || playerState === State.Stopped;

  const handlePauseAndPlayTrack = async () => {
    if (!track) {
      return;
    } // Exit early if there is no track
    const isCurrentTrack = currentTrack?.id === track[0]?.id;
    // If it's the current track and it's playing, just pause it.
    if (isCurrentTrack && isPlaying) {
      pause();
      return;
    }
    // If it's the current track and it's paused, resume playing.
    if (isCurrentTrack && isPaused) {
      play();
      return;
    }
    // For cases where it's either stopped or a different track, reset and add the new/current track, then play.
    // This includes the scenario where it's the current track but not playing or paused (e.g., it's loading).
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    play();
  };

  // Return all the control functions to be used by the component
  return {
    play,
    pause,
    reset,
    seekTo,
    skipToNext,
    skipToPrevious,
    skipToTrack,
    playerState,
    position,
    buffered,
    duration,
    stop,
    currentTrack,
    removeTrack,
    isPaused,
    isPlaying,
    isStopped,
    handlePauseAndPlayTrack,
  };
};

export default useMusicPlayer;
