package expo.modules.channelio

import expo.modules.kotlin.records.Field
import expo.modules.kotlin.records.Record

class ChannelButtonOptionRecord : Record {
    @Field
    val icon: String? = null

    @Field
    val position: String? = null

    @Field
    val xMargin: Double? = null

    @Field
    val yMargin: Double? = null
}

class BootConfigRecord : Record {
    @Field
    val pluginKey: String = ""

    @Field
    val memberId: String? = null

    @Field
    val memberHash: String? = null

    @Field
    val profile: Map<String, Any?>? = null

    @Field
    val language: String? = null

    @Field
    val appearance: String? = null

    @Field
    val channelButtonOption: ChannelButtonOptionRecord? = null

    @Field
    val hideChannelButtonOnBoot: Boolean? = null

    @Field
    val hidePopup: Boolean? = null

    @Field
    val trackDefaultEvent: Boolean? = null

    @Field
    val unsubscribeEmail: Boolean? = null

    @Field
    val unsubscribeTexting: Boolean? = null
}

class UserDataRecord : Record {
    @Field
    val language: String? = null

    @Field
    val tags: List<String>? = null

    @Field
    val profile: Map<String, Any?>? = null

    @Field
    val profileOnce: Map<String, Any?>? = null

    @Field
    val unsubscribeEmail: Boolean? = null

    @Field
    val unsubscribeTexting: Boolean? = null
}
