import React, {useRef, useState, ReactElement} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import tw from 'src/lib/tailwind';

type OTPInputProps = {
  otpLength?: number;
  onComplete: (otp: string) => void;
  onChangeText?: (otp: string) => void;
};

const OTPInput: React.FC<OTPInputProps> = ({
  otpLength = 5,
  onComplete,
  onChangeText,
}): ReactElement => {
  const [otpValues, setOtpValues] = useState<string[]>(
    Array(otpLength).fill(''),
  );
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const focusNext = (index: number): void => {
    if (index < otpLength - 1 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const focusPrevious = (index: number, value: string): void => {
    if (!value && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleTextChange = (text: string, index: number): void => {
    otpValues[index] = text;
    setOtpValues([...otpValues]);
    onChangeText && onChangeText(otpValues.join(''));

    if (text) {
      focusNext(index);
    }

    if (otpValues.join('').length === otpLength) {
      onComplete(otpValues.join(''));
    }
  };

  return (
    <View style={styles.otpContainer}>
      {Array.from({length: otpLength}).map((_, index) => (
        <TextInput
          key={index}
          ref={ref => (otpRefs.current[index] = ref)}
          style={tw`border w-14 h-14 rounded-md font-bold bg-white text-lg text-black border-[#ffffff] text-center`}
          maxLength={1}
          keyboardType="number-pad"
          onChangeText={text => handleTextChange(text, index)}
          onKeyPress={(e: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
            if (e.nativeEvent.key === 'Backspace') {
              focusPrevious(index, otpValues[index]);
            }
          }}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  otpInput: {
    width: 40,
    height: 40,
    margin: 5,
    textAlign: 'center',
    borderBottomWidth: 1,
  },
});

export default OTPInput;
