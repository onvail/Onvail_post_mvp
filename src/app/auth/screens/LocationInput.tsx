import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {useForm, Controller} from 'react-hook-form';
import CustomText from 'app/components/Text/CustomText';
import tw from 'lib/tailwind';
import {AuthStackParamList} from 'src/app/navigator/types/AuthStackParamList';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import ErrorText from 'src/app/components/Text/ErrorText';
import RowContainer from 'src/app/components/View/RowContainer';
import Icon from 'src/app/components/Icons/Icon';
import AuthScreenContainer from 'src/app/components/Screens/AuthScreenContainer';
import {SignUpStoreState, useSignUpStore} from 'src/app/zustand/store';
import axios from 'axios';
import CustomDropDown from 'src/app/components/Dropdown/CustomDropDown';

type Props = NativeStackScreenProps<AuthStackParamList, 'Signup'>;

type InitialValue = {
  country: string;
  city: string;
  state: string;
};

interface State {
  name: string;
  state_code: string;
}

interface Country {
  name: string;
  iso3: string;
  iso2: string;
  states: State[];
}

const LocationInput: FunctionComponent<Props> = ({navigation}) => {
  const defaultValues: InitialValue = {
    country: '',
    city: '',
    state: '',
  };

  const [countriesAndStates, setCountriesAndStates] = useState<Country[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedState, setSelectedState] = useState<State | null>(null);
  const [cities, setCities] = useState<string[]>([]);

  const fetchAllCountries = async () => {
    try {
      const response = await axios.get(
        'https://countriesnow.space/api/v0.1/countries/states',
      );
      setCountriesAndStates(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchCitiesInAState = useCallback(async () => {
    if (!selectedCountry || !selectedState) {
      return;
    }
    try {
      const response = await axios.post(
        'https://countriesnow.space/api/v0.1/countries/state/cities',
        {
          country: selectedCountry?.name,
          state: selectedState?.name,
        },
      );
      setCities(
        response?.data?.data.map((item: string) => ({
          name: item,
          key: item,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  }, [selectedCountry, selectedState]);

  useEffect(() => {
    fetchAllCountries();
  }, []);

  useEffect(() => {
    fetchCitiesInAState();
  }, [fetchCitiesInAState, selectedState, setSelectedCountry]);

  const updateUserSignUpStore = useSignUpStore(
    (state: SignUpStoreState) => state.updateUserSignUpStore,
  );
  const storeUser = useSignUpStore((state: SignUpStoreState) => state.user);

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: defaultValues,
    mode: 'all',
  });

  const onSubmit = async ({country, city, state}: InitialValue) => {
    updateUserSignUpStore({
      ...storeUser,
      country,
      state,
      city,
    });
    navigation.navigate('RoleInput');
  };

  return (
    <AuthScreenContainer>
      <View style={tw`mt-12 px-3`}>
        <RowContainer style={tw`mb-12 mt-3 items-center`}>
          <Icon
            onPress={() => navigation.goBack()}
            icon={'chevron-left'}
            color="white"
            size={30}
          />
          <CustomText style={tw`text-lg ml-24`}>Create account</CustomText>
        </RowContainer>
        <CustomText style={tw`text-white font-bold text-lg`}>
          What’s your location?
        </CustomText>
        <View>
          <ErrorText>{errors?.country?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'Country is required',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomDropDown
                data={countriesAndStates}
                onChange={item => {
                  onChange(item.name);
                  setSelectedCountry(item);
                }}
                labelField={'name'}
                valueField={'name'}
                maxHeight={250}
                value={value}
                onBlur={onBlur}
                placeholder="Select country"
              />
            )}
            name="country"
          />
        </View>
        <View>
          <ErrorText>{errors?.state?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'State/Province is required',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomDropDown
                data={selectedCountry?.states || []}
                onChange={item => {
                  onChange(item.name);
                  setSelectedState(item);
                }}
                labelField={'name'}
                valueField={'name'}
                maxHeight={250}
                value={value}
                onBlur={onBlur}
                placeholder="Select state/province"
              />
            )}
            name="state"
          />
        </View>
        <View>
          <ErrorText>{errors?.city?.message}</ErrorText>
          <Controller
            control={control}
            rules={{
              required: 'City is required',
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <CustomDropDown
                data={cities}
                onChange={item => {
                  onChange(item.name);
                  setSelectedState(item);
                }}
                labelField={'name'}
                valueField={'name'}
                maxHeight={250}
                value={value}
                onBlur={onBlur}
                placeholder="City"
              />
            )}
            name="city"
          />
        </View>
      </View>
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSubmit(onSubmit)}
        style={tw`w-1/4 rounded-12 bg-[#7C1AFC] self-center mt-12 py-4.5`}>
        <CustomText style={tw`text-white text-center font-bold text-lg`}>
          Next
        </CustomText>
      </TouchableOpacity>
    </AuthScreenContainer>
  );
};

export default LocationInput;
