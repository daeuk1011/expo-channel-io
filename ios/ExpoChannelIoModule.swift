import ExpoModulesCore
import ChannelIOFront

public class ExpoChannelIoModule: Module {
    public func definition() -> ModuleDefinition {
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
            ChannelIO.delegate = self
        }
        
        OnDestroy {
            ChannelIO.delegate = nil
        }
        
        // Boot - 채널 초기화 (비동기)
        AsyncFunction("boot") { (bootConfig: [String: Any], promise: Promise) in
            guard let pluginKey = bootConfig["pluginKey"] as? String, !pluginKey.isEmpty else {
                promise.reject("INVALID_PLUGIN_KEY", "Plugin key is required")
                return
            }

            let config = CHTBootConfig(pluginKey: pluginKey)

            if let memberId = bootConfig["memberId"] as? String {
                config.memberId = memberId
            }

            if let profile = bootConfig["profile"] as? [String: Any] {
                config.profile = self.buildInitProfile(from: profile)
            }

            if let language = bootConfig["language"] as? String {
                config.language = self.parseLanguage(language)
            }

            if let appearance = bootConfig["appearance"] as? String {
                config.appearance = self.parseAppearance(appearance)
            }

            if let channelButtonOption = bootConfig["channelButtonOption"] as? [String: Any] {
                config.channelButtonOption = self.buildChannelButtonOption(from: channelButtonOption)
            }
            
            ChannelIO.boot(with: config) { status, user in
                let result: [String: Any] = [
                    "status": self.convertBootStatus(status),
                    "user": user != nil ? self.convertUser(user: user!) : NSNull()
                ]
                promise.resolve(result)
            }
        }
        
        // Sleep - 일부 기능 비활성화
        Function("sleep") {
            ChannelIO.sleep()
        }
        
        // Shutdown - 완전 종료
        Function("shutdown") {
            ChannelIO.shutdown()
        }
        
        // 채널 버튼 표시/숨김
        Function("showChannelButton") {
            ChannelIO.showChannelButton()
        }
        
        Function("hideChannelButton") {
            ChannelIO.hideChannelButton()
        }
        
        // 메신저 표시/숨김
        Function("showMessenger") {
            NSLog("[ExpoChannelIo] showMessenger")
            ChannelIO.showMessenger()
        }
        
        Function("hideMessenger") {
            ChannelIO.hideMessenger()
        }
        
        // 팝업 숨김
        Function("hidePopup") {
            ChannelIO.hidePopup()
        }
        
        // 채팅 열기
        Function("openChat") { (chatId: String?, message: String?) in
            DispatchQueue.main.async {
                ChannelIO.openChat(with: chatId, message: message)
            }
        }

        // 워크플로우 열기
        Function("openWorkflow") { (workflowId: String?) in
            DispatchQueue.main.async {
                ChannelIO.openWorkflow(with: workflowId)
            }
        }
        
        // 사용자 정보 업데이트 (비동기)
        AsyncFunction("updateUser") { (userInfo: [String: Any], promise: Promise) in
            let profileDict = self.buildProfile(from: userInfo)

            let param = CHTUpdateUserParamBuilder().with(profile: profileDict).build()
            
            ChannelIO.updateUser(param: param) { (error, user) in
                if let user = user, error != nil {
                    promise.resolve(user)
                } else if let error = error {
                    promise.reject("UPDATE_USER_FAILED", error.localizedDescription)
                }
            }
        }
        
        // 태그 추가 (비동기)
        AsyncFunction("addTags") { (tags: [String], promise: Promise) in
            ChannelIO.addTags(tags) { error, user in
                if let error = error {
                    promise.reject("ADD_TAGS_FAILED", error.localizedDescription)
                } else {
                    let result: [String: Any] = [
                        "user": user != nil ? self.convertUser(user: user!) : NSNull()
                    ]
                    promise.resolve(result)
                }
            }
        }
        
        // 태그 제거 (비동기)
        AsyncFunction("removeTags") { (tags: [String], promise: Promise) in
            ChannelIO.removeTags(tags) { error, user in
                if let error = error {
                    promise.reject("REMOVE_TAGS_FAILED", error.localizedDescription)
                } else {
                    let result: [String: Any] = [
                        "user": user != nil ? self.convertUser(user: user!) : NSNull()
                    ]
                    promise.resolve(result)
                }
            }
        }
        
