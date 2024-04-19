import React, {FunctionComponent} from 'react';
import {Pressable} from 'react-native';
import {State, Track} from 'react-native-track-player';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';
import {Colors} from 'src/app/styles/colors';
import tw from 'src/lib/tailwind';
import LottieView from 'lottie-react-native';
import {MusicStoreState, useMusicStore} from 'src/app/zustand/store';
import {truncateText} from 'src/utils/utilities';

interface Props extends Track {}

const MusicList: FunctionComponent<Props> = ({title, duration, index, id}) => {
  const bgColor = index && index % 2 === 0 ? 'transparent' : 'green';
  const currentlyPlayingTrack = useMusicStore(
    (state: MusicStoreState) => state.currentTrack,
  );
  const playerState = useMusicStore(
    (state: MusicStoreState) => state.currentPlayerState,
  );

  return (
    <Pressable>
      <RowContainer
        style={tw.style('justify-between p-4', {
          backgroundColor:
            bgColor === 'transparent' ? 'transparent' : Colors.green,
        })}>
        <RowContainer>
          <CustomText style={tw`text-white text-xs`}>
            {Number(index) + 1}
          </CustomText>
          <CustomText style={tw`ml-4 text-xs`}>
            {truncateText(title ?? '', 27)}
          </CustomText>
          {currentlyPlayingTrack?.id === id && (
            <LottieView
              source={require('../../../assets/audio-wave.json')}
              style={tw`h-5 w-5`}
              autoPlay={playerState === State.Playing}
              loop={playerState === State.Playing}
            />
          )}
        </RowContainer>
        <CustomText style={tw`text-white text-xs`}>{duration}</CustomText>
      </RowContainer>
    </Pressable>
  );
};

export default MusicList;
