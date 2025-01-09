package expo.modules.channelio

import android.util.Log
import com.zoyi.channel.plugin.android.ChannelIO
import com.zoyi.channel.plugin.android.open.config.BootConfig
import com.zoyi.channel.plugin.android.open.enumerate.BootStatus
import com.zoyi.channel.plugin.android.open.enumerate.ChannelButtonPosition
import com.zoyi.channel.plugin.android.open.model.*
import com.zoyi.channel.plugin.android.open.option.ChannelButtonOption
import com.zoyi.channel.plugin.android.open.option.Language
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ExpoChannelIoModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoChannelIo")

    AsyncFunction("boot") { settings: Map<String, Any?> ->
      try {
        val pluginKey = settings["pluginKey"] as String
        val memberId = settings["memberId"] as? String
        val memberHash = settings["memberHash"] as? String

        val profileData = settings["profile"] as? Map<String, Any?>
        val profile = createUserProfileFromMap(profileData)

        val channelButtonOption = settings["channelButtonOption"] as? Map<String, Any?>
        val buttonOption = toChannelButtonOption(channelButtonOption)

        val bootConfig = BootConfig.create(pluginKey)
          .setMemberId(memberId)
          .setMemberHash(memberHash)
          .setProfile(profile)
          .setChannelButtonOption(buttonOption)

        ChannelIO.boot(bootConfig) { status, _ ->
          handleBootStatus(status)
        }
      } catch (e: Exception) {
        Log.e("ExpoChannelIo", "Boot failed", e)
      }
    }

    Function("showChannelButton") {
      ChannelIO.showChannelButton()
    }

    Function("hideChannelButton") {
      ChannelIO.hideChannelButton()
    }

    Function("showMessenger") {
      val context = appContext.currentActivity
      ChannelIO.showMessenger(context)
    }

    Function("hideMessenger") {
      ChannelIO.hideMessenger()
    }
  }

  private fun createUserProfileFromMap(profileData: Map<String, Any?>?): Profile {
    val userProfile = Profile.create()
    profileData?.forEach { (key, value) ->
      when (key) {
        "name" -> userProfile.setName(value as? String)
        "email" -> userProfile.setEmail(value as? String)
        "mobileNumber" -> userProfile.setMobileNumber(value as? String)
        "avatarUrl" -> userProfile.setAvatarUrl(value as? String)
        else -> userProfile.setProperty(key, value)
      }
    }
    return userProfile
  }

  private fun toChannelButtonOption(optionData: Map<String, Any?>?): ChannelButtonOption? {
    if (optionData == null) return null

    val icon = optionData["icon"] as? String ?: "default"
    val position = optionData["position"] as? String ?: "right"
    val xMargin = (optionData["xMargin"] as? Number)?.toFloat() ?: 0f
    val yMargin = (optionData["yMargin"] as? Number)?.toFloat() ?: 0f

    return ChannelButtonOption(ChannelButtonPosition.valueOf(position.uppercase()), xMargin, yMargin)
  }

  private fun handleBootStatus(status: BootStatus) {
    when (status) {
      BootStatus.SUCCESS -> Log.i("ChannelIO", "ChannelIO boot success")
      BootStatus.NOT_INITIALIZED -> Log.e("ChannelIO", "ChannelIO not initialized")
      BootStatus.NETWORK_TIMEOUT -> Log.e("ChannelIO", "Network timeout during ChannelIO boot")
      BootStatus.NOT_AVAILABLE_VERSION -> Log.e("ChannelIO", "Unsupported SDK version")
      BootStatus.SERVICE_UNDER_CONSTRUCTION -> Log.e("ChannelIO", "Channel Talk server under maintenance")
      BootStatus.REQUIRE_PAYMENT -> Log.e("ChannelIO", "Channel requires payment")
      BootStatus.ACCESS_DENIED -> Log.e("ChannelIO", "Access denied")
      else -> Log.e("ChannelIO", "Unknown error during ChannelIO boot")
    }
  }
}
