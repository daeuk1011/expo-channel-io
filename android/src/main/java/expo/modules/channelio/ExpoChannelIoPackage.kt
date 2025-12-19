package expo.modules.channelio

import android.app.Activity
import android.content.Context
import expo.modules.core.interfaces.ApplicationLifecycleListener
import expo.modules.core.interfaces.Package
import expo.modules.core.interfaces.ReactActivityLifecycleListener

class ExpoChannelIoPackage : Package {
  override fun createApplicationLifecycleListeners(context: Context): List<ApplicationLifecycleListener> {
    return listOf(ExpoChannelIoApplicationLifecycleListener())
  }

  override fun createReactActivityLifecycleListeners(activityContext: Context): List<ReactActivityLifecycleListener> {
    return listOf(ExpoChannelIoReactActivityLifecycleListener())
  }
}