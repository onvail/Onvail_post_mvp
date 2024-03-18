import TrackPlayer, {Event, RepeatMode} from 'react-native-track-player';

module.exports = async () => {
  await TrackPlayer.setRepeatMode(RepeatMode.Off);
  try {
    TrackPlayer.addEventListener(Event.RemotePlay, () => {
      TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemotePause, () => {
      TrackPlayer.pause();
    });

    TrackPlayer.addEventListener(Event.RemoteNext, () => {
      TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
      TrackPlayer.skipToPrevious();
    });

    TrackPlayer.addEventListener(Event.RemoteStop, () => {});

    TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, () => {});

    TrackPlayer.addEventListener(Event.RemotePause, () => {
      console.log('Event.RemotePause');
      TrackPlayer.pause();
    });

    TrackPlayer.addEventListener(Event.RemotePlay, () => {
      console.log('Event.RemotePlay');
      TrackPlayer.play();
    });

    TrackPlayer.addEventListener(Event.RemoteNext, () => {
      console.log('Event.RemoteNext');
      TrackPlayer.skipToNext();
    });

    TrackPlayer.addEventListener(Event.RemotePrevious, () => {
      console.log('Event.RemotePrevious');
      TrackPlayer.skipToPrevious();
    });
  } catch (error) {}
};
