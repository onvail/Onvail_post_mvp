import DocumentPicker, {
  DocumentPickerOptions,
  DocumentPickerResponse,
} from 'react-native-document-picker';
import {SupportedPlatforms} from 'react-native-document-picker/lib/typescript/fileTypes';

const useDocumentPicker = ({pickSingle = false} = {}) => {
  const options: DocumentPickerOptions<SupportedPlatforms> | undefined = {
    allowMultiSelection: true,
  };

  const selectDocument = async (): Promise<
    DocumentPickerResponse | DocumentPickerResponse[] | undefined
  > => {
    try {
      const response = pickSingle
        ? DocumentPicker.pickSingle(options)
        : DocumentPicker.pick(options);
      return response;
    } catch (error) {
      console.log(error);
    }
  };
  return {
    selectDocument,
  };
};

export default useDocumentPicker;
