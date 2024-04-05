import {useCallback, useEffect, useState} from 'react';
import TrackPlayer, {
  AddTrack,
  State,
  Event,
  useTrackPlayerEvents,
  useProgress,
  RepeatMode,
  Track,
} from 'react-native-track-player';

interface Props {
  track?: AddTrack;
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

  // Add track to trackplayer and setRepeatmode to off
  const addTrackToPlayer = useCallback(async () => {
    await Promise.all([
      track && TrackPlayer.add([track]),
      TrackPlayer.setRepeatMode(RepeatMode.Off),
    ]);
  }, [track]);

  // Add track to TrackPlayer on mount of the screen
  useEffect(() => {
    addTrackToPlayer();
  }, [addTrackToPlayer]);

  useEffect(() => {
    fetchCurrentTrack();
  }, []);

  // Play the current track
  const play = async () => {
    if (track && track.id !== currentTrack?.id) {
      console.log('removing track');
      await removeTrack();
      console.log(track.artist);
      await TrackPlayer.add([track]);
    }
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
    }
  });

  // Get the current player progress
  const {position, buffered, duration} = useProgress();

  // Stop track from playing
  const stop = async () => await TrackPlayer.stop();

  // Set currently playing track
  const fetchCurrentTrack = async () =>
    await TrackPlayer.getActiveTrack().then(response => {
      setCurrentTrack(response);
    });

  // Remove track from queue
  const removeTrack = async () =>
    await TrackPlayer.remove(0).then(async () => [
      await TrackPlayer.removeUpcomingTracks(),
      console.log(await TrackPlayer.getActiveTrack()),
    ]);

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
  };
};

export default useMusicPlayer;
