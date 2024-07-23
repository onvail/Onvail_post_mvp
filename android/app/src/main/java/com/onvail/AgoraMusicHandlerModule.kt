package com.onvail

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import io.agora.rtc2.*
import com.onvail.BuildConfig
import io.agora.rtc2.IAudioEffectManager

class AgoraMusicHandlerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var engine: RtcEngine? = null
    private lateinit var agoraEventHandler: IRtcEngineEventHandler
    private lateinit var audioEffectManager: IAudioEffectManager

    init {
        try {
            agoraEventHandler = AgoraEventHandler(reactContext)
            val appId = BuildConfig.AGORA_APP_ID
            engine = RtcEngine.create(reactContext, appId, agoraEventHandler)
            audioEffectManager = engine!!.audioEffectManager
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    override fun getName(): String = "AgoraMusicHandler"

    @ReactMethod
    fun playMusic(filePath: String) {
        engine?.startAudioMixing(filePath, false, 1, 0)
    }

    @ReactMethod
    fun stopMusic() {
        engine?.stopAudioMixing()
    }

    @ReactMethod
    fun pauseMusic() {
        engine?.pauseAudioMixing()
    }

    @ReactMethod
    fun resumeMusic() {
        engine?.resumeAudioMixing()
    }

    @ReactMethod
    fun preLoadMusicFiles(filePath: String) {
        // Sets the audio effect ID.
        var id: Int = 0
        // Preloads the specified local audio effect file into the memory.
        audioEffectManager.preloadEffect(id++, filePath)
        // Unloads the preloaded audio effect file.
        // audioEffectManager.unloadEffect(id)
    }

    @ReactMethod
    fun getDuration(promise: Promise) {
        try {
            // Ensure engine is not null before accessing it
            val duration = engine?.audioMixingDuration ?: throw NullPointerException("RtcEngine is not initialized")
            promise.resolve(duration)
        } catch (e: Exception) {
            promise.reject("ERROR_GET_DURATION", e)
        }
    }

    @ReactMethod
    fun setPosition(position: Int, promise: Promise) {
        try {
            // Ensure engine is not null before accessing it
            engine?.setAudioMixingPosition(position) ?: throw NullPointerException("RtcEngine is not initialized")
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR_SET_POSITION", e)
        }
    }

    @ReactMethod
    fun getPosition(promise: Promise) {
        try {
            // Ensure engine is not null before accessing it
            val position = engine?.audioMixingCurrentPosition ?: throw NullPointerException("RtcEngine is not initialized")
            promise.resolve(position)
        } catch (e: Exception) {
            promise.reject("ERROR_GET_POSITION", e)
        }
    }

    @ReactMethod
    fun setAudioVolume(volume: Int){
        engine?.adjustAudioMixingVolume(volume);
    }

    @ReactMethod
    fun addListener(eventName: String) {
        // Keep track of listeners if needed
    }

    @ReactMethod
    fun removeListeners(count: Int) {
        // Remove listeners if needed
    }
}
