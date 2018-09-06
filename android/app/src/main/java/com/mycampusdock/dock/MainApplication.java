package com.mycampusdock.dock;

import android.app.Application;
import android.content.Context;
import android.content.SharedPreferences;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.StringRequest;
import com.android.volley.toolbox.Volley;
import com.facebook.react.ReactApplication;
import com.horcrux.svg.SvgPackage;

import co.apptailor.googlesignin.RNGoogleSigninPackage;

import com.BV.LinearGradient.LinearGradientPackage;

import io.realm.react.RealmReactPackage;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage; // <-- add this import
import com.dylanvann.fastimage.FastImageViewPackage;

import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public class MainApplication extends Application implements ReactApplication {

    private RequestQueue queue;
    private SharedPreferences pref;
    public static final String SESSION_ID = UUID.randomUUID().toString();
    public static final int REQ_TIME_OUT = 30000;
    public static final String PREF_STORE_NAME = "Dock";

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new SvgPackage(),
                    new RNGoogleSigninPackage(),
                    new LinearGradientPackage(),
                    new RealmReactPackage(),
                    new ImagePickerPackage(),
                    new FastImageViewPackage(),
                    new DockPackage()
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
    }

    public void sendNetworkRequest(String URL, int method, final Map<String, String> params, final Interfaces.RequestListener listener) {
        /*
         * 0 for GET type
         * 1 for POST type
         */
        listener.onRequestStart();
        StringRequest stringRequest = new StringRequest(method, URL,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        listener.onRequestResponse(response);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                listener.onRequestFail("" + error);
            }
        }) {
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                return params;
            }
        };
        stringRequest.setRetryPolicy(new DefaultRetryPolicy(REQ_TIME_OUT, DefaultRetryPolicy.DEFAULT_MAX_RETRIES, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        getRequestQueueInstance(getApplicationContext()).add(stringRequest);
    }

    public void sendNetworkRequest(String URL, int method, final Map<String, String> params, final Map<String, String> headers, final Interfaces.RequestListener listener) {
        listener.onRequestStart();
        StringRequest stringRequest = new StringRequest(method, URL,
                new Response.Listener<String>() {
                    @Override
                    public void onResponse(String response) {
                        listener.onRequestResponse(response);
                    }
                }, new Response.ErrorListener() {
            @Override
            public void onErrorResponse(VolleyError error) {
                listener.onRequestFail("" + error);
            }
        }) {
            @Override
            protected Map<String, String> getParams() throws AuthFailureError {
                return params;
            }

            @Override
            public Map<String, String> getHeaders() throws AuthFailureError {
                return headers;
            }
        };
        stringRequest.setRetryPolicy(new DefaultRetryPolicy(REQ_TIME_OUT, DefaultRetryPolicy.DEFAULT_MAX_RETRIES, DefaultRetryPolicy.DEFAULT_BACKOFF_MULT));
        getRequestQueueInstance(getApplicationContext()).add(stringRequest);
    }


    public SharedPreferences getPref() {
        if (pref == null) {
            return getSharedPreferences(PREF_STORE_NAME, MODE_PRIVATE);
        }
        return pref;
    }

    public RequestQueue getRequestQueueInstance(Context context) {
        if (queue == null) {
            queue = Volley.newRequestQueue(context);
            return queue;
        }
        return queue;
    }
}
