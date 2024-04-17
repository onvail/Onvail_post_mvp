import React, {FunctionComponent} from 'react';
import CustomText from './CustomText';
import tw from 'src/lib/tailwind';

interface Props {
  children: React.ReactNode;
}

const ErrorText: FunctionComponent<Props> = ({children}) => {
  return <CustomText style={tw`text-orange`}>{children}</CustomText>;
};

export default ErrorText;
