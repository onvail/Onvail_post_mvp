import React, {FunctionComponent} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {DropdownProps} from 'react-native-element-dropdown/lib/typescript/components/Dropdown/model';
import tw from 'lib/tailwind';

interface Props<T> extends DropdownProps<T> {}

const CustomDropDown: FunctionComponent<Props<any>> = ({...props}) => {
  return (
    <Dropdown
      style={tw`bg-white text-purple font-poppinsRegular h-12 px-3 rounded-md`}
      selectedTextStyle={tw`font-poppinsRegular text-sm`}
      placeholderStyle={tw`font-poppinsRegular`}
      itemTextStyle={tw`font-poppinsRegular text-sm`}
      containerStyle={tw`rounded-md`}
      {...props}
    />
  );
};

export default CustomDropDown;
