import {State, Track} from 'react-native-track-player';
import {SignInProps} from 'src/types/authType';
import {create} from 'zustand';

export interface MusicStoreState {
  tracks: Track[];
  addTracks: (newTrack: Track) => void;
  currentTrack: Track;
  setCurrentlyPlayingTrack: (newTrack: Track) => void;
  currentPlayerState: State;
  setPlayerState: (state: State) => void;
}

interface UploadProgressState {
  imageProgress: number;
  musicProgress: number[];
  setImageProgress: (progress: number) => void;
  setMusicProgress: (progress: number, index: number) => void;
  resetProgress: () => void;
}

export interface SignUpStoreState {
  user: SignInProps;
  updateUserSignUpStore: (state: SignInProps) => void;
}

export interface MicStoreState {
  isMuted: boolean;
  setIsMuted: () => void;
  isHost: boolean;
  setIsHost: (state: boolean) => void;
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

export const useSignUpStore = create<SignUpStoreState>(set => ({
  user: {} as SignInProps,
  updateUserSignUpStore: (user: SignInProps) =>
    set(() => ({
      user,
    })),
}));

export const useUploadProgressStore = create<UploadProgressState>(set => ({
  imageProgress: 0,
  musicProgress: [],
  setImageProgress: progress => set({imageProgress: progress}),
  setMusicProgress: (progress, index) =>
    set(state => {
      const newProgress = [...state.musicProgress];
      newProgress[index] = progress;
      return {musicProgress: newProgress};
    }),
  resetProgress: () => set({imageProgress: 0, musicProgress: []}),
}));

export const useMicStore = create<MicStoreState>(set => ({
  isMuted: true,
  setIsMuted: () => set(state => ({isMuted: !state.isMuted})),
  isHost: false,
  setIsHost: (isHost: boolean) => set(() => ({isHost})),
}));
