//
//  RCTAgoraMusicHandlerModule.h
//  onvail
//
//  Created by Marvelous Ikechi on 24/07/2024.
//

#import <React/RCTBridgeModule.h>
#import <AgoraRtcKit/AgoraRtcEngineKit.h>



@interface RCTAgoraMusicHandlerModule : NSObject <RCTBridgeModule, AgoraRtcEngineDelegate>

@property (nonatomic, strong) AgoraRtcEngineKit *agoraKit;
@property (nonatomic, copy) NSString *currentFilePath;
@property (nonatomic, copy) NSString *previousFilePath;
@property (nonatomic, strong) NSMutableArray<NSString *> *audioFilesQueue;

@end
