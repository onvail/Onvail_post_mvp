import { Audio } from "expo-av";

class RecordingManager {
     private static instance: RecordingManager;
     private recording: Audio.Recording | null = null;
     private isRecording: boolean = false;

     private constructor() {}

     static getInstance(): RecordingManager {
          if (!RecordingManager.instance) {
               RecordingManager.instance = new RecordingManager();
          }
          return RecordingManager.instance;
     }

     async startRecording(
          onRecordingStatusUpdate: (status: Audio.RecordingStatus) => void,
     ): Promise<void> {
          if (this.isRecording && this.recording) {
               await this.recording.stopAndUnloadAsync();
               this.recording = null;
          }

          try {
               await Audio.requestPermissionsAsync();
               await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    playsInSilentModeIOS: true,
               });

               this.recording = new Audio.Recording();
               await this.recording.prepareToRecordAsync(
                    Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY,
               );
               this.recording.setOnRecordingStatusUpdate(onRecordingStatusUpdate);
               await this.recording.startAsync();
               this.isRecording = true;
          } catch (error) {
               console.error("Failed to start recording", error);
          }
     }

     async stopRecording(): Promise<void> {
          if (this.recording) {
               await this.recording.stopAndUnloadAsync();
               this.recording = null;
               this.isRecording = false;
          }
     }

     isCurrentlyRecording(): boolean {
          return this.isRecording;
     }
}

export default RecordingManager;
