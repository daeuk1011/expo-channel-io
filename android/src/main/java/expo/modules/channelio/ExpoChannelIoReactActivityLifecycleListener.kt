package expo.modules.channelio

import android.app.Activity
import android.util.Log
import com.zoyi.channel.plugin.android.ChannelIO
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class ExpoChannelIoReactActivityLifecycleListener : ReactActivityLifecycleListener {
    override fun onResume(activity: Activity) {
        Log.d("ExpoChannelIo", "onResume - isBooted: ${ChannelIO.isBooted()}, isVisible: ${ChannelButtonState.isVisible}")

        // 현재 Activity 저장
        ChannelButtonState.setCurrentActivity(activity)

        // onResume 중에 showChannelButton 호출해야 SDK가 버튼을 attach함
        // boot 상태와 관계없이 호출 (SDK docs: "takes effect even before boot completes")
        if (ChannelButtonState.isVisible) {
            Log.d("ExpoChannelIo", "onResume - calling showChannelButton()")
            ChannelIO.showChannelButton()
        }
    }
}

// 버튼 visibility 상태 관리
object ChannelButtonState {
    var isVisible: Boolean = true
}
