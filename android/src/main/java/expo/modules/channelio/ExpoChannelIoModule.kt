package expo.modules.channelio

import android.util.Log
import com.zoyi.channel.plugin.android.ChannelIO
import com.zoyi.channel.plugin.android.open.config.BootConfig
import com.zoyi.channel.plugin.android.open.enumerate.BootStatus
import com.zoyi.channel.plugin.android.open.enumerate.ChannelButtonPosition
import com.zoyi.channel.plugin.android.open.model.*
import com.zoyi.channel.plugin.android.open.option.ChannelButtonOption
import com.zoyi.channel.plugin.android.open.option.Language
import com.zoyi.channel.plugin.android.open.listener.ChannelPluginListener
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.Promise
import io.channel.plugin.android.open.model.Appearance

class ExpoChannelIoModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ExpoChannelIo")

    Events(
      "onBadgeChanged",
      "onChatCreated",
      "onFollowUpChanged",
      "onUrlClicked",
      "onPopupDataReceived",
      "onShowMessenger",
      "onHideMessenger"
    )

    OnCreate {
      try {
          ChannelIO.setListener(pluginListener)
      } catch (e: Exception) {
        Log.e("ExpoChannelIo", "Failed to initialize ChannelIO", e)
      }
    }

    OnDestroy {
      ChannelIO.setListener(null)
    }

    AsyncFunction("boot") { settings: BootConfigRecord, promise: Promise ->
      try {
        val pluginKey = settings.pluginKey
        if (pluginKey.isEmpty()) {
          promise.reject("INVALID_PLUGIN_KEY", "Plugin key is required", null)
          return@AsyncFunction
        }

        val memberId = settings.memberId
        val memberHash = settings.memberHash
        val profile = createProfileFromMap(settings.profile)

        val language = parseLanguage(settings.language)
        val appearance = parseAppearance(settings.appearance)
        val buttonOption = toChannelButtonOptionFromRecord(settings.channelButtonOption)

        val bootConfig = BootConfig.create(pluginKey)
          .setMemberId(memberId)
          .setMemberHash(memberHash)
          .setProfile(profile)
          .setChannelButtonOption(buttonOption)
          .setLanguage(language)
          .setAppearance(appearance)

        settings.hidePopup?.let {
          bootConfig.setHidePopup(it)
        }

        settings.trackDefaultEvent?.let {
          bootConfig.setTrackDefaultEvent(it)
        }

        settings.unsubscribeEmail?.let {
          bootConfig.setUnsubscribeEmail(it)
        }

        settings.unsubscribeTexting?.let {
          bootConfig.setUnsubscribeTexting(it)
        }

        val hideChannelButtonOnBoot = settings.hideChannelButtonOnBoot ?: false
        Log.d("ExpoChannelIo", "boot - hideChannelButtonOnBoot: $hideChannelButtonOnBoot")

        ChannelIO.boot(bootConfig) { bootStatus, user ->
          Log.d("ExpoChannelIo", "boot callback - status: $bootStatus")
          if (bootStatus == BootStatus.SUCCESS && hideChannelButtonOnBoot) {
            Log.d("ExpoChannelIo", "boot callback - hiding channel button")
            ChannelIO.hideChannelButton()
          }
          val result = mapOf(
            "status" to convertBootStatus(bootStatus),
            "user" to if (user != null) convertUser(user) else null
          )
          promise.resolve(result)
        }
      } catch (e: Exception) {
        promise.reject("BOOT_FAILED", e.message, e)
      }
    }

    Function("sleep") {
      ChannelIO.sleep()
    }

    Function("shutdown") {
      ChannelIO.shutdown()
    }

    Function("showChannelButton") {
      Log.d("ExpoChannelIo", "showChannelButton called")
      ChannelIO.showChannelButton()
    }

    Function("hideChannelButton") {
      Log.d("ExpoChannelIo", "hideChannelButton called")
      ChannelIO.hideChannelButton()
    }

    Function("showMessenger") {
      val context = appContext.currentActivity
      if (context != null) {
        ChannelIO.showMessenger(context)
      } else {
        Log.e("ExpoChannelIo", "No current activity available")
      }
    }

    Function("hideMessenger") {
      ChannelIO.hideMessenger()
    }

    Function("hidePopup") {
      ChannelIO.hidePopup()
    }

    Function("openChat") { chatId: String?, message: String? ->
      val context = appContext.currentActivity
      if (context != null) {
        ChannelIO.openChat(context, chatId, message)
      } else {
        Log.e("ExpoChannelIo", "No current activity available")
      }
    }

    Function("openWorkflow") { workflowId: String? ->
      val context = appContext.currentActivity
      if (context != null) {
        ChannelIO.openWorkflow(context, workflowId)
      } else {
        Log.e("ExpoChannelIo", "No current activity available")
      }
    }

    AsyncFunction("updateUser") { userInfo: UserDataRecord, promise: Promise ->
      try {
        val userData = createUserDataFromRecord(userInfo)
        ChannelIO.updateUser(userData) { e: Exception?, user: User? ->
          if (e != null) {
            promise.reject("UPDATE_USER_FAILED", e.message ?: "Unknown error", e)
          } else if (user != null) {
            promise.resolve(convertUser(user))
          } else {
            promise.reject("UPDATE_USER_FAILED", "Unknown error", null)
          }
        }
      } catch (e: Exception) {
        promise.reject("UPDATE_USER_FAILED", e.message, e)
      }
    }

    AsyncFunction("addTags") { tags: List<String>, promise: Promise ->
      try {
        ChannelIO.addTags(tags) { e: Exception?, user: User? ->
          if (e != null) {
            promise.reject("ADD_TAGS_FAILED", e.message ?: "Unknown error", e)
          } else {
            val result = mapOf(
              "user" to if (user != null) convertUser(user) else null
            )
            promise.resolve(result)
          }
        }
      } catch (e: Exception) {
        promise.reject("ADD_TAGS_FAILED", e.message, e)
      }
    }

    AsyncFunction("removeTags") { tags: List<String>, promise: Promise ->
      try {
        ChannelIO.removeTags(tags) { e: Exception?, user: User? ->
          if (e != null) {
            promise.reject("REMOVE_TAGS_FAILED", e.message ?: "Unknown error", e)
          } else {
            val result = mapOf(
              "user" to if (user != null) convertUser(user) else null
            )
            promise.resolve(result)
          }
        }
      } catch (e: Exception) {
        promise.reject("REMOVE_TAGS_FAILED", e.message, e)
      }
    }

    Function("track") { eventName: String, eventProperties: Map<String, Any?>? ->
      try {
        ChannelIO.track(eventName, eventProperties)
      } catch (e: Exception) {
        Log.e("ExpoChannelIo", "Track failed", e)
      }
    }

    Function("setPage") { page: String?, profileData: Map<String, Any?>? ->
      try {
        ChannelIO.setPage(page, profileData)
      } catch (e: Exception) {
        Log.e("ExpoChannelIo", "SetPage failed", e)
      }
    }

    Function("resetPage") {
      ChannelIO.resetPage()
    }

    Function("isBooted") {
      return@Function ChannelIO.isBooted()
    }

    Function("setDebugMode") { isDebugMode: Boolean ->
      ChannelIO.setDebugMode(isDebugMode)
    }

    Function("setAppearance") { appearance: String ->
      ChannelIO.setAppearance(parseAppearance(appearance))
    }

    // 푸시 토큰 등록
    Function("initPushToken") { token: String ->
      ChannelIO.initPushToken(token)
    }

    // 채널톡 푸시 알림인지 확인 (Android에서는 Map<String, String> 타입 필요)
    AsyncFunction("isChannelPushNotification") { userInfo: Map<String, Any?>, promise: Promise ->
      try {
        val stringMap = userInfo.mapValues { it.value?.toString() ?: "" }
        val isChannel = ChannelIO.isChannelPushNotification(stringMap)
        promise.resolve(isChannel)
      } catch (e: Exception) {
        promise.resolve(false)
      }
    }

    // 저장된 푸시 알림 확인
    AsyncFunction("hasStoredPushNotification") { promise: Promise ->
      val context = appContext.currentActivity
      if (context != null) {
        promise.resolve(ChannelIO.hasStoredPushNotification(context))
      } else {
        promise.resolve(false)
      }
    }

    // 저장된 푸시 알림 열기
    Function("openStoredPushNotification") {
      val context = appContext.currentActivity
      if (context != null) {
        ChannelIO.openStoredPushNotification(context)
      }
    }

    // 콜백 정리
    Function("clearCallbacks") {
      ChannelIO.setListener(null)
      ChannelIO.setListener(pluginListener)
    }
  }

  private val pluginListener = object : ChannelPluginListener {
    // Deprecated 버전도 구현
    override fun onBadgeChanged(count: Int) {
      sendEvent("onBadgeChanged", mapOf(
        "unread" to count,
        "alert" to count
      ))
    }

    // 새 버전
    override fun onBadgeChanged(unread: Int, alert: Int) {
      sendEvent("onBadgeChanged", mapOf(
        "unread" to unread,
        "alert" to alert
      ))
    }

    override fun onChatCreated(chatId: String?) {
      sendEvent("onChatCreated", mapOf(
        "chatId" to chatId
      ))
    }

    override fun onFollowUpChanged(profile: Map<String, String>) {
      sendEvent("onFollowUpChanged", mapOf(
        "profile" to profile
      ))
    }

    override fun onUrlClicked(url: String?): Boolean {
      sendEvent("onUrlClicked", mapOf(
        "url" to url
      ))
      return false
    }

    override fun onPopupDataReceived(popupData: PopupData?) {
      sendEvent("onPopupDataReceived", mapOf(
        "chatId" to popupData?.chatId,
        "avatarUrl" to popupData?.avatarUrl,
        "name" to popupData?.name,
        "message" to popupData?.message
      ))
    }

    override fun onShowMessenger() {
      sendEvent("onShowMessenger", emptyMap<String, Any>())
    }

    override fun onHideMessenger() {
      sendEvent("onHideMessenger", emptyMap<String, Any>())
    }

    override fun onPushNotificationClicked(chatId: String?): Boolean {
      return false
    }
  }

  private fun createProfileFromMap(profileData: Map<String, Any?>?): Profile {
    val profile = Profile.create()

    if (profileData == null) return profile

    (profileData["name"] as? String)?.let {
      if (it.isNotBlank()) profile.setName(it)
    }
    (profileData["email"] as? String)?.let {
      if (it.isNotBlank()) profile.setEmail(it)
    }
    (profileData["mobileNumber"] as? String)?.let {
      if (it.isNotBlank()) profile.setMobileNumber(it)
    } ?: (profileData["phoneNumber"] as? String)?.let {
      if (it.isNotBlank()) profile.setMobileNumber(it)
    }
    (profileData["avatarUrl"] as? String)?.let {
      if (it.isNotBlank()) profile.setAvatarUrl(it)
    }

    val reservedKeys = setOf("name", "email", "mobileNumber", "phoneNumber", "avatarUrl")
    profileData.forEach { (key, value) ->
      if (!reservedKeys.contains(key) && value != null) {
        profile.setProperty(key, value)
      }
    }

    return profile
  }

  private fun createUserDataFromMap(userInfo: Map<String, Any?>): UserData {
    val builder = UserData.Builder()

    // language 처리
    (userInfo["language"] as? String)?.let {
      builder.setLanguage(parseLanguage(it))
    }

    // tags 처리
    @Suppress("UNCHECKED_CAST")
    (userInfo["tags"] as? List<String>)?.let {
      builder.setTags(it)
    }

    // profile 처리
    @Suppress("UNCHECKED_CAST")
    (userInfo["profile"] as? Map<String, Any?>)?.let { profileData ->
      val profileMap = mutableMapOf<String, Any>()
      profileData.forEach { (key, value) ->
        if (value != null) {
          profileMap[key] = value
        }
      }
      if (profileMap.isNotEmpty()) {
        builder.setProfileMap(profileMap)
      }
    }

    // profileOnce 처리
    @Suppress("UNCHECKED_CAST")
    (userInfo["profileOnce"] as? Map<String, Any?>)?.let { profileOnceData ->
      val profileOnceMap = mutableMapOf<String, Any>()
      profileOnceData.forEach { (key, value) ->
        if (value != null) {
          profileOnceMap[key] = value
        }
      }
      if (profileOnceMap.isNotEmpty()) {
        builder.setProfileOnceMap(profileOnceMap)
      }
    }

    // unsubscribeEmail 처리
    (userInfo["unsubscribeEmail"] as? Boolean)?.let {
      builder.setUnsubscribeEmail(it)
    }

    // unsubscribeTexting 처리
    (userInfo["unsubscribeTexting"] as? Boolean)?.let {
      builder.setUnsubscribeTexting(it)
    }

    return builder.build()
  }

  private fun toChannelButtonOption(optionData: Map<String, Any?>?): ChannelButtonOption? {
    if (optionData == null) return null

    val position = parseButtonPosition(optionData["position"] as? String)
    val xMargin = (optionData["xMargin"] as? Number)?.toFloat() ?: 0f
    val yMargin = (optionData["yMargin"] as? Number)?.toFloat() ?: 0f

    return ChannelButtonOption(position, xMargin, yMargin)
  }

  private fun toChannelButtonOptionFromRecord(optionData: ChannelButtonOptionRecord?): ChannelButtonOption? {
    if (optionData == null) return null

    val position = parseButtonPosition(optionData.position)
    val xMargin = optionData.xMargin?.toFloat() ?: 0f
    val yMargin = optionData.yMargin?.toFloat() ?: 0f

    return ChannelButtonOption(position, xMargin, yMargin)
  }

  private fun createUserDataFromRecord(userInfo: UserDataRecord): UserData {
    val builder = UserData.Builder()

    userInfo.language?.let {
      builder.setLanguage(parseLanguage(it))
    }

    userInfo.tags?.let {
      builder.setTags(it)
    }

    userInfo.profile?.let { profileData ->
      val profileMap = mutableMapOf<String, Any>()
      profileData.forEach { (key, value) ->
        if (value != null) {
          profileMap[key] = value
        }
      }
      if (profileMap.isNotEmpty()) {
        builder.setProfileMap(profileMap)
      }
    }

    userInfo.profileOnce?.let { profileOnceData ->
      val profileOnceMap = mutableMapOf<String, Any>()
      profileOnceData.forEach { (key, value) ->
        if (value != null) {
          profileOnceMap[key] = value
        }
      }
      if (profileOnceMap.isNotEmpty()) {
        builder.setProfileOnceMap(profileOnceMap)
      }
    }

    userInfo.unsubscribeEmail?.let {
      builder.setUnsubscribeEmail(it)
    }

    userInfo.unsubscribeTexting?.let {
      builder.setUnsubscribeTexting(it)
    }

    return builder.build()
  }

  private fun convertBootStatus(status: BootStatus): String {
    return when (status) {
      BootStatus.SUCCESS -> "success"
      BootStatus.NOT_INITIALIZED -> "notInitialized"
      BootStatus.NETWORK_TIMEOUT -> "networkTimeout"
      BootStatus.NOT_AVAILABLE_VERSION -> "notAvailableVersion"
      BootStatus.SERVICE_UNDER_CONSTRUCTION -> "serviceUnderConstruction"
      BootStatus.REQUIRE_PAYMENT -> "requirePayment"
      BootStatus.ACCESS_DENIED -> "accessDenied"
      else -> "unknown"
    }
  }

  private fun convertUser(user: User): Map<String, Any?> {
    return mapOf(
      "id" to user.id,
      "memberId" to user.memberId,
      "name" to user.name,
      "avatarUrl" to user.avatarUrl,
      "unread" to user.unread,
      "alert" to user.alert,
      "profile" to user.profile,
      "tags" to user.tags,
      "language" to user.language
    )
  }

  private fun parseLanguage(language: String?): Language {
    return when (language?.lowercase()) {
      "ko", "korean" -> Language.KOREAN
      "en", "english" -> Language.ENGLISH
      "ja", "japanese" -> Language.JAPANESE
      else -> Language.KOREAN
    }
  }

  private fun parseAppearance(appearance: String?): Appearance {
    return when (appearance?.lowercase()) {
      "light" -> Appearance.LIGHT
      "dark" -> Appearance.DARK
      else -> Appearance.SYSTEM
    }
  }

  private fun parseButtonPosition(position: String?): ChannelButtonPosition {
    return when (position?.lowercase()) {
      "left" -> ChannelButtonPosition.LEFT
      else -> ChannelButtonPosition.RIGHT
    }
  }
}
