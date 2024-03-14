import React, {FunctionComponent} from 'react';
import {View} from 'react-native';
import {generalIcon} from 'src/app/components/Icons/generalIcons';
import ScreenContainer from 'src/app/components/Screens/ScreenContainer';
import Status from 'src/app/components/Status/Status';
import RowContainer from 'src/app/components/View/RowContainer';
import tw from 'src/lib/tailwind';

const Home: FunctionComponent = () => {
  const LogoSvg = generalIcon.Logo;
  const NotificationBellSvg = generalIcon.NotificationBell;
  return (
    <ScreenContainer>
      <View style={tw`mx-3 flex-1`}>
        <RowContainer style={tw`justify-between`}>
          <LogoSvg />
          <NotificationBellSvg style={tw`mr-5`} />
        </RowContainer>
        <View style={tw`mt-4`}>
          <Status />
        </View>
      </View>
    </ScreenContainer>
  );
};

export default Home;
