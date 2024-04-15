import React, {FunctionComponent, useState} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import PostCard from 'src/app/components/Posts/PostCard';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import Status from 'src/app/components/Status/Status';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import RowContainer from 'src/app/components/View/RowContainer';
import {BottomTabParamList} from 'src/app/navigator/types/BottomTabParamList';
import tw from 'src/lib/tailwind';
import CustomText from 'src/app/components/Text/CustomText';

type Props = NativeStackScreenProps<BottomTabParamList, 'Home'>;

const Home: FunctionComponent<Props> = ({navigation}) => {
  const LogoSvg = generalIcon.Logo;
  const NotificationBellSvg = generalIcon.NotificationBell;
  type Tabs = 'Parties' | 'Feeds';
  const [selectedTab, setSelectedTab] = useState<Tabs>('Parties');
  const tab: Tabs[] = ['Parties', 'Feeds'];
  return (
    <ScreenContainer>
      <View style={tw`flex-1`}>
        <View style={tw`mx-3`}>
          <RowContainer style={tw`justify-between`}>
            <LogoSvg />
            <RowContainer>
              <NotificationBellSvg
                onPress={() =>
                  navigation.navigate('MainAppNavigator', {
                    screen: 'Notifications',
                  })
                }
                style={tw`ml-5 mr-3`}
              />
            </RowContainer>
          </RowContainer>
          <Status />
        </View>
        <RowContainer
          style={tw`items-center w-2/3 p-2 self-center h-14 rounded-full justify-center my-6 bg-grey6`}>
          {tab.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => setSelectedTab(item)}
                style={tw`bg-${
                  item === selectedTab ? 'white' : 'transparent'
                } h-11 w-1/2 rounded-full justify-center items-center`}
                key={index}>
                <CustomText
                  style={tw`text-${
                    item === selectedTab ? 'primary' : 'white'
                  } text-lg font-medium`}>
                  {item}
                </CustomText>
              </TouchableOpacity>
            );
          })}
        </RowContainer>
        <View style={tw`flex-1 `}>
          <PostCard
            handleJoinPartyBtnPress={() =>
              navigation.navigate('MainAppNavigator', {
                screen: 'PartyScreen',
              })
            }
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Home;
