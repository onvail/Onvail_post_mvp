import React, {FunctionComponent} from 'react';
import {TouchableOpacity} from 'react-native';
import Icon from 'src/app/components/Icons/Icon';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';
import tw from 'src/lib/tailwind';

interface Props {
  title: string;
  onPress: () => void;
}

const Links: FunctionComponent<Props> = ({title, onPress}) => {
  return (
    <TouchableOpacity style={tw`my-5`} onPress={onPress}>
      <RowContainer style={tw`justify-between`}>
        <CustomText>{title}</CustomText>
        <Icon icon={'chevron-right'} color="white" />
      </RowContainer>
    </TouchableOpacity>
  );
};

export default Links;
