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

data class AudioFile(val id: Int, val filePath: String)

class AgoraMusicHandlerModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    private var engine: RtcEngine? = null
    private lateinit var agoraEventHandler: AgoraEventHandler
    private lateinit var audioEffectManager: IAudioEffectManager
    private val audioFilesQueue: Queue<AudioFile> = LinkedList()
    private var currentAudioFile: AudioFile? = null
    private var previousAudioFile: AudioFile? = null
    private var nextAudioFileId: Int = 0

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
        val audioFile = AudioFile(nextAudioFileId++, filePath)
        audioFilesQueue.add(audioFile)
    }

    private fun playNextAudioFile(audioFile: AudioFile?) {
        previousAudioFile = currentAudioFile
        currentAudioFile = audioFile
        audioFile?.let {
            engine?.startAudioMixing(it.filePath, false, 1, 0)
        }
    }

    @ReactMethod
    fun playMusic() {
        if (currentAudioFile == null) {
            if (audioFilesQueue.isNotEmpty()) {
                playNextAudioFile(audioFilesQueue.poll())
            }
        } else {
            engine?.startAudioMixing(currentAudioFile?.filePath, false, 1, 0)
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
        } else if (currentAudioFile != null) {
            // Restart from the beginning if queue is empty
            playNextAudioFile(audioFilesQueue.peek())
        }
    }

    @ReactMethod
    fun previous() {
        if (previousAudioFile != null) {
            playNextAudioFile(previousAudioFile)
        } else if (currentAudioFile != null) {
            // If there's no previous file, restart the current file
            engine?.startAudioMixing(currentAudioFile?.filePath, false, 1, 0)
        }
    }

    @ReactMethod
    fun preLoadMusicFiles(filePath: String) {
        val id = nextAudioFileId++
        audioEffectManager.preloadEffect(id, filePath)
    }

    @ReactMethod
    fun getDuration(promise: Promise) {
        try {
            if (engine == null) {
                throw NullPointerException("RtcEngine is not initialized")
            }

            val durations = mutableListOf<Int>()
            val iterator = audioFilesQueue.iterator()
            
            while (iterator.hasNext()) {
                val audioFile = iterator.next()
                engine?.startAudioMixing(audioFile.filePath, false, 1, 0)

                // Wait until the audio file is loaded
                Thread.sleep(1000) // Adding a delay to ensure the audio file is loaded properly
                val duration = engine?.audioMixingDuration ?: 0
                durations.add(duration)

                // Stop the audio mixing after getting the duration
                engine?.stopAudioMixing()
            }

            promise.resolve(durations)
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
    fun setAudioVolumeAsHost(volume: Int) {
        engine?.adjustAudioMixingVolume(volume)
    }

    @ReactMethod
    fun setAudioVolumeAsGuest(volume: Int) {
        engine?.adjustAudioMixingPlayoutVolume(volume)
    }

    @ReactMethod
    fun getCurrentPlayingTrack(promise: Promise) {
        try {
            promise.resolve(currentAudioFile?.filePath)
        } catch (e: Exception) {
            promise.reject("ERROR_GET_CURRENT_PLAYING_TRACK", e)
        }
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
