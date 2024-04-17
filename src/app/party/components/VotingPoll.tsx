import React, {FunctionComponent, useEffect, useState} from 'react';
import {
  Pressable,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import DraggableFlatList, {
  ScaleDecorator,
  RenderItemParams,
} from 'react-native-draggable-flatlist';
import CustomText from 'src/app/components/Text/CustomText';
import tw from 'src/lib/tailwind';
import {Switch} from 'react-native-paper';
import RowContainer from 'src/app/components/View/RowContainer';
import CustomTextInput from 'src/app/components/TextInput/CustomTextInput';
import {Colors} from 'src/app/styles/colors';
import Icon from 'src/app/components/Icons/Icon';

type PollData = {
  key: number;
  option: string;
};

type Props = {
  handlePollOptions: (data: {option: string}[]) => void;
  handlePollQuestions: (pollQuestions: string) => void;
};

const VotingPoll: FunctionComponent<Props> = ({
  handlePollOptions,
  handlePollQuestions,
}) => {
  const [checked, setChecked] = useState<boolean>(true);

  const initialPollData: PollData[] = [...Array(2)].map((d, index) => {
    return {
      key: index,
      option: '',
    };
  });

  const [pollData, setPollData] = useState<PollData[]>(initialPollData);
  const [pollQuestion, setPollQuestion] = useState<string>('');

  useEffect(() => {
    handlePollOptions(pollData.map(item => ({option: item.option})));
  }, [pollData, handlePollOptions, pollQuestion]);

  useEffect(() => {
    handlePollQuestions(pollQuestion);
  }, [handlePollQuestions, pollQuestion]);

  // Remove textInput for poll options
  const removePollItem = (key: number) => {
    setPollData(prev => prev.filter(item => item.key !== key));
  };

  // Update text of individual poll item
  const handleTextInput = (key: number, text: string) => {
    setPollData(prev =>
      prev.map(item => (item.key === key ? {...item, option: text} : item)),
    );
  };

  // Generate new key
  const getNextKey = (data: PollData[]) => {
    if (data.length === 0) {
      return 0;
    }
    const maxKey = Math.max(...data.map(item => item.key));
    return maxKey + 1;
  };

  // Render poll textInputs
  const renderItem = ({item, drag}: RenderItemParams<PollData>) => {
    return (
      <ScaleDecorator>
        <TouchableWithoutFeedback onLongPress={drag}>
          <RowContainer
            style={tw`border h-12 rounded-md justify-between my-2 px-3 border-dashed border-grey7`}>
            <RowContainer>
              <Pressable onLongPress={drag}>
                <Icon icon="dots-grid" color="white" />
              </Pressable>
              <TextInput
                placeholder={`Option  ${item.key + 1}`}
                placeholderTextColor={Colors.grey2}
                style={tw`text-white font-poppinsRegular w-5/6 ml-2 `}
                onChangeText={text => handleTextInput(item.key, text)}
              />
            </RowContainer>
            {pollData.length > 1 && (
              <Pressable onPress={() => removePollItem(item.key)}>
                <Icon icon={'close'} color="white" size={15} />
              </Pressable>
            )}
          </RowContainer>
        </TouchableWithoutFeedback>
      </ScaleDecorator>
    );
  };

  return (
    <View style={tw`border border-grey2 rounded-md mt-4 min-h-13 px-3 py-2`}>
      <RowContainer style={tw`justify-between`}>
        <CustomText>
          Add voting poll{' '}
          <CustomText style={tw`text-grey7 text-xs`}>(optional)</CustomText>
        </CustomText>
        <Switch
          value={checked}
          onValueChange={() => {
            setChecked(prev => !prev);
          }}
          thumbColor={'white'}
        />
      </RowContainer>
      {checked && (
        <View style={tw`mt-4`}>
          <CustomTextInput
            placeholder={"What's your pool about"}
            style={tw`text-white font-poppinsRegular`}
            backgroundColor="transparent"
            containerStyle={tw`border border-dashed border-grey7`}
            onChangeText={text => setPollQuestion(text)}
          />
          <DraggableFlatList
            data={pollData}
            onDragEnd={({data}) => setPollData(data)}
            keyExtractor={item => item.key.toString()}
            renderItem={renderItem}
            scrollEnabled={false}
          />
          <TouchableOpacity
            onPress={() =>
              setPollData(prev => [
                ...prev,
                {
                  key: getNextKey(prev),
                  option: '',
                },
              ])
            }
            style={tw`mt-1`}>
            <CustomText style={tw`font-poppinsBold`}>+ Add Option</CustomText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default VotingPoll;
