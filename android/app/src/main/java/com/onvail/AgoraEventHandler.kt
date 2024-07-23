package com.onvail

import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import io.agora.rtc2.IRtcEngineEventHandler

class AgoraEventHandler(private val reactContext: ReactContext) : IRtcEngineEventHandler() {

    override fun onAudioMixingStateChanged(state: Int, reason: Int) {
        val params = Arguments.createMap().apply {
            putInt("state", state)
            putInt("reason", reason)
        }
        sendEvent("onAudioMixingStateChanged", params)
    }

    override fun onError(err: Int) {
        val params = Arguments.createMap().apply {
            putInt("err", err)
        }
        sendEvent("onError", params)
    }

    override fun onJoinChannelSuccess(channel: String?, uid: Int, elapsed: Int) {
        val params = Arguments.createMap().apply {
            putString("channel", channel)
            putInt("uid", uid)
            putInt("elapsed", elapsed)
        }
        sendEvent("onJoinChannelSuccess", params)
    }

    private fun sendEvent(eventName: String, params: WritableMap) {
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit(eventName, params)
    }
}
