import ExpoModulesCore
import ChannelIOFront


public class ExpoChannelIoDelegate: ExpoAppDelegateSubscriber {
    public func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
    ChannelIO.initialize(application)
    return true
    }
}