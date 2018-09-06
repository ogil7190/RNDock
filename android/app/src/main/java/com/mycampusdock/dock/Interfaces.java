package com.mycampusdock.dock;

import android.view.View;

public class Interfaces {

    public interface RequestListener {
        void onRequestStart();

        void onRequestFail(String error);

        void onRequestResponse(String response);
    }

    public interface OnItemClick{
        void onClick(int pos, View view);
    }
}
