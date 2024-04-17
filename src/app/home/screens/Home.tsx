import React, {FunctionComponent, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
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

  return (
    <ScreenContainer>
      <View style={tw`flex-1`}>
        <View style={tw`mx-3`}>
          <RowContainer style={tw`justify-between`}>
            <LogoSvg />
            <NotificationBellSvg
              onPress={() =>
                navigation.navigate('MainAppNavigator', {
                  screen: 'Notifications',
                })
              }
              style={tw`ml-5 mr-3`}
            />
          </RowContainer>
          <Status />
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
        <View style={tw`flex-1 mb-12`}>
          <PostCard
            handleJoinPartyBtnPress={() =>
              navigation.navigate('MainAppNavigator', {screen: 'PartyScreen'})
            }
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Home;
