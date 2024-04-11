import React, {FunctionComponent} from 'react';
import {Pressable} from 'react-native';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';
import {Colors} from 'src/app/styles/colors';
import tw from 'src/lib/tailwind';
import {SongsProps} from 'src/utils/data';

interface Props extends SongsProps {
  currentTrackId: string;
}

const MusicList: FunctionComponent<Props> = ({
  title,
  duration,
  index,
  currentTrackId,
}) => {
  const bgColor = index && index % 2 === 0 ? 'transparent' : 'green';
  const VoiceSquare = generalIcon.VoiceSquare;

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
          <CustomText style={tw`ml-4 text-xs`}>{title}</CustomText>
          {currentTrackId === index?.toString() && <VoiceSquare />}
        </RowContainer>
        <CustomText style={tw`text-white text-xs`}>{duration}</CustomText>
      </RowContainer>
    </Pressable>
  );
};

export default MusicList;
