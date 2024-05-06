import React, {FunctionComponent, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';

import RowContainer from 'components/View/RowContainer';
import CustomText from 'components/Text/CustomText';
import Icon from 'components/Icons/Icon';
import {Colors} from 'src/app/styles/colors';
import tw from 'src/lib/tailwind';
import useMusicPlayer from 'src/app/hooks/useMusicPlayer';
import {State} from 'react-native-track-player';
import {AnimatedCircularProgress} from 'react-native-circular-progress';

interface Props {
  musicTitle: string;
  uri: string;
  artiste: string;
  id: string;
}

const MiniMusicPlayer: FunctionComponent<Props> = ({
  musicTitle,
  uri,
  artiste,
  id,
}) => {
  // sample track
  const track = useMemo(
    () => [
      {
        url: uri,
        title: musicTitle,
        artist: artiste,
        album: '',
        genre: '',
        date: new Date().toDateString(),
        artwork: 'http://example.com/cover.png',
        duration: 402,
        id: id,
      },
    ],
    [uri, musicTitle, artiste, id],
  );

  const {
    playerState,
    position,
    duration,
    currentTrack,
    handlePauseAndPlayTrack,
  } = useMusicPlayer({
    track: track,
  });
  const progress = (position / duration) * 100;

  const currentPlayerStateIcon = useMemo(() => {
    return currentTrack?.id === track[0]?.id && playerState === State.Playing
      ? 'pause-circle'
      : 'play-circle';
  }, [currentTrack, playerState, track]);

  return (
    <View>
      <RowContainer>
        <View style={tw`mr-3`}>
          <CustomText style={tw`text-xs font-poppinsMedium`}>
            {musicTitle}
          </CustomText>
          <CustomText style={tw`text-grey2 text-right text-xs`}>
            {artiste}
          </CustomText>
        </View>
        <View style={tw`relative w-10 items-center justify-center`}>
          {currentTrack?.id === track[0]?.id && (
            <AnimatedCircularProgress
              size={35}
              width={15}
              fill={isNaN(progress) ? 0 : progress}
              tintColor={Colors.purple}
              backgroundColor={Colors.primary}
            />
          )}
          <View style={tw`absolute`}>
            <View style={tw`bg-primary rounded-full`}>
              <Icon
                icon={currentPlayerStateIcon}
                color={Colors.white}
                size={30}
                iconProvider="MaterialIcon"
                onPress={handlePauseAndPlayTrack}
              />
            </View>
          </View>
        </View>

        <View style={tw`border-[0.3px] h-4 mx-3 border-grey2`} />
        <TouchableOpacity style={tw`bg-white rounded-full  px-2 py-1`}>
          <CustomText style={tw`text-primary text-xs`}>Open</CustomText>
        </TouchableOpacity>
      </RowContainer>
    </View>
  );
};

export default MiniMusicPlayer;
