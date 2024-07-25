//
//  RCTAgoraMusicHandlerModule.m
//  onvail
//
//  Created by Marvelous Ikechi on 24/07/2024.
//

#import "RCTAgoraMusicHandlerModule.h"
#import <React/RCTLog.h>

typedef NS_ENUM(NSInteger, CustomAgoraAudioMixingStateCode) {
    CustomAgoraAudioMixingStatePlaying = 710,
    CustomAgoraAudioMixingStatePaused = 711,
    CustomAgoraAudioMixingStateStopped = 713,
    CustomAgoraAudioMixingStateFailed = 714
};

typedef NS_ENUM(NSInteger, CustomAgoraAudioMixingReasonCode) {
    CustomAgoraAudioMixingReasonCanNotOpen = 701,
    CustomAgoraAudioMixingReasonTooFrequentCall = 702,
    CustomAgoraAudioMixingReasonInterruptedEOF = 703,
    CustomAgoraAudioMixingReasonStartedByUser = 720,
    CustomAgoraAudioMixingReasonOneLoopCompleted = 721,
    CustomAgoraAudioMixingReasonStartNewLoop = 722,
    CustomAgoraAudioMixingReasonAllLoopsCompleted = 723,
    CustomAgoraAudioMixingReasonStoppedByUser = 724,
    CustomAgoraAudioMixingReasonPausedByUser = 725,
    CustomAgoraAudioMixingReasonResumedByUser = 726
};

@implementation RCTAgoraMusicHandlerModule

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

RCT_EXPORT_MODULE(AgoraModule)

RCT_EXPORT_METHOD(playMusic:(NSString *)filePath) {
  BOOL loopback = NO;
  NSInteger cycle = 1;
  NSInteger startPos = 0;
  [self.agoraKit startAudioMixing:filePath loopback:loopback cycle:cycle startPos:startPos];
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
    NSInteger startPos = 0;
    [self.agoraKit startAudioMixing:filePath loopback:loopback  cycle:cycle startPos:startPos];
  }
}

RCT_EXPORT_METHOD(addAudioFileToQueue:(NSString *)filePath) {
  [self.audioFilesQueue addObject:filePath];
  if (!self.currentFilePath) {
    NSString *nextFilePath = [self.audioFilesQueue firstObject];
    [self.audioFilesQueue removeObjectAtIndex:0];
    [self playNextAudioFile:nextFilePath];
  }
}

RCT_EXPORT_METHOD(next) {
  if (self.audioFilesQueue.count > 0) {
    NSString *nextFilePath = [self.audioFilesQueue firstObject];
    [self.audioFilesQueue removeObjectAtIndex:0];
    [self playNextAudioFile:nextFilePath];
  }
}

RCT_EXPORT_METHOD(previous) {
  [self playNextAudioFile:self.previousFilePath];
}

+ (BOOL)requiresMainQueueSetup {
  return NO;
}

- (void)rtcEngine:(AgoraRtcEngineKit *)engine audioMixingStateChanged:(CustomAgoraAudioMixingStateCode)state reason:(CustomAgoraAudioMixingReasonCode)reason {
  // Handle the state change here
  if (state == CustomAgoraAudioMixingStateStopped && reason == CustomAgoraAudioMixingReasonStoppedByUser) {
    // Play the next audio file in the queue if available
    if (self.audioFilesQueue.count > 0) {
      NSString *nextFilePath = [self.audioFilesQueue firstObject];
      [self.audioFilesQueue removeObjectAtIndex:0];
      [self playNextAudioFile:nextFilePath];
    }
  }
}

@end

