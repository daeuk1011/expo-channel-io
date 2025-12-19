package expo.modules.channelio

import com.zoyi.channel.plugin.android.ChannelIO

import android.app.Application
import expo.modules.core.interfaces.ApplicationLifecycleListener

class ExpoChannelIoApplicationLifecycleListener : ApplicationLifecycleListener {
    override fun onCreate(application: Application) {
        ChannelIO.initialize(application)
        // Activity가 shown되기 전에 호출해야 버튼이 표시됨
        // "The function takes effect even if it was called before boot() completes."
        ChannelIO.showChannelButton()
    }
}