        // 이벤트 추적
        Function("track") { (eventName: String, eventProperties: [String: Any]?) in
            let properties = self.convertEventProperties(eventProperties)
            ChannelIO.track(eventName: eventName, eventProperty: properties)
        }
        
        // 페이지 설정
        Function("setPage") { (page: String, profile: [String: Any]) in
            let userProfile = self.buildProfile(from: profile)
            ChannelIO.setPage(page, profile: userProfile)
        }
        
        // 페이지 리셋
        Function("resetPage") {
            ChannelIO.resetPage()
        }
        
        // 부팅 상태 확인
        Function("isBooted") { () -> Bool in
            return ChannelIO.isBooted
        }
        
        // 디버그 모드 설정
        Function("setDebugMode") { (enabled: Bool) in
            ChannelIO.setDebugMode(with: enabled)
        }
        
        // 테마 설정
        Function("setAppearance") { (appearance: String) in
            let appearanceEnum = self.parseAppearance(appearance)
            ChannelIO.setAppearance(appearanceEnum)
        }
    }
}

extension ExpoChannelIoModule {
    private func buildInitProfile(from data: [String: Any]) -> CHTProfile {
        let profile = CHTProfile()

        if let name = data["name"] as? String, !name.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            profile.set(name: name)
        }

        if let email = data["email"] as? String, !email.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            profile.set(email: email)
        }

        if let mobileNumber = data["mobileNumber"] as? String, !mobileNumber.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            profile.set(mobileNumber: mobileNumber)
        } else if let phoneNumber = data["phoneNumber"] as? String, !phoneNumber.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            profile.set(mobileNumber: phoneNumber)
        }

        if let avatarUrl = data["avatarUrl"] as? String, !avatarUrl.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty {
            profile.set(avatarUrl: avatarUrl)
        }

        let reservedKeys = ["name", "email", "mobileNumber", "avatarUrl"]
        for (key, value) in data {
            guard !reservedKeys.contains(key) else { continue }

            profile.set(propertyKey: key, value: value as AnyObject)
        }

        return profile
    }

    private func buildProfile(from data: [String: Any]) -> [String: Any] {
        var profile: [String: Any] = [:]
        
        // 기본 필드들
        if let name = data["name"] as? String, !name.isEmpty {
            profile["name"] = name
        }
        
        if let email = data["email"] as? String, !email.isEmpty {
            profile["email"] = email
        }
        
        if let mobileNumber = data["mobileNumber"] as? String, !mobileNumber.isEmpty {
            profile["mobileNumber"] = mobileNumber
        } else if let phoneNumber = data["phoneNumber"] as? String, !phoneNumber.isEmpty {
            profile["mobileNumber"] = phoneNumber
        }
        
        if let avatarUrl = data["avatarUrl"] as? String, !avatarUrl.isEmpty {
            profile["avatarUrl"] = avatarUrl
        }
        
        // 커스텀 프로퍼티들
        let reservedKeys = ["name", "email", "mobileNumber", "avatarUrl"]
        for (key, value) in data {
            guard !reservedKeys.contains(key) else { continue }
            
            if let stringValue = value as? String, !stringValue.isEmpty {
                profile[key] = stringValue
            } else if let numberValue = value as? NSNumber {
                profile[key] = numberValue
            } else if let boolValue = value as? Bool {
                profile[key] = NSNumber(value: boolValue)
            }
        }
        
        return profile
    }
    
    private func buildChannelButtonOption(from data: [String: Any]) -> CHTChannelButtonOption {
        let icon = parseButtonIcon(data["icon"] as? String ?? "channel")
        let position = parseButtonPosition(data["position"] as? String ?? "right")
        let xMargin = (data["xMargin"] as? NSNumber)?.floatValue ?? 0.0
        let yMargin = (data["yMargin"] as? NSNumber)?.floatValue ?? 0.0
        
        return ChannelButtonOption(icon: icon, position: position, xMargin: xMargin, yMargin: yMargin)
    }
    
    private func buildBubbleOption(from data: [String: Any]) -> BubbleOption {
        let position = parseBubblePosition(data["position"] as? String ?? "bottom")
        let yMargin = (data["yMargin"] as? NSNumber)?.floatValue ?? 0.0
        
        return BubbleOption(position: position, yMargin: yMargin)
    }
    
    private func convertBootStatus(_ status: BootStatus) -> String {
        switch status {
        case .success: return "success"
        case .notInitialized: return "notInitialized"
        case .networkTimeout: return "networkTimeout"
        case .notAvailableVersion: return "notAvailableVersion"
        case .serviceUnderConstruction: return "serviceUnderConstruction"
        case .requirePayment: return "requirePayment"
        case .accessDenied: return "accessDenied"
        case .unknown: return "unknown"
        @unknown default: return "unknown"
        }
    }
    
    private func convertUser(user: CHTUser) -> [String: Any] {
        var userDict: [String: Any] = [:]
        
        userDict["memberId"] = user.memberId
        userDict["name"] = user.name
        userDict["avatarUrl"] = user.avatarUrl        
        userDict["unread"] = user.unread
        
        return userDict
    }
    

    private func convertEventProperties(_ properties: [String: Any]?) -> [String: NSObject]? {
        guard let properties = properties else { return nil }
        
        var converted: [String: NSObject] = [:]
        
        for (key, value) in properties {
            if let stringValue = value as? String {
                converted[key] = stringValue as NSString
            } else if let numberValue = value as? NSNumber {
                converted[key] = numberValue
            } else if let boolValue = value as? Bool {
                converted[key] = boolValue as NSNumber
            }
        }
        
        return converted.isEmpty ? nil : converted
    }
    
    private func parseLanguage(_ language: String) -> CHTLanguageOption {
        switch language.lowercased() {
        case "ko": return .korean
        case "en": return .english
        case "ja": return .japanese
        case "device": return .device
        default: return .device
        }
    }
    
    private func parseAppearance(_ appearance: String) -> Appearance {
        switch appearance.lowercased() {
        case "light": return .light
        case "dark": return .dark
        case "system": return .system
        default: return .system
        }
    }
    
    private func parseButtonPosition(_ position: String) -> ChannelButtonPosition {
        switch position.lowercased() {
        case "left": return .left
        case "right": return .right
        default: return .right
        }
    }
    
    private func parseBubblePosition(_ position: String) -> BubblePosition {
        switch position.lowercased() {
        case "top": return .top
        case "bottom": return .bottom
        default: return .bottom
        }
    }
    
    private func parseButtonIcon(_ icon: String) -> ChannelButtonIcon {
        switch icon.lowercased() {
        case "channel": return .channel
        case "chatbubblefilled": return .chatBubbleFilled
        case "chatprogressfilled": return .chatProgressFilled
        case "chatquestionfilled": return .chatQuestionFilled
        case "chatlightningfilled": return .chatLightningFilled
        case "chatbubblealtfilled": return .chatBubbleAltFilled
        case "smsfilled": return .smsFilled
        case "commentfilled": return .commentFilled
        case "sendforwardfilled": return .sendForwardFilled
        case "helpfilled": return .helpFilled
        case "chatprogress": return .chatProgress
        case "chatquestion": return .chatQuestion
        case "chatbubblealt": return .chatBubbleAlt
        case "sms": return .sms
        case "comment": return .comment
        case "sendforward": return .sendForward
        case "communication": return .communication
        case "headset": return .headset
        default: return .channel
        }
    }
    
    private func hexStringToData(_ hexString: String) -> Data? {
        let cleanHex = hexString.replacingOccurrences(of: " ", with: "")
        var data = Data()
        var temp = ""
        
        for char in cleanHex {
            temp += String(char)
            if temp.count == 2 {
                if let byte = UInt8(temp, radix: 16) {
                    data.append(byte)
                }
                temp = ""
            }
        }
        
        return data.isEmpty ? nil : data
    }
}

extension ExpoChannelIoModule: ChannelPluginDelegate {
    
    public func onBadgeChanged(unread: Int, alert: Int) {
        sendEvent("onBadgeChanged", [
            "unread": unread,
            "alert": alert
        ])
    }
    
    public func onChatCreated(_ chatId: String) {
        sendEvent("onChatCreated", [
            "chatId": chatId
        ])
    }
    
    public func onFollowUpChanged(_ profile: Profile) {
        sendEvent("onFollowUpChanged", [:])
    }
    
    public func onUrlClicked(_ url: URL) -> Bool {
        sendEvent("onUrlClicked", [
            "url": url.absoluteString
        ])
        return false // 기본 동작 허용
    }
    
    public func onPopupDataReceived(_ popupData: PopupData) {
        sendEvent("onPopupDataReceived", [:])
    }
    
    public func willShowMessenger() {
        sendEvent("onShowMessenger", [:])
    }
    
    public func willHideMessenger() {
        sendEvent("onHideMessenger", [:])
    }
}