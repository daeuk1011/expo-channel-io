package expo.modules.channelio

import com.zoyi.channel.plugin.android.ChannelIO

import android.app.Application
import expo.modules.core.interfaces.ApplicationLifecycleListener

class ExpoChannelIoApplicationLifecycleListener : ApplicationLifecycleListener {
    override fun onCreate(application: Application) {
        ChannelIO.initialize(application, true)
    }
}
