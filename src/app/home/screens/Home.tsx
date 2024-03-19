import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import PostCard from 'src/app/components/Posts/PostCard';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import Status from 'src/app/components/Status/Status';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import RowContainer from 'src/app/components/View/RowContainer';
import {BottomTabParamList} from 'src/app/navigator/types/BottomTabParamList';
import tw from 'src/lib/tailwind';

type Props = NativeStackScreenProps<BottomTabParamList, 'Home'>;

const Home: FunctionComponent<Props> = ({navigation}) => {
  const LogoSvg = generalIcon.Logo;
  const NotificationBellSvg = generalIcon.NotificationBell;
  const AddSqurareSvg = generalIcon.AddSquare;
  return (
    <ScreenContainer>
      <View style={tw`flex-1`}>
        <View style={tw`mx-3`}>
          <RowContainer style={tw`justify-between`}>
            <LogoSvg />
            <RowContainer>
              <AddSqurareSvg />
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
          <View style={tw`mt-4`}>
            <Status />
          </View>
        </View>
        <View style={tw`mt-8 flex-1 `}>
          <PostCard />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Home;
