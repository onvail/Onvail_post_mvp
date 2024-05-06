import {State, Track} from 'react-native-track-player';
import {create} from 'zustand';

export interface MusicStoreState {
  tracks: Track[];
  addTracks: (newTrack: Track) => void;
  currentTrack: Track;
  setCurrentlyPlayingTrack: (newTrack: Track) => void;
  currentPlayerState: State;
  setPlayerState: (state: State) => void;
}

export const useMusicStore = create<MusicStoreState>(set => ({
  tracks: [],
  addTracks: (newTrack: Track) =>
    set(state => ({
      tracks: [...state.tracks, newTrack],
    })),
  currentTrack: {} as Track,
  setCurrentlyPlayingTrack: (newTrack: Track) =>
    set(() => ({
      currentTrack: newTrack,
    })),
  currentPlayerState: State.None,
  setPlayerState: (state: State) => {
    set(() => ({
      currentPlayerState: state,
    }));
  },
}));
