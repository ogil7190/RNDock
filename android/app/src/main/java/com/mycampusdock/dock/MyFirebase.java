package com.mycampusdock.dock;

import android.content.Context;
import android.content.Intent;
import android.support.annotation.Nullable;
import android.util.Log;

import com.facebook.react.ReactInstanceManager;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.google.firebase.messaging.FirebaseMessagingService;
import com.google.firebase.messaging.RemoteMessage;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;

public class MyFirebase extends FirebaseMessagingService {
    public static final String TAG = "Dock";

    @Override
    public void onNewToken(String s) {
        super.onNewToken(s);
        Log.d(TAG, "NEW TOKEN");
    }

    @Override
    public void onMessageReceived(RemoteMessage remoteMessage) {
        Log.d(TAG, "From: " + remoteMessage.getFrom());
        if (remoteMessage.getData().size() > 0) {
            Log.d(TAG, "Message data payload: " + remoteMessage.getData());
        }
        try {
            JSONObject obj = new JSONObject(remoteMessage.getData().toString());
            // SAMPLE {type=event, content={"email":"androidrajpoot@gmail.com","name":"Vivek Rajpoot","college":"MRIIRS","_id":"ogil7190-dmvn7a","reach":[],"views":[],"enrollees":[],"timestamp":"2018-08-30T06:03:54.965Z","title":"DOCK LAUNCH","description":"Dock is going to launch somewhere between august and september","location":"AF04","category":"Sports","tags":"{\"1\":\"Cricket\",\"2\":\"Football\",\"4\":\"Volley Ball\",\"5\":\"Tennis\",\"8\":\"Outdoor\",\"9\":\"Computer Games\"}","reg_start":"2018-08-30T16:00:00.000Z","reg_end":"2018-08-31T16:00:00.000Z","date":"2018-08-31T16:00:00.000Z","contact_details":"{\"OGIL\":\"8448448040\",\"\":\"\"}","faq":"","price":"50","available_seats":"100","audience":["ogil7190","Sports"],"media":["c86b2498154221c5471ac637f630ab86img-poster.webp"]}}
            JSONObject content = obj.getJSONObject("content");
            MainApplication application = (MainApplication) this.getApplication();
            dataReached(content.getString("_id"));
            try {
                // JS THREAD ACTIVE
                ReactNativeHost reactNativeHost = application.getReactNativeHost();
                ReactInstanceManager reactInstanceManager = reactNativeHost.getReactInstanceManager();
                ReactContext reactContext = reactInstanceManager.getCurrentReactContext();
                if (reactContext != null) {
                    WritableNativeArray params = new WritableNativeArray();
                    params.pushString("OGIL IS HERE");
                    sendEvent(reactContext, "FCM_MSSG", params);
                }
            } catch (Exception e) {
                Intent resultIntent = new Intent(getApplicationContext(), MainActivity.class);
                resultIntent.putExtra("BackgroundData", content.toString());
                showNotificationMessage(getApplicationContext(), content.getString("title"), "Tap to view | Dock", "" + System.currentTimeMillis(), resultIntent);
                //showNotificationMessageWithBigImage(getApplicationContext(), content.getString("title"), "Tap to view | Dock", "" + System.currentTimeMillis(), resultIntent, "https://mycampusdock.com/" + content.getJSONArray("media").get(0));
            }
        } catch (JSONException e) {
            e.printStackTrace();
        }
    }

    private void sendEvent(ReactContext reactContext, String eventName, @Nullable WritableNativeArray params) {
        reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
    }

    public static final String REACH_URL = "https://mycampusdock.com/general/reach";
    public void dataReached(String id){
        MainApplication app = (MainApplication) getApplication();
        HashMap<String, String> params = new HashMap<>();
        params.put("_id", id);
        HashMap<String, String> headers = new HashMap<>();
        headers.put("x-access-token", app.getPref().getString("token", ""));
        app.sendNetworkRequest(REACH_URL, 1, params, headers, new Interfaces.RequestListener() {
            @Override
            public void onRequestStart() {

            }

            @Override
            public void onRequestFail(String error) {

            }

            @Override
            public void onRequestResponse(String response) {

            }
        });
    }

    /**
     * Showing notification with text only
     */
    private void showNotificationMessage(Context context, String title, String message, String timeStamp, Intent intent) {
        NotiUtil notificationUtils = new NotiUtil(context);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        notificationUtils.showNotificationMessage(title, message, timeStamp, intent);
    }

    /**
     * Showing notification with text and image
     */
    private void showNotificationMessageWithBigImage(Context context, String title, String message, String timeStamp, Intent intent, String imageUrl) {
        NotiUtil notificationUtils = new NotiUtil(context);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TASK);
        notificationUtils.showNotificationMessage(title, message, timeStamp, intent, imageUrl);
    }
}
