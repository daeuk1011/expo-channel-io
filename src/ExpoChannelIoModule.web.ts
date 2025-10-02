import { NativeModule, registerWebModule } from "expo";
import {
  Appearance,
  BootConfig,
  BootResult,
  EventProperty,
  Profile,
  User,
  TagOperationResult,
} from "./ExpoChannelIo.types";

declare global {
  interface Window {
    ChannelIO?: IChannelIO;
    ChannelIOInitialized?: boolean;
  }
}

interface IChannelIO {
  c?: (...args: any) => void;
  q?: [methodName: string, ...args: any[]][];
  (...args: any): void;
}

interface WebBootOption {
  appearance?: string;
  customLauncherSelector?: string;
  hideChannelButtonOnBoot?: boolean;
  hidePopup?: boolean;
  language?: string;
  memberHash?: string;
  memberId?: string;
  pluginKey: string;
  profile?: Profile;
  trackDefaultEvent?: boolean;
  trackUtmSource?: boolean;
  unsubscribe?: boolean;
  unsubscribeEmail?: boolean;
  unsubscribeTexting?: boolean;
  zIndex?: number;
}

interface WebCallbackUser {
  alert: number;
  avatarUrl: string;
  id: string;
  language: string;
  memberId: string;
  name?: string;
  profile?: Profile | null;
  tags?: string[] | null;
  unsubscribeEmail: boolean;
  unsubscribeTexting: boolean;
}

interface WebUpdateUserInfo {
  language?: string;
  profile?: Profile | null;
  profileOnce?: Profile;
  tags?: string[] | null;
  unsubscribeEmail?: boolean;
  unsubscribeTexting?: boolean;
}

class ExpoChannelIoModule extends NativeModule {
  private scriptLoaded = false;

  private ensureScriptLoaded() {
    if (this.scriptLoaded) return;

    this.scriptLoaded = true;
    (function () {
      var w = window;
      if (w.ChannelIO) {
        return w.console.error("ChannelIO script included twice.");
      }
      var ch: IChannelIO = function () {
        ch.c?.(arguments);
      };
      ch.q = [];
      ch.c = function (args) {
        ch.q?.push(args);
      };
      w.ChannelIO = ch;
      function l() {
        if (w.ChannelIOInitialized) {
          return;
        }
        w.ChannelIOInitialized = true;
        var s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
        var x = document.getElementsByTagName("script")[0];
        if (x.parentNode) {
          x.parentNode.insertBefore(s, x);
        }
      }
      if (document.readyState === "complete") {
        l();
      } else {
        w.addEventListener("DOMContentLoaded", l);
        w.addEventListener("load", l);
      }
    })();
  }

  private convertToWebBootOption(config: BootConfig): WebBootOption {
    const webOption: WebBootOption = {
      pluginKey: config.pluginKey,
    };

    if (config.memberId) webOption.memberId = config.memberId;
    if (config.memberHash) webOption.memberHash = config.memberHash;
    if (config.profile) webOption.profile = config.profile;
    if (config.language) webOption.language = config.language;
    if (config.appearance) webOption.appearance = config.appearance;
    if (config.hideChannelButtonOnBoot !== undefined) {
      webOption.hideChannelButtonOnBoot = config.hideChannelButtonOnBoot;
    }

    return webOption;
  }

  private convertWebUserToUser(webUser: WebCallbackUser | null): User | null {
    if (!webUser) return null;

    return {
      memberId: webUser.memberId,
      name: webUser.name,
      avatarUrl: webUser.avatarUrl,
      unread: webUser.alert,
    };
  }

