import React, {FunctionComponent, useState} from 'react';
import {Pressable} from 'react-native';
import CustomText from 'src/app/components/Text/CustomText';
import tw from 'src/lib/tailwind';
import RowContainer from 'src/app/components/View/RowContainer';
import {Switch} from 'react-native-paper';

interface Props {
  description: string;
  optional?: boolean;
  onValueChange: (state: boolean) => void;
}

const SwitchSelector: FunctionComponent<Props> = ({
  description,
  optional,
  onValueChange,
}) => {
  const [checked, setChecked] = useState(true);

  return (
    <Pressable
      style={tw`border border-grey2 rounded-md h-13 items-center justify-center px-3 `}>
      <RowContainer style={tw`w-full items-center justify-between`}>
        <RowContainer>
          <CustomText>{description}</CustomText>
          {optional && (
            <CustomText style={tw`ml-3 text-grey2`}>(optional)</CustomText>
          )}
        </RowContainer>
        <Switch
          value={checked}
          onValueChange={value => {
            setChecked(prev => !prev);
            onValueChange(value);
          }}
          thumbColor={'white'}
        />
      </RowContainer>
    </Pressable>
  );
};

export default SwitchSelector;
