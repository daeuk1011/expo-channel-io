package expo.modules.channelio

import android.app.Application
import android.util.Log
import com.zoyi.channel.plugin.android.ChannelIO
import expo.modules.core.interfaces.ApplicationLifecycleListener

class ExpoChannelIoApplicationLifecycleListener : ApplicationLifecycleListener {
    override fun onCreate(application: Application) {
        Log.d("ExpoChannelIo", "Application.onCreate - initializing ChannelIO")
        ChannelIO.initialize(application)
    }
}
