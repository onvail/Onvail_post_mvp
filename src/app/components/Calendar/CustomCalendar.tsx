import React, {FunctionComponent} from 'react';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal/dist/modal';
import {Colors} from 'src/app/styles/colors';
import tw from 'src/lib/tailwind';

interface Props {
  isCalendarVisible: boolean;
  onBackDropPress: () => void;
  onDateSelected: (date: string) => void;
}

const CustomCalendar: FunctionComponent<Props> = ({
  isCalendarVisible,
  onBackDropPress,
  onDateSelected,
}) => {
  return (
    <Modal isVisible={isCalendarVisible} onBackdropPress={onBackDropPress}>
      <Calendar
        // Customize the appearance of the calendar
        style={tw`border border-grey rounded-lg h-80`}
        // Specify the current date
        current={'2012-03-01'}
        // Callback that gets called when the user selects a day
        onDayPress={day => {
          onDateSelected(day.dateString);
        }}
        // Mark specific dates as marked
        markedDates={{
          '2024-03-01': {
            selected: true,
            selectedColor: Colors.purple,
          },
        }}
      />
    </Modal>
  );
};

export default CustomCalendar;
