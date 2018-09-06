package com.mycampusdock.dock;

import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.google.firebase.messaging.FirebaseMessaging;

public class FirebaseModule extends ReactContextBaseJavaModule {
    public FirebaseModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "FirebaseModule";
    }

    @ReactMethod
    public void subscribeTag(String tag) {
        FirebaseMessaging.getInstance().subscribeToTopic(tag);
        Log.d("Dock", "SUBSCRIBED : "+tag);
    }

    @ReactMethod
    public void unsubscribeTag(String tag) {
        FirebaseMessaging.getInstance().unsubscribeFromTopic(tag);
        Log.d("Dock", "UNSUBSCRIBED : "+tag);
    }

    @ReactMethod
    public void subscribeTags(ReadableArray tags) {
        for(int i=0; i<tags.size(); i++){
            subscribeTag(tags.getString(i));
        }
    }

    @ReactMethod
    public void unsubscribeTags(ReadableArray tags) {
        for(int i=0; i<tags.size(); i++){
            unsubscribeTag(tags.getString(i));
        }
    }

    @ReactMethod
    public void log(String log){
        Log.d("Dock JSLog", log);
    }
}