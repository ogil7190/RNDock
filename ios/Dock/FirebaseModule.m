#import "FirebaseModule.h"
#import <React/RCTLog.h>
@import Firebase;
@implementation FirebaseModule

RCT_EXPORT_MODULE();

+ (id)allocWithZone:(NSZone *)zone {
  static FirebaseModule *sharedInstance = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    sharedInstance = [super allocWithZone:zone];
  });
  return sharedInstance;
}

- (NSArray<NSString *> *)supportedEvents {
  return @[@"FCM_MSSG"];
}

-(void)tellJs:(NSString *)mssg
{
  [self sendEventWithName:@"FCM_MSSG" body:@{@"mssg": mssg}];
}

RCT_EXPORT_METHOD(log:(NSString *)mssg)
{
  RCTLogInfo(@"JSLOG %@", mssg);
}

RCT_EXPORT_METHOD(subscribeTag:(NSString *)tag)
{
  [[FIRMessaging messaging] subscribeToTopic:tag
                                  completion:^(NSError * _Nullable error) {
                                    NSLog(@"Subscribed to %@ topic", tag);
                                  }];
}

RCT_EXPORT_METHOD(unsubscribeTag:(NSString *)tag)
{
  [[FIRMessaging messaging] unsubscribeFromTopic:tag
                                  completion:^(NSError * _Nullable error) {
                                    NSLog(@"Unsubscribed to %@ topic", tag);
                                  }];
}

RCT_EXPORT_METHOD(subscribeTags:(NSArray *)tags)
{
  for (NSString* o in tags)
  {
    [self subscribeTag:o];
  }
}

RCT_EXPORT_METHOD(unsubscribeTags:(NSArray *)tags)
{
  for (NSString* o in tags)
  {
    [self unsubscribeTag:o];
  }
}

@end
