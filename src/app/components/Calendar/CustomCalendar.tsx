import React, {FunctionComponent, useState} from 'react';
import {Calendar} from 'react-native-calendars';
import Modal from 'react-native-modal/dist/modal';
import {Colors} from 'src/app/styles/colors';
import tw from 'src/lib/tailwind';
import {formatDate} from 'src/utils/utilities';

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
  const [selectedDay, setSelectedDay] = useState<string>(
    formatDate(new Date()),
  );
  return (
    <Modal isVisible={isCalendarVisible} onBackdropPress={onBackDropPress}>
      <Calendar
        // Customize the appearance of the calendar
        style={tw`border border-grey rounded-lg `}
        // Specify the current date
        current={formatDate(new Date())}
        // Callback that gets called when the user selects a day
        onDayPress={day => {
          onDateSelected(day.dateString);
          setSelectedDay(day.dateString);
        }}
        // Mark specific dates as marked
        markedDates={{
          [selectedDay]: {
            selected: true,
            selectedColor: Colors.purple,
          },
        }}
      />
    </Modal>
  );
};

export default CustomCalendar;
