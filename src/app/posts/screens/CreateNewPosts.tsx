import React, {FunctionComponent, useState} from 'react';
import {Pressable, TextInput, View} from 'react-native';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';
import tw from 'src/lib/tailwind';

type PostOptions = 'Post' | 'Story';
const postOptions: PostOptions[] = ['Post', 'Story'];

const CreateNewPosts: FunctionComponent = () => {
  const [selectedPostOptions, setSelectedPostOptions] =
    useState<PostOptions>('Post');

  const GallerSvg = generalIcon.Gallery;
  const VideoSvg = generalIcon.VideoIcon;
  const MusicSvg = generalIcon.MusicSquareIcon;
  const SendSvg = generalIcon.SendIcon;

  return (
    <ScreenContainer goBack>
      <View style={tw`mx-5 mt-4`}>
        <View style={tw`bg-purple min-h-80 text-sm rounded-lg p-3 `}>
          <TextInput
            placeholder="wanna say something?"
            placeholderTextColor={'white'}
            multiline
            style={tw` h-10/12 text-md rounded-lg mt-2 font-poppinsRegular text-white`}
          />
          <RowContainer style={tw`mt-2 items-end flex-1 justify-between`}>
            <RowContainer style={tw`w-2/5 justify-between`}>
              <GallerSvg />
              <VideoSvg />
              <MusicSvg />
            </RowContainer>
            <View>
              <SendSvg />
            </View>
          </RowContainer>
        </View>
        <RowContainer style={tw`mt-8 items-center justify-center`}>
          {postOptions.map((post, _) => {
            const activeBackground =
              post === selectedPostOptions ? 'border-b border-purple' : '';
            return (
              <Pressable
                onPress={() => setSelectedPostOptions(post)}
                style={tw`mr-10 w-15 items-center pb-2 ${activeBackground}`}
                key={post}>
                <CustomText>{post}</CustomText>
              </Pressable>
            );
          })}
        </RowContainer>
      </View>
    </ScreenContainer>
  );
};

export default CreateNewPosts;
