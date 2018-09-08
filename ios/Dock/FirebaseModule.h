#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface FirebaseModule : RCTEventEmitter <RCTBridgeModule>
- (void) tellJs : (NSString * )NSString;
@end
