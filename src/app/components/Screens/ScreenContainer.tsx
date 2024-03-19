import React, {FunctionComponent} from 'react';
import {SafeAreaView, View} from 'react-native';
import tw from 'lib/tailwind';
import Icon from 'components/Icons/Icon';
import RowContainer from 'components/View/RowContainer';
import CustomText from 'components/Text/CustomText';
import {useNavigation} from '@react-navigation/native';

interface Props {
  children: React.ReactNode;
  goBack?: boolean;
  screenHeader?: string;
}

const ScreenContainer: FunctionComponent<Props> = ({
  children,
  goBack,
  screenHeader,
}: Props) => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={tw`bg-primary flex-1 `}>
      <RowContainer style={tw`mx-3 justify-between mt-3`}>
        {goBack ? (
          <Icon
            onPress={() => navigation.goBack()}
            icon={'chevron-left'}
            color="white"
            size={30}
          />
        ) : null}
        {screenHeader ? (
          <CustomText style={tw`text-lg`}>{screenHeader}</CustomText>
        ) : null}
        {screenHeader && goBack && <View />}
      </RowContainer>
      <View style={tw`bg-primary flex-1`}>{children}</View>
    </SafeAreaView>
  );
};

export default ScreenContainer;
