import React from 'react';
import {SafeAreaView} from 'react-native';
import {
  CustomTimerPickerStyles,
  TimerPickerModal,
} from 'react-native-timer-picker';
import LinearGradient from 'react-native-linear-gradient';

interface Props {
  showTimePicker: boolean;
  onChangeTime: (time: string) => void;
  handleVisibility: () => void;
  onCancel: () => void;
}

const CustomDatePicker: React.FC<Props> = ({
  showTimePicker,
  onChangeTime,
  handleVisibility,
  onCancel,
}) => {
  const style: CustomTimerPickerStyles = {theme: 'dark'};
  return (
    <SafeAreaView>
      {showTimePicker && (
        <TimerPickerModal
          visible={showTimePicker}
          setIsVisible={handleVisibility}
          onConfirm={pickedDuration => {
            console.log(pickedDuration);
          }}
          hourLabel=":"
          minuteLabel=":"
          secondLabel=""
          modalTitle="Set Time"
          onCancel={onCancel}
          closeOnOverlayPress
          LinearGradient={LinearGradient}
          styles={style}
          modalProps={{
            overlayOpacity: 0.2,
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default CustomDatePicker;
