import React, {FunctionComponent, useEffect, useMemo} from 'react';
import {Pressable, NativeModules, Platform} from 'react-native';
import {Track} from 'react-native-track-player';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';
import {Colors} from 'src/app/styles/colors';
import tw from 'src/lib/tailwind';
import LottieView from 'lottie-react-native';
import {convertMillisecondsToMinSec, truncateText} from 'src/utils/utilities';
import {MediaEngineAudioEvent} from '../screens/PartyScreen';

interface Props extends Track {
  playerState: MediaEngineAudioEvent | undefined;
}

const MusicList: FunctionComponent<Props> = ({
  title,
  index,
  id,
  url,
  playerState,
}) => {
  const bgColor = index && (index + 1) % 2 === 0 ? 'transparent' : 'green';
  const {AgoraMusicHandler, AgoraModule} = NativeModules;
  const [currentPosition, setCurrentPosition] = React.useState(0);

  const currentItemPosition = useMemo(() => {
    if (url === id) {
      return convertMillisecondsToMinSec(currentPosition);
    } else {
      return '--:--';
    }
  }, [url, id, currentPosition]);

  useEffect(() => {
    if (
      playerState === MediaEngineAudioEvent.AgoraAudioMixingStateTypePlaying
    ) {
      const trackPosition = setInterval(() => {
        if (Platform.OS === 'android') {
          AgoraMusicHandler.getPosition()
            .then((position: any) => {
              setCurrentPosition(position);
            })
            .catch((error: any) => {
              console.log('error', error);
            });
        }
        if (Platform.OS === 'ios') {
          AgoraModule.getPosition()
            .then((position: any) => {
              setCurrentPosition(position);
            })
            .catch((error: any) => {
              console.log('error', error);
            });
        }
      }, 1000);

      return () => clearInterval(trackPosition); // cleanup interval on unmount or when playerState changes
    }
  }, [playerState, AgoraMusicHandler, AgoraModule]);

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
          {id === url && (
            <LottieView
              source={require('../../../assets/audio-wave.json')}
              style={tw`h-5 w-5`}
              autoPlay={
                playerState ===
                MediaEngineAudioEvent.AgoraAudioMixingStateTypePlaying
              }
              loop={
                playerState ===
                MediaEngineAudioEvent.AgoraAudioMixingStateTypePlaying
              }
            />
          )}
        </RowContainer>
        <CustomText style={tw`text-white text-xs`}>
          {currentItemPosition}
        </CustomText>
      </RowContainer>
    </Pressable>
  );
};

export default MusicList;
