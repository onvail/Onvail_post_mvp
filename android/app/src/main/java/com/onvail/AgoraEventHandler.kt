package com.onvail

import com.facebook.react.bridge.ReactContext
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments
import com.facebook.react.modules.core.DeviceEventManagerModule
import io.agora.rtc2.IRtcEngineEventHandler
import io.agora.rtc2.RtcEngine
import java.util.LinkedList
import java.util.Queue

class AgoraEventHandler(private val reactContext: ReactContext) : IRtcEngineEventHandler() {
    private var engine: RtcEngine? = null
    private val audioFilesQueue: Queue<String> = LinkedList()
    private var currentFilePath: String? = null

    override fun onAudioMixingStateChanged(state: Int, reason: Int) {
        val params = Arguments.createMap().apply {
            putInt("state", state)
            putInt("reason", reason)
        }
        if (state == 710 && reason == 723) {
            // Play the next audio file in the queue if available
            if (audioFilesQueue.isNotEmpty()) {
                val nextFilePath = audioFilesQueue.poll()
                playNextAudioFile(nextFilePath)
            }
        }
        sendEvent("onAudioMixingStateChanged", params)
    }

    fun addAudioFileToQueue(filePath: String) {
        audioFilesQueue.add(filePath)
        if (currentFilePath == null) {
            currentFilePath = audioFilesQueue.poll()
            playNextAudioFile(currentFilePath)
        }
    }

    private fun playNextAudioFile(filePath: String?) {
        currentFilePath = filePath
        filePath?.let {
            engine?.startAudioMixing(it, false, 1, 0)
        }
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
