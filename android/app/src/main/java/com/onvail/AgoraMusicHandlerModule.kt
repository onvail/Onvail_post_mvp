package com.onvail

import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import io.agora.rtc2.*
import com.onvail.BuildConfig
import io.agora.rtc2.IAudioEffectManager
import java.util.LinkedList
import java.util.Queue

class AgoraMusicHandlerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var engine: RtcEngine? = null
    private lateinit var agoraEventHandler: AgoraEventHandler
    private lateinit var audioEffectManager: IAudioEffectManager
    private val audioFilesQueue: Queue<String> = LinkedList()
    private var currentFilePath: String? = null
    private var previousFilePath: String? = null

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
    fun addAudioFileToQueue(filePath: String) {
        audioFilesQueue.add(filePath)
        if (currentFilePath == null) {
            playNextAudioFile(audioFilesQueue.poll())
        }
    }

    private fun playNextAudioFile(filePath: String?) {
        previousFilePath = currentFilePath
        currentFilePath = filePath
        filePath?.let {
            engine?.startAudioMixing(it, false, 1, 0)
        }
    }

    @ReactMethod
    fun playMusic() {
        if (currentFilePath != null) {
            engine?.startAudioMixing(currentFilePath, false, 1, 0)
        } else if (audioFilesQueue.isNotEmpty()) {
            playNextAudioFile(audioFilesQueue.poll())
        }
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
    fun next() {
        if (audioFilesQueue.isNotEmpty()) {
            playNextAudioFile(audioFilesQueue.poll())
        }
    }

    @ReactMethod
    fun previous() {
        playNextAudioFile(previousFilePath)
    }

    @ReactMethod
    fun preLoadMusicFiles(filePath: String) {
        var id: Int = 0
        audioEffectManager.preloadEffect(id++, filePath)
    }

    @ReactMethod
    fun getDuration(promise: Promise) {
        try {
            val duration = engine?.audioMixingDuration ?: throw NullPointerException("RtcEngine is not initialized")
            promise.resolve(duration)
        } catch (e: Exception) {
            promise.reject("ERROR_GET_DURATION", e)
        }
    }

    @ReactMethod
    fun setPosition(position: Int, promise: Promise) {
        try {
            engine?.setAudioMixingPosition(position) ?: throw NullPointerException("RtcEngine is not initialized")
            promise.resolve(null)
        } catch (e: Exception) {
            promise.reject("ERROR_SET_POSITION", e)
        }
    }

    @ReactMethod
    fun getPosition(promise: Promise) {
        try {
            val position = engine?.audioMixingCurrentPosition ?: throw NullPointerException("RtcEngine is not initialized")
            promise.resolve(position)
        } catch (e: Exception) {
            promise.reject("ERROR_GET_POSITION", e)
        }
    }

    @ReactMethod
    fun setAudioVolume(volume: Int) {
        engine?.adjustAudioMixingVolume(volume)
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
