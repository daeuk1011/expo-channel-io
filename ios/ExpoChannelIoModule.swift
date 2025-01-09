import ExpoModulesCore
import ChannelIOFront

public struct BubbleOption {
    let position: String
    let yMargin: Int
}

public struct Appearance {
    let theme: String
}

public class ExpoChannelIoModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ExpoChannelIo")

    AsyncFunction("boot") { (settings: [String: Any]?) in
      do {
        guard let settings = settings else {
          throw NSError(domain: "BootConfigError", code: 0, userInfo: [NSLocalizedDescriptionKey: "Settings are required"])
        }

        let pluginKey = settings["pluginKey"] as? String ?? ""
        let memberId = settings["memberId"] as? String
        let memberHash = settings["memberHash"] as? String

        let profileData = settings["profile"] as? [String: Any]
        let profile = self.createUserProfile(from: profileData)

        let buttonOptionData = settings["channelButtonOption"] as? [String: Any]
        let buttonOption = self.toChannelButtonOption(from: buttonOptionData)

        let bootConfig = BootConfig(pluginKey: pluginKey)
          .set(memberId: memberId)
          .set(memberHash: memberHash)
          .set(profile: profile)
          .set(channelButtonOption: buttonOption)

        ChannelIO.boot(with: bootConfig) { status, _ in
          self.handleBootStatus(status)
        }
      } catch {
        print("Boot failed: \(error.localizedDescription)")
      }
    }

    Function("showChannelButton") {
      ChannelIO.showChannelButton()
      print("Channel button shown")
    }

    Function("hideChannelButton") {
      ChannelIO.hideChannelButton()
      print("Channel button hidden")
    }

    Function("showMessenger") {
      ChannelIO.showMessenger()
      print("Messenger shown")
    }

    Function("hideMessenger") {
      ChannelIO.hideMessenger()
      print("Messenger hidden")
    }
  }

  private func createUserProfile(from data: [String: Any]?) -> Profile? {
    guard let data = data else { return nil }
    let profile = Profile()
    data.forEach { key, value in
      switch key {
      case "name":
        profile.set(name: value as? String ?? "") // 안전한 캐스팅 및 기본값 처리
      case "email":
        profile.set(email: value as? String ?? "")
      case "mobileNumber":
        profile.set(mobileNumber: value as? String ?? "")
      case "avatarUrl":
        profile.set(avatarUrl: value as? String ?? "")
      default:
        profile.set(propertyKey: key, value: (value as? String ?? "") as NSString)
      }
    }
    return profile
  }

  private func toChannelButtonOption(from data: [String: Any]?) -> ChannelButtonOption? {
    guard let data = data else { return nil }
    let positionString = data["position"] as? String ?? "right"
    let position = self.mapPosition(from: positionString)
    let xMargin = data["xMargin"] as? Float ?? 0.0
    let yMargin = data["yMargin"] as? Float ?? 0.0

    return ChannelButtonOption(position: position, xMargin: xMargin, yMargin: yMargin)
  }


  private func mapPosition(from string: String) -> ChannelButtonPosition {
    switch string.lowercased() {
    case "left":
      return .left
    case "right":
      return .right
    default:
      return .right // 기본값
    }
  }

  private func handleBootStatus(_ status: BootStatus) {
    switch status {
    case .success:
      print("ChannelIO boot success")
    case .notInitialized:
      print("ChannelIO not initialized")
    case .networkTimeout:
      print("Network timeout during ChannelIO boot")
    case .notAvailableVersion:
      print("Unsupported SDK version")
    case .serviceUnderConstruction:
      print("Channel Talk server under maintenance")
    case .requirePayment:
      print("Channel requires payment")
    case .accessDenied:
      print("Access denied")
    case .unknown:
      print("Unknown error during ChannelIO boot")
    @unknown default:
      print("Unexpected error")
    }
  }
}
