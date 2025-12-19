package expo.modules.channelio

import android.app.Activity
import android.os.Handler
import android.os.Looper
import android.util.Log
import com.zoyi.channel.plugin.android.ChannelIO
import expo.modules.core.interfaces.ReactActivityLifecycleListener
import java.lang.ref.WeakReference

class ExpoChannelIoReactActivityLifecycleListener : ReactActivityLifecycleListener {
    override fun onResume(activity: Activity) {
        Log.d("ExpoChannelIo", "onResume - isBooted: ${ChannelIO.isBooted()}, isVisible: ${ChannelButtonState.isVisible}")

        // 현재 Activity 저장
        ChannelButtonState.setCurrentActivity(activity)

        // Activity가 resumed 될 때 버튼 visibility 상태 적용
        if (ChannelIO.isBooted() && ChannelButtonState.isVisible) {
            Log.d("ExpoChannelIo", "onResume - calling showChannelButton()")
            ChannelIO.showChannelButton()
        } else if (!ChannelIO.isBooted() && ChannelButtonState.isVisible) {
            // Boot가 아직 완료되지 않은 경우, 완료 시 콜백 등록
            Log.d("ExpoChannelIo", "onResume - boot not complete, registering callback")
            ChannelButtonState.onBootCompleted {
                Log.d("ExpoChannelIo", "bootCompletedCallback - executing on activity: $activity")
                // Activity가 아직 유효한지 확인
                if (!activity.isFinishing && !activity.isDestroyed) {
                    Handler(Looper.getMainLooper()).post {
                        Log.d("ExpoChannelIo", "bootCompletedCallback - calling showChannelButton on UI thread")
                        ChannelIO.showChannelButton()
                    }
                }
            }
        }
    }
}

// 버튼 visibility 상태 관리
object ChannelButtonState {
    var isVisible: Boolean = true
    private var currentActivity: WeakReference<Activity>? = null
    private val bootCompletedCallbacks = mutableListOf<() -> Unit>()

    fun setCurrentActivity(activity: Activity) {
        currentActivity = WeakReference(activity)
        Log.d("ExpoChannelIo", "ChannelButtonState - setCurrentActivity: $activity")
    }

    fun getCurrentActivity(): Activity? = currentActivity?.get()

    @Synchronized
    fun onBootCompleted(callback: () -> Unit) {
        bootCompletedCallbacks.add(callback)
        Log.d("ExpoChannelIo", "ChannelButtonState - registered callback, total: ${bootCompletedCallbacks.size}")
    }

    @Synchronized
    fun notifyBootCompleted() {
        Log.d("ExpoChannelIo", "ChannelButtonState - notifyBootCompleted, callbacks: ${bootCompletedCallbacks.size}")
        val callbacks = bootCompletedCallbacks.toList()
        bootCompletedCallbacks.clear()
        callbacks.forEach {
            try {
                it()
            } catch (e: Exception) {
                Log.e("ExpoChannelIo", "Error executing boot callback", e)
            }
        }
    }

    fun clearCallbacks() {
        bootCompletedCallbacks.clear()
    }
}
