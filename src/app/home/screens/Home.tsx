import React, {FunctionComponent, useState} from 'react';
import {Pressable, ScrollView, TouchableOpacity, View} from 'react-native';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import PostCard from 'src/app/components/Posts/PostCard';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import Status from 'src/app/components/Status/Status';
import RowContainer from 'src/app/components/View/RowContainer';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import tw from 'src/lib/tailwind';
import CustomText from 'src/app/components/Text/CustomText';
import Animated from 'react-native-reanimated';
import {BottomTabParamList} from 'src/app/navigator/types/BottomTabParamList';
import {useQuery} from '@tanstack/react-query';
import {fetchParties, fetchPosts} from 'src/actions/parties';
import Feeds from 'src/app/components/Feed/screens/Feeds';
import {Avatar} from 'react-native-paper';
import {Colors} from 'src/app/styles/colors';
import useUser from 'src/app/hooks/useUserInfo';
import CustomImage from 'src/app/components/Image/CustomImage';
import HomeSkeletonPlaceHolder from 'src/app/components/Screens/HomeSkeletonPlaceHolder';

type Props = NativeStackScreenProps<BottomTabParamList, 'Home'>;

const Home: FunctionComponent<Props> = ({navigation}) => {
  const LogoSvg = generalIcon.Logo;
  const NotificationBellSvg = generalIcon.NotificationBell;
  type Tabs = 'Parties' | 'Feeds';
  const tabs: Tabs[] = ['Parties', 'Feeds'];
  const [selectedTab, setSelectedTab] = useState<Tabs>('Parties');
  const {user} = useUser();

  const handleTabSwitch = (item: Tabs) => {
    setSelectedTab(item);
  };

  const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

  const {data: partiesData, isLoading: loadingParties} = useQuery({
    queryKey: ['parties'],
    queryFn: fetchParties,
  });

  const {data: postsData, isLoading: loadingPosts} = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  const isLoading = loadingParties || loadingPosts;

  return (
    <ScreenContainer>
      <View style={tw`flex-1`}>
        <View style={tw`mx-3`}>
          <RowContainer style={tw`justify-between mb-4`}>
            <RowContainer style={tw`flex-row items-center`}>
              <LogoSvg />
              <View
                style={tw`w-1/4 h-[18px] rounded-[9px] bg-[#313131] justify-center items-center`}>
                <CustomText style={tw`text-white text-[8px] font-normal`}>
                  Free plan
                </CustomText>
              </View>
            </RowContainer>
            <RowContainer style={tw`flex-row items-center`}>
              <NotificationBellSvg
                onPress={() =>
                  navigation.navigate('MainAppNavigator', {
                    screen: 'Notifications',
                  })
                }
                style={tw`ml-5 mr-4`}
              />
              <Pressable
                onPress={() =>
                  navigation.navigate('MainAppNavigator', {
                    screen: 'Settings',
                  })
                }>
                {user?.image && user?.image?.length > 0 ? (
                  <CustomImage
                    uri={user?.image}
                    style={tw`h-7 w-7 rounded-full`}
                  />
                ) : (
                  <Avatar.Text
                    label={user?.name?.substring(0, 1) ?? ''}
                    size={27}
                    style={tw`bg-purple `}
                    labelStyle={tw`font-poppinsBold text-base`}
                    color={Colors.white}
                  />
                )}
              </Pressable>
            </RowContainer>
          </RowContainer>
          <RowContainer style={tw`flex-row items-center`}>
            <Status />
          </RowContainer>
        </View>
        <View
          style={tw`items-center flex-row w-2/3 p-2 self-center h-12 rounded-full justify-center my-8 bg-grey6`}>
          {tabs.map(item => {
            const isActive = item === selectedTab;
            const background = isActive ? 'white' : 'transparent';
            const text = isActive ? 'black' : 'white';
            return (
              <AnimatedButton
                onPress={() => handleTabSwitch(item)}
                style={[
                  tw`h-10 w-1/2 rounded-full bg-${background} justify-center items-center`,
                ]}
                key={item}>
                <CustomText style={tw`text-${text} text-base font-medium`}>
                  {item}
                </CustomText>
              </AnimatedButton>
            );
          })}
        </View>
        <View style={tw`flex-1`}>
          {isLoading ? (
            <ScrollView contentContainerStyle={tw`px-2`}>
              {Array.from({length: 10}, (_, key) => (
                <HomeSkeletonPlaceHolder key={key} />
              ))}
            </ScrollView>
          ) : (
            <>
              {selectedTab === 'Parties' && (
                <PostCard
                  handleJoinPartyBtnPress={(item, partyBackgroundColor) => {
                    navigation.navigate('MainAppNavigator', {
                      screen: 'PartyScreen',
                      params: {
                        party: item,
                        partyBackgroundColor: partyBackgroundColor,
                      },
                    });
                  }}
                  data={partiesData}
                />
              )}
              {selectedTab === 'Feeds' && <Feeds data={postsData} />}
            </>
          )}
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Home;
