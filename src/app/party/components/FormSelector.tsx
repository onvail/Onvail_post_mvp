import React, { FunctionComponent } from "react";
import { Pressable } from "react-native";
import Icon from "src/app/components/Icons/Icon";
import CustomText from "src/app/components/Text/CustomText";
import RowContainer from "src/app/components/View/RowContainer";
import { Colors } from "src/app/styles/colors";
import tw from "src/lib/tailwind";

interface Props {
     description: string;
     instruction: string;
     icon: string;
     onPress: () => void;
     value?: string;
}

const FormSelector: FunctionComponent<Props> = ({
     description,
     instruction,
     icon,
     onPress,
     value,
}) => {
     instruction = value && value?.length > 0 ? value : instruction;
     return (
          <Pressable
               onPress={onPress}
               style={tw`border border-grey2 rounded-md min-h-13 items-center justify-center px-3 py-1`}
          >
               <RowContainer style={tw`w-full items-center justify-between flex-wrap`}>
                    <CustomText style={tw`items-center justify-staart flex-1 text-[13px]`}>
                         {description}
                    </CustomText>
                    <RowContainer style={tw`items-center justify-end flex-1 text-[13px]`}>
                         <CustomText style={tw`mr-3 text-purple text-[13px]`}>
                              {instruction}
                         </CustomText>
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
