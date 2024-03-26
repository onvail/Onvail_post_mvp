import React, {FunctionComponent} from 'react';
import {Pressable} from 'react-native';
import Icon from 'src/app/components/Icons/Icon';
import CustomText from 'src/app/components/Text/CustomText';
import RowContainer from 'src/app/components/View/RowContainer';
import {Colors} from 'src/app/styles/colors';
import tw from 'src/lib/tailwind';

interface Props {
  description: string;
  instruction: string;
  icon: string;
}

const FormSelector: FunctionComponent<Props> = ({
  description,
  instruction,
  icon,
}) => {
  return (
    <Pressable
      style={tw`border border-grey2 rounded-md h-13 items-center justify-center px-3 `}>
      <RowContainer style={tw`w-full items-center justify-between`}>
        <CustomText>{description}</CustomText>
        <RowContainer>
          <CustomText style={tw`mr-3 text-purple`}>{instruction}</CustomText>
          <Icon
            icon={icon}
            color={Colors.grey2}
            iconProvider="MaterialIcon"
            size={23}
          />
        </RowContainer>
      </RowContainer>
    </Pressable>
  );
};

export default FormSelector;
