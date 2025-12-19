package expo.modules.channelio

import android.app.Activity
import android.util.Log
import com.zoyi.channel.plugin.android.ChannelIO
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class ExpoChannelIoReactActivityLifecycleListener : ReactActivityLifecycleListener {
    override fun onResume(activity: Activity) {
        Log.d("ExpoChannelIo", "onResume - isBooted: ${ChannelIO.isBooted()}, isVisible: ${ChannelButtonState.isVisible}")
        // Activity가 resumed 될 때 버튼 visibility 상태 적용
        if (ChannelIO.isBooted() && ChannelButtonState.isVisible) {
            Log.d("ExpoChannelIo", "onResume - calling showChannelButton()")
            ChannelIO.showChannelButton()
        }
    }
}

// 버튼 visibility 상태 관리
object ChannelButtonState {
    var isVisible: Boolean = true
}
