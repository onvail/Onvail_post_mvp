import React, {FunctionComponent, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import ScreenContainer from 'components/Screens/ScreenContainer';
import tw from 'src/lib/tailwind';
import CustomText from 'src/app/components/Text/CustomText';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import CustomTextInput from 'src/app/components/TextInput/CustomTextInput';
import CustomImage from 'src/app/components/Image/CustomImage';
import LinearGradient from 'react-native-linear-gradient';
import RowContainer from 'src/app/components/View/RowContainer';
import {FlashList} from '@shopify/flash-list';

const SongReview: FunctionComponent = ({navigation}) => {
  const AddIconSvg = generalIcon.AddIcon;
  const SendIcon2Svg = generalIcon.Send2;
  const PlayIcon2Svg = generalIcon.PlayIcon2;
  const PauseIcon2 = generalIcon.PauseIcon2;
  const [searchText, setSearchText] = useState('');

  const renderItem = () => (
    <View style={tw`mb-5`}>
      <RowContainer style={tw`items-center`}>
        <LinearGradient
          style={tw`h-18 w-18 border-white rounded-full  items-center justify-center`}
          colors={['#392655', '#1A76E7']}>
          <CustomImage
            uri={
              'https://resizing.flixster.com/xkP-QzPdNnU1Q8KQuBB6Q0YCeTU=/218x280/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/371287_v9_bc.jpg'
            }
            style={tw`h-16.5 w-16.5 rounded-full `}
            resizeMode="cover"
          />
        </LinearGradient>
        <CustomText style={tw`text-[#BBBBBB] ml-3`}>
          <CustomText style={tw`text-white font-bold`}>Stovia</CustomText> sent
          songs for review. 1h
        </CustomText>
      </RowContainer>
      <RowContainer style={tw`justify-between items-center mb-5`}>
        <RowContainer style={tw`mt-4 mr-2`}>
          <View style={tw`mr-2`}>
            <CustomText style={tw`text-white text-sm font-bold`}>
              Stovia
            </CustomText>
            <CustomText style={tw`text-white text-sm font-medium`}>
              Blunt & Business
            </CustomText>
          </View>
          <TouchableOpacity
            style={tw`w-9 h-9 rounded-full bg-white items-center justify-center`}>
            <PlayIcon2Svg />
          </TouchableOpacity>
        </RowContainer>
        <RowContainer style={tw`items-center gap-x-3`}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={tw`px-6 py-2.8 border border-white rounded-10`}>
            <CustomText style={tw`font-bold text-white text-sm`}>
              Decline
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('MainAppNavigator', {
                screen: 'SongReviewSuccess',
              })
            }
            style={tw`px-6 py-2.8 bg-[#7C1AFC] rounded-10`}>
            <CustomText style={tw`font-bold text-white text-sm`}>
              Approve
            </CustomText>
          </TouchableOpacity>
        </RowContainer>
      </RowContainer>
      <RowContainer style={tw`justify-between items-center mb-5`}>
        <RowContainer style={tw`mt-4 mr-2`}>
          <View style={tw`mr-2`}>
            <CustomText style={tw`text-white text-sm font-bold`}>
              Stovia
            </CustomText>
            <CustomText style={tw`text-white text-sm font-medium`}>
              Blunt & Business
            </CustomText>
          </View>
          <TouchableOpacity
            style={tw`w-9 h-9 rounded-full bg-white items-center justify-center`}>
            <PauseIcon2 />
          </TouchableOpacity>
        </RowContainer>
        <RowContainer style={tw`items-center gap-x-3`}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={tw`px-6 py-2.8 border border-white rounded-10`}>
            <CustomText style={tw`font-bold text-white text-sm`}>
              Decline
            </CustomText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() =>
              navigation.navigate('MainAppNavigator', {
                screen: 'SongReviewSuccess',
              })
            }
            style={tw`px-6 py-2.8 bg-[#7C1AFC] rounded-10`}>
            <CustomText style={tw`font-bold text-white text-sm`}>
              Approve
            </CustomText>
          </TouchableOpacity>
        </RowContainer>
      </RowContainer>
    </View>
  );

  return (
    <ScreenContainer goBack screenHeader="Song review">
      <View style={tw`px-4 flex-1`}>
        <RowContainer style={tw`justify-between items-center mt-10`}>
          <CustomText
            style={tw`text-white text-[15px] font-400 relative top-0.5 mr-2`}>
            Invited listeners
          </CustomText>
          <RowContainer>
            <LinearGradient
              style={tw`h-10 w-10 border-white rounded-full z-20 items-center justify-center`}
              colors={['#000000', '#000000']}>
              <CustomImage
                uri={
                  'https://resizing.flixster.com/xkP-QzPdNnU1Q8KQuBB6Q0YCeTU=/218x280/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/371287_v9_bc.jpg'
                }
                style={tw`h-9 w-9 rounded-full `}
                resizeMode="cover"
              />
            </LinearGradient>
            <LinearGradient
              style={tw`h-10 w-10 border-white rounded-full z-10 relative -left-4 items-center justify-center`}
              colors={['#000000', '#000000']}>
              <CustomImage
                uri={
                  'https://resizing.flixster.com/xkP-QzPdNnU1Q8KQuBB6Q0YCeTU=/218x280/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/371287_v9_bc.jpg'
                }
                style={tw`h-9 w-9 rounded-full `}
                resizeMode="cover"
              />
            </LinearGradient>
            <LinearGradient
              style={tw`h-10 w-10 border-white rounded-full z-10 relative -left-4 items-center justify-center`}
              colors={['#000000', '#000000']}>
              <CustomImage
                uri={
                  'https://resizing.flixster.com/xkP-QzPdNnU1Q8KQuBB6Q0YCeTU=/218x280/v2/https://resizing.flixster.com/-XZAfHZM39UwaGJIFWKAE8fS0ak=/v3/t/assets/371287_v9_bc.jpg'
                }
                style={tw`h-9 w-9 rounded-full `}
                resizeMode="cover"
              />
            </LinearGradient>
          </RowContainer>
        </RowContainer>
        <View style={tw`flex-row items-center mt-12`}>
          <CustomText
            style={tw`text-white text-[15px] font-400 relative top-0.5 mr-2`}>
            Invite others to listen
          </CustomText>
          <AddIconSvg />
        </View>
        <View style={tw`relative`}>
          <CustomTextInput
            placeholder=""
            onChangeText={val => setSearchText(val)}
            value={searchText}
            borderWidth={'1'}
            borderColor="#434343"
            backgroundColor="#0E0E0E"
            containerStyle={tw`pr-6 text-white`}
            textColor="text-white"
          />
          <TouchableOpacity
            onPress={() => console.log('send')}
            activeOpacity={0.8}
            style={tw`absolute h-12 w-9 items-center justify-center right-0 top-0`}>
            <SendIcon2Svg />
          </TouchableOpacity>
        </View>
        <View style={tw`flex-1 mt-6`}>
          <FlashList
            data={[1, 2, 3, 4, 5, 6, 7, 8]}
            renderItem={renderItem}
            estimatedItemSize={20}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default SongReview;
