import ExpoModulesCore
import ChannelIOFront

public class ExpoChannelIoDelegate: ExpoAppDelegateSubscriber {
    public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        do {
            try ChannelIO.initialize(application)
            print("ChannelIO initialized successfully")
            return true
        } catch {
            print("Failed to initialize ChannelIO: \(error.localizedDescription)")
            return false
        }
    }
}