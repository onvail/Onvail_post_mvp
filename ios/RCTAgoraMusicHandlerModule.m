#import "RCTAgoraMusicHandlerModule.h"
#import <React/RCTLog.h>

@implementation RCTAgoraMusicHandlerModule

RCT_EXPORT_MODULE(AgoraModule)

- (instancetype)init {
  if (self = [super init]) {
    _audioFilesQueue = [NSMutableArray array];
    [self initializeAgoraEngine];
  }
  return self;
}

- (void)initializeAgoraEngine {
  NSString *appId = [[NSBundle mainBundle] objectForInfoDictionaryKey:@"AGORA_APP_ID"];
  if (!appId) {
    RCTLogError(@"Agora App ID not found in environment variables");
    return;
  }
  self.agoraKit = [AgoraRtcEngineKit sharedEngineWithAppId:appId delegate:self];
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"onAudioMixingStateChanged"];
}

RCT_EXPORT_METHOD(playMusic) {
  if (self.audioFilesQueue.count > 0) {
    NSString *filePath = [self.audioFilesQueue firstObject];
    [self.audioFilesQueue removeObjectAtIndex:0];
    [self playNextAudioFile:filePath];
  } else {
    RCTLogError(@"No audio files in the queue to play");
  }
}

RCT_EXPORT_METHOD(stopMusic) {
  [self.agoraKit stopAudioMixing];
}

RCT_EXPORT_METHOD(pauseMusic) {
  [self.agoraKit pauseAudioMixing];
}

RCT_EXPORT_METHOD(resumeMusic) {
  [self.agoraKit resumeAudioMixing];
}

- (void)playNextAudioFile:(NSString *)filePath {
  self.previousFilePath = self.currentFilePath;
  self.currentFilePath = filePath;
  if (filePath) {
    BOOL loopback = NO;
    NSInteger cycle = 1;
    [self.agoraKit startAudioMixing:filePath loopback:loopback cycle:cycle];
  }
}

RCT_EXPORT_METHOD(addAudioFileToQueue:(NSString *)filePath) {
  [self.audioFilesQueue addObject:filePath];
}

RCT_EXPORT_METHOD(next) {
  if (self.audioFilesQueue.count > 0) {
     // Play the next file in the queue
     NSString *nextFilePath = [self.audioFilesQueue firstObject];
     [self.audioFilesQueue removeObjectAtIndex:0];
     [self playNextAudioFile:nextFilePath];
   } else {
     // Queue is empty, restart from the first item
     if (self.previousFilePath) {
       [self playNextAudioFile:self.previousFilePath];
     } else if (self.audioFilesQueue.count > 0) {
       NSString *firstFilePath = [self.audioFilesQueue firstObject];
       [self playNextAudioFile:firstFilePath];
     } else {
       RCTLogError(@"No audio files available to play");
     }
   }
}

RCT_EXPORT_METHOD(previous) {
  if (self.previousFilePath) {
      // Play the previous file if available
      [self playNextAudioFile:self.previousFilePath];
    } else if (self.audioFilesQueue.count > 0) {
      // Re-add the first file to the queue and play it
      NSString *firstFilePath = [self.audioFilesQueue firstObject];
      [self.audioFilesQueue insertObject:firstFilePath atIndex:0];
      [self playNextAudioFile:firstFilePath];
    } else {
      RCTLogError(@"No previous audio file available");
    }}


+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (void)rtcEngine:(AgoraRtcEngineKit *)engine audioMixingStateChanged:(AgoraAudioMixingStateType)state reason:(AgoraAudioMixingReasonCode)reason {
  RCTLogInfo(@"Audio mixing state changed: state=%ld, reason=%ld", (long)state, (long)reason);
  
  // Send event to React Native
  [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(state), @"reason": @(reason)}];

  // Handle the state change here
  if (state == AgoraAudioMixingStateTypeStopped && reason == AgoraAudioMixingReasonStoppedByUser) {
    // Play the next audio file in the queue if available
    if (self.audioFilesQueue.count > 0) {
      NSString *nextFilePath = [self.audioFilesQueue firstObject];
      [self.audioFilesQueue removeObjectAtIndex:0];
      [self playNextAudioFile:nextFilePath];
    }
  }
}

@end

