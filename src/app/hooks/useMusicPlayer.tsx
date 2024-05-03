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
  const [trackPlayerQueue, setTrackPlayerQueue] = useState<Track[]>([]);

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

  useEffect(() => {
    handleTrackPlayerQueue();
  }, []);

  // Play the current track
  const play = async () => {
    try {
      await TrackPlayer.play();
    } catch (error) {
      console.log(error);
    }
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

  // Get TrackPlayerQueue
  const handleTrackPlayerQueue = async () => {
    return await TrackPlayer.getQueue().then(res => {
      setTrackPlayerQueue(res);
    });
  };

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

  const checkIfTrackQueueIsDifferent = async () => {
    const playerQueue = await TrackPlayer.getQueue();

    // Early exit if the counts differ
    if (track.length !== playerQueue.length) {
      return false;
    }

    // Check if every element in `track` has a corresponding element in `playerQueue`
    return track.every(t1 =>
      playerQueue.some(t2 => t1.id === t2.id && t1.url === t2.url),
    );
  };

  const handlePauseAndPlayTrack = async () => {
    // Exit early if there is no track
    if (!track || track.length === 0) {
      console.log('No track available to play or pause.');
      return;
    }

    // Check if the current queue in the player matches the desired track
    const isSameTrackArray = await checkIfTrackQueueIsDifferent();

    // Add a tolerance of 0.2 milliseconds as the end position could be 0.2ms less
    const tolerance = 0.2;

    // Track can be defined as completed if duration - position is <= 0.2ms
    const isCompleted = duration - position <= tolerance;

    // If it's the same track as the current one and it's already playing, pause it.
    if (isSameTrackArray && isPlaying) {
      await pause();
      return;
    }

    // If it's the same track and is paused and is completed playback.
    if (isSameTrackArray && isPaused && isCompleted) {
      await TrackPlayer.reset();
      await TrackPlayer.add(track);
      await play();
      return;
    }

    // If it's the same track as the current one and it's paused, resume playing.
    if (isSameTrackArray && isPaused) {
      await play();
      return;
    }

    // If the track is different or the player is stopped, reset the player,
    // add the new/current track to the queue, and start playback.
    await TrackPlayer.reset();
    await TrackPlayer.add(track);
    await play();
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
    trackPlayerQueue,
    checkIfTrackQueueIsDifferent,
  };
};

export default useMusicPlayer;
