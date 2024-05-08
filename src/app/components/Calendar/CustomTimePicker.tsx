import React, {useState} from 'react';
import {SafeAreaView} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

interface Props {
  showTimePicker: boolean;
  onChangeTime: (time: string | undefined) => void;
}

const CustomTimePicker: React.FC<Props> = ({showTimePicker, onChangeTime}) => {
  const [date, setDate] = useState<any>(new Date(1598051730000));
  return (
    <SafeAreaView>
      {showTimePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'time'}
          onChange={(_, selectedDate) => {
            onChangeTime(selectedDate?.toLocaleTimeString());
            setDate(selectedDate);
          }}
          display="spinner"
        />
      )}
    </SafeAreaView>
  );
};

export default CustomTimePicker;