  // 비동기 메서드들 (Promise 반환)
  boot(config: BootConfig): Promise<BootResult> {
    this.ensureScriptLoaded();

    return new Promise((resolve, reject) => {
      try {
        const webOption = this.convertToWebBootOption(config);

        window.ChannelIO?.("boot", webOption, (error: Error | null, user: WebCallbackUser | null) => {
          if (error) {
            resolve({
              status: "unknown",
              user: null,
            });
          } else {
            resolve({
              status: "success",
              user: this.convertWebUserToUser(user),
            });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  updateUser(profile: Profile): Promise<User> {
    return new Promise((resolve, reject) => {
      try {
        const userInfo: WebUpdateUserInfo = {
          profile,
        };

        window.ChannelIO?.("updateUser", userInfo, (error: Error | null, user: WebCallbackUser | null) => {
          if (error) {
            reject(error);
          } else {
            const convertedUser = this.convertWebUserToUser(user);
            if (convertedUser) {
              resolve(convertedUser);
            } else {
              reject(new Error("User update failed"));
            }
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  addTags(tags: string[]): Promise<TagOperationResult> {
    return new Promise((resolve, reject) => {
      try {
        window.ChannelIO?.("addTags", tags, (error: Error | null, user: WebCallbackUser | null) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              user: this.convertWebUserToUser(user),
            });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  removeTags(tags: string[]): Promise<TagOperationResult> {
    return new Promise((resolve, reject) => {
      try {
        window.ChannelIO?.("removeTags", tags, (error: Error | null, user: WebCallbackUser | null) => {
          if (error) {
            reject(error);
          } else {
            resolve({
              user: this.convertWebUserToUser(user),
            });
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  // 동기 메서드들
  sleep(): void {
    // Web에서는 shutdown과 동일하게 처리
    this.shutdown();
  }

  shutdown(): void {
    window.ChannelIO?.("shutdown");
  }

  showChannelButton(): void {
    window.ChannelIO?.("showChannelButton");
  }

  hideChannelButton(): void {
    window.ChannelIO?.("hideChannelButton");
  }

  showMessenger(): void {
    window.ChannelIO?.("showMessenger");
  }

  hideMessenger(): void {
    window.ChannelIO?.("hideMessenger");
  }

  hidePopup(): void {
    // Web에서는 hideMessenger로 처리
    this.hideMessenger();
  }

  openChat(chatId?: string | null, message?: string | null): void {
    window.ChannelIO?.("openChat", chatId, message);
  }

  openWorkflow(workflowId?: string | null): void {
    // Web SDK에는 openWorkflow가 없으므로 openChat으로 대체
    if (workflowId) {
      window.ChannelIO?.("openChat", workflowId);
    } else {
      window.ChannelIO?.("showMessenger");
    }
  }

  track(eventName: string, eventProperties?: EventProperty | null): void {
    window.ChannelIO?.("track", eventName, eventProperties || undefined);
  }

  setPage(page: string, profile: Profile): void {
    window.ChannelIO?.("setPage", page);
    // Web SDK의 setPage는 profile을 받지 않으므로 updateUser로 처리
    if (profile && Object.keys(profile).length > 0) {
      this.updateUser(profile).catch(() => {
        // Silent fail for setPage profile update
      });
    }
  }

  resetPage(): void {
    window.ChannelIO?.("resetPage");
  }

  // 상태 조회
  isBooted(): boolean {
    // Web SDK는 isBooted를 직접 제공하지 않으므로 ChannelIO 존재 여부로 판단
    return !!window.ChannelIO && !!window.ChannelIOInitialized;
  }

  // 설정
  setDebugMode(enabled: boolean): void {
    // Web SDK는 debug mode를 지원하지 않으므로 console로 로깅
    if (enabled) {
      console.log("[ExpoChannelIo] Debug mode enabled (Web)");
    }
  }

  setAppearance(appearance: Appearance): void {
    window.ChannelIO?.("setAppearance", appearance);
  }

  // Web 전용 이벤트 리스너 메서드들 (호환성 유지)
  onShowMessenger(callback: () => void): void {
    window.ChannelIO?.("onShowMessenger", callback);
  }

  onHideMessenger(callback: () => void): void {
    window.ChannelIO?.("onHideMessenger", callback);
  }

  onBadgeChanged(callback: (unread: number, alert: number) => void): void {
    window.ChannelIO?.("onBadgeChanged", callback);
  }

  onChatCreated(callback: () => void): void {
    window.ChannelIO?.("onChatCreated", callback);
  }

  onFollowUpChanged(callback: (profile: any) => void): void {
    window.ChannelIO?.("onFollowUpChanged", callback);
  }

  onUrlClicked(callback: (url: string) => void): void {
    window.ChannelIO?.("onUrlClicked", callback);
  }

  clearCallbacks(): void {
    window.ChannelIO?.("clearCallbacks");
  }
}

export default registerWebModule(ExpoChannelIoModule, "ExpoChannelIoModule");
