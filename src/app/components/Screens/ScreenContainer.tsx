import React, {FunctionComponent} from 'react';
import {Platform, Pressable, SafeAreaView, StatusBar, View} from 'react-native';
import tw from 'lib/tailwind';
import Icon from 'components/Icons/Icon';
import RowContainer from 'components/View/RowContainer';
import CustomText from 'components/Text/CustomText';
import {useNavigation} from '@react-navigation/native';
import {BottomTabParamList} from 'src/app/navigator/types/BottomTabParamList';

interface Props {
  children: React.ReactNode;
  goBack?: boolean;
  goHome?: boolean;
  screenHeader?: string;
}

const ScreenContainer: FunctionComponent<Props> = ({
  children,
  goBack,
  goHome,
  screenHeader,
}: Props) => {
  const navigation = useNavigation<BottomTabParamList | any>();
  const marginForAndroid = Platform.OS === 'android' ? 10 : 0;
  return (
    <View style={tw`bg-primary flex-1 pt-${marginForAndroid}`}>
      <SafeAreaView />
      <StatusBar barStyle={'light-content'} translucent={true} />
      <RowContainer style={tw`mx-3 justify-between mt-3`}>
        {goBack ? (
          <Icon
            onPress={() => navigation.goBack()}
            icon={'chevron-left'}
            color="white"
            size={30}
          />
        ) : null}
        {goHome ? (
          <Pressable
            onPress={() => {
              navigation.navigate('BottomTabNavigator', {
                screen: 'Home',
              });
            }}>
            <Icon icon={'chevron-left'} color="white" size={30} />
          </Pressable>
        ) : null}
        {screenHeader ? (
          <CustomText style={tw`text-lg`}>{screenHeader}</CustomText>
        ) : null}
        {screenHeader && goBack && <View />}
      </RowContainer>
      <View style={tw`bg-primary flex-1`}>{children}</View>
    </View>
  );
};

export default ScreenContainer;
