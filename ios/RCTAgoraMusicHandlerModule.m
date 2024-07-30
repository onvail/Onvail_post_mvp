#import "RCTAgoraMusicHandlerModule.h"
#import <React/RCTLog.h>

@interface RCTAgoraMusicHandlerModule()

@property (nonatomic, strong) NSString *currentTrackIdentifier;

@end

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
  RCTLogInfo(@"playMusic called");
  if (self.audioFilesQueue.count > 0) {
    NSString *filePath = [self.audioFilesQueue firstObject];
    [self.audioFilesQueue removeObjectAtIndex:0];
    [self playNextAudioFile:filePath];
    [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(AgoraAudioMixingStateTypePlaying), @"reason": @(AgoraAudioMixingReasonTypeOk), @"trackIdentifier": filePath}];
  } else {
    RCTLogError(@"No audio files in the queue to play");
  }
}

RCT_EXPORT_METHOD(pauseMusic) {
  RCTLogInfo(@"pauseMusic called");
  [self.agoraKit pauseAudioMixing];
  [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(AgoraAudioMixingStateTypePaused), @"reason": @(AgoraAudioMixingReasonTypeOk), @"trackIdentifier": self.currentTrackIdentifier}];
}

RCT_EXPORT_METHOD(resumeMusic) {
  RCTLogInfo(@"resumeMusic called");
  [self.agoraKit resumeAudioMixing];
  [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(AgoraAudioMixingStateTypePlaying), @"reason": @(AgoraAudioMixingReasonTypeOk), @"trackIdentifier": self.currentTrackIdentifier}];
}

RCT_EXPORT_METHOD(stopMusic) {
  [self.agoraKit stopAudioMixing];
  self.currentTrackIdentifier = nil;
}

- (void)playNextAudioFile:(NSString *)filePath {
  self.previousFilePath = self.currentFilePath;
  self.currentFilePath = filePath;
  self.currentTrackIdentifier = filePath;
  if (filePath) {
    BOOL loopback = NO;
    NSInteger cycle = 1;
    [self.agoraKit startAudioMixing:filePath loopback:loopback cycle:cycle];
    [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(AgoraAudioMixingStateTypePlaying), @"reason": @(AgoraAudioMixingReasonTypeOk), @"trackIdentifier": filePath}];
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
     [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(AgoraAudioMixingStateTypePlaying), @"reason": @(AgoraAudioMixingReasonTypeOk), @"trackIdentifier": nextFilePath}];
   } else {
     // Queue is empty, restart from the first item
     if (self.previousFilePath) {
       [self playNextAudioFile:self.previousFilePath];
       [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(AgoraAudioMixingStateTypePlaying), @"reason": @(AgoraAudioMixingReasonTypeOk), @"trackIdentifier": self.previousFilePath}];
     } else if (self.audioFilesQueue.count > 0) {
       NSString *firstFilePath = [self.audioFilesQueue firstObject];
       [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(AgoraAudioMixingStateTypePlaying), @"reason": @(AgoraAudioMixingReasonTypeOk), @"trackIdentifier": firstFilePath}];
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
      [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(AgoraAudioMixingStateTypePlaying), @"reason": @(AgoraAudioMixingReasonTypeOk), @"trackIdentifier": self.previousFilePath}];
    } else if (self.audioFilesQueue.count > 0) {
      // Re-add the first file to the queue and play it
      NSString *firstFilePath = [self.audioFilesQueue firstObject];
      [self.audioFilesQueue insertObject:firstFilePath atIndex:0];
      [self playNextAudioFile:firstFilePath];
      [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(AgoraAudioMixingStateTypePlaying), @"reason": @(AgoraAudioMixingReasonTypeOk), @"trackIdentifier": firstFilePath}];
    } else {
      RCTLogError(@"No previous audio file available");
    }}

// Increase volume for as the host
RCT_EXPORT_METHOD(increaseHostVolume:(NSInteger)volume) {
  // Ensure the volume is within a valid range (0-100)
  volume = MAX(0, MIN(volume, 100));

  // Use the Agora RTC Engine instance to adjust the volume
  [self.agoraKit adjustAudioMixingVolume:volume];
}

// Increase volume for guest
RCT_EXPORT_METHOD(increaseGuestVolume:(NSInteger)volume) {
  // Ensure the volume is within a valid range (0-100)
  volume = MAX(0, MIN(volume, 100));

  // Use the Agora RTC Engine instance to adjust the playback volume
  [self.agoraKit adjustAudioMixingPlayoutVolume:volume];
}

RCT_EXPORT_METHOD(getPosition:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  int position = [self.agoraKit getAudioMixingCurrentPosition];
  if (position >= 0) {
    resolve(@(position));
  } else {
    NSError *error = [NSError errorWithDomain:@"RCTAgoraMusicHandlerModule" code:-1 userInfo:@{NSLocalizedDescriptionKey: @"Failed to get audio mixing current position"}];
    reject(@"get_position_error", @"Failed to get audio mixing current position", error);
  }
}

RCT_EXPORT_METHOD(getCurrentPlayingTrack:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject) {
  if (self.currentTrackIdentifier) {
    resolve(self.currentTrackIdentifier);
  } else {
    NSError *error = [NSError errorWithDomain:@"RCTAgoraMusicHandlerModule" code:-1 userInfo:@{NSLocalizedDescriptionKey: @"No track is currently playing"}];
    reject(@"get_track_identifier_error", @"No track is currently playing", error);
  }
}

RCT_EXPORT_METHOD(emitTestEvent) {
  [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(1), @"reason": @(1)}];
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (void)rtcEngine:(AgoraRtcEngineKit *)engine audioMixingStateChanged:(AgoraAudioMixingStateType)state reason:(AgoraAudioMixingReasonCode)reason {
  RCTLogInfo(@"Audio mixing state changed: state=%ld, reason=%ld", (long)state, (long)reason);
  
  // Send event to React Native
  [self sendEventWithName:@"onAudioMixingStateChanged" body:@{@"state": @(state), @"reason": @(reason), @"trackIdentifier": self.currentTrackIdentifier}];

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
