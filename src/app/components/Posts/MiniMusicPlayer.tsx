import React, {FunctionComponent, useEffect, useMemo} from 'react';
import {TouchableOpacity, View} from 'react-native';

import RowContainer from 'components/View/RowContainer';
import CustomText from 'components/Text/CustomText';
import Icon from 'components/Icons/Icon';
import {Colors} from 'src/app/styles/colors';
import tw from 'src/lib/tailwind';
import useMusicPlayer from 'src/app/hooks/useMusicPlayer';
import {State} from 'react-native-track-player';
import {AnimatedCircularProgress} from 'react-native-circular-progress';
import {useMusicStore} from 'src/app/zustand/store';

interface Props {
  musicTitle: string;
  uri: string;
  artiste: string;
}

const MiniMusicPlayer: FunctionComponent<Props> = ({
  musicTitle,
  uri,
  artiste,
}) => {
  // sample track
  const track = useMemo(
    () => ({
      url: uri,
      title: musicTitle,
      artist: artiste,
      album: 'while(1<2)',
      genre: 'Progressive House, Electro House',
      date: '2014-05-20T07:00:00+00:00',
      artwork: 'http://example.com/cover.png',
      duration: 402,
      id: 'new-id',
    }),
    [uri, musicTitle, artiste],
  );

  // add tracks via zustand
  const addTracks = useMusicStore(state => state.addTracks);

  // add tracks on mount
  useEffect(() => {
    addTracks(track);
  }, [addTracks, track]);

  const {play, pause, playerState, position, duration} = useMusicPlayer();
  const progress = (position / duration) * 100;

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
          <AnimatedCircularProgress
            size={35}
            width={15}
            fill={isNaN(progress) ? 0 : progress}
            tintColor={Colors.purple}
            backgroundColor={Colors.primary}
          />
          <View style={tw`absolute`}>
            <View style={tw`bg-primary rounded-full`}>
              <Icon
                icon={
                  playerState === State.Playing ? 'pause-circle' : 'play-circle'
                }
                color={Colors.white}
                size={30}
                iconProvider="MaterialIcon"
                onPress={playerState === State.Playing ? pause : play}
              />
            </View>
          </View>
        </View>

        <View style={tw`border-[0.5px] h-9 mx-3 border-grey2`} />
        <TouchableOpacity style={tw`bg-white rounded-full  px-2 py-1`}>
          <CustomText style={tw`text-primary text-xs`}>Open</CustomText>
        </TouchableOpacity>
      </RowContainer>
    </View>
  );
};

export default MiniMusicPlayer;
