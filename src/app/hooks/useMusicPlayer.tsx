import {useCallback, useEffect, useState} from 'react';
import TrackPlayer, {
  AddTrack,
  State,
  Event,
  useTrackPlayerEvents,
  useProgress,
  RepeatMode,
} from 'react-native-track-player';

interface Props {
  track: AddTrack;
}

const sample2 = {
  id: '3',
  url: 'https://sample-music.netlify.app/Bad%20Liar.mp3',
  artwork: '',
  title: 'Bad Liar',
  artist: 'Rain alphred',
  duration: 40,
};

// Subscribing to the following events inside MyComponent
const events: Event[] = [Event.PlaybackState, Event.PlaybackError];

// Custom hook to control music playback using react-native-track-player
const useMusicPlayer = ({track}: Props) => {
  // Save and update the current player state
  const [playerState, setPlayerState] = useState<State>(State.None);

  // Add track to trackplayer and setRepeatmode to off
  const addTrackToPlayer = useCallback(async () => {
    await Promise.all([
      TrackPlayer.add([track, sample2]),
      TrackPlayer.setRepeatMode(RepeatMode.Off),
    ]);
  }, [track]);

  // Add track to TrackPlayer on mount of the screen
  useEffect(() => {
    addTrackToPlayer();
  }, [addTrackToPlayer]);

  // Play the current track
  const play = async () => await TrackPlayer.play();

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
  };
};

export default useMusicPlayer;
