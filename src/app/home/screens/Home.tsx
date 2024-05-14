import React, {FunctionComponent, useState} from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
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

type Props = NativeStackScreenProps<BottomTabParamList, 'Home'>;

const Home: FunctionComponent<Props> = ({navigation}) => {
  const LogoSvg = generalIcon.Logo;
  const NotificationBellSvg = generalIcon.NotificationBell;
  type Tabs = 'Parties' | 'Feeds';
  const tabs: Tabs[] = ['Parties', 'Feeds'];
  const [selectedTab, setSelectedTab] = useState<Tabs>('Parties');

  const handleTabSwitch = (item: Tabs) => {
    setSelectedTab(item);
  };

  const AnimatedButton = Animated.createAnimatedComponent(TouchableOpacity);

  const parties = useQuery({
    queryKey: ['parties'],
    queryFn: fetchParties,
  });

  const posts = useQuery({
    queryKey: ['posts'],
    queryFn: fetchPosts,
  });

  return (
    <ScreenContainer>
      <View style={tw`flex-1`}>
        <View style={tw`mx-3`}>
          <RowContainer style={tw`justify-between`}>
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
                style={tw`ml-5 mr-3`}
              />
              <View
                style={tw`w-[31px] h-[31px] ml-2 rounded-full bg-[#7C1AFC] items-center justify-center`}>
                <CustomText style={tw`text-white text-base font-bold`}>
                  M
                </CustomText>
              </View>
            </RowContainer>
          </RowContainer>
          <RowContainer style={tw`flex-row items-center`}>
            {/* <AnimatedButton
              activeOpacity={0.9}
              onPress={handleAddStory}
              style={tw`items-center`}>
              <View
                style={tw`mr-3 items-center justify-center rounded-[17px] h-20 w-20 border-4 border-grey5`}>
                <View
                  style={tw`items-center justify-center rounded-[17px] bg-[#7C1AFC] h-19 w-19 border-2`}>
                  <AddIcon />
                </View>
              </View>
              <Text style={tw`text-white mt-2 font-poppinsMedium text-xs`}>
                Your Story
              </Text>
            </AnimatedButton> */}
            <Status />
          </RowContainer>
        </View>
        <View
          style={tw`items-center flex-row w-2/3 p-2 self-center h-12 rounded-full justify-center my-8 bg-grey6`}>
          {tabs.map((item, _) => {
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
          {parties.isPending || posts.isPending ? (
            <View style={tw`flex-1 justify-center items-center`}>
              <ActivityIndicator size={30} />
            </View>
          ) : null}
          {selectedTab === 'Parties' && (
            <PostCard
              handleJoinPartyBtnPress={item => {
                navigation.navigate('MainAppNavigator', {
                  screen: 'PartyScreen',
                  params: {
                    party: item,
                  },
                });
              }}
              data={parties.data}
            />
          )}
          {selectedTab === 'Feeds' && <Feeds data={posts.data} />}
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Home;
