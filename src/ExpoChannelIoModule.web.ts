import { NativeModule, registerWebModule } from "expo";

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

interface BootOption {
  pluginKey: string;
  profile?: Profile;
  appearance?: string;
}

interface Profile {
  [key: string]: string | number | boolean | null | undefined;
}

class ExpoChannelIoModule extends NativeModule {
  loadScript() {
    (function () {
      const w = window;
      if (w.ChannelIO) {
        return w.console.error("ChannelIO script included twice.");
      }
      const ch = function () {
        ch.c(arguments);
      };
      ch.q = [];
      ch.c = function (args) {
        ch.q.push(args);
      };
      w.ChannelIO = ch;
      function l() {
        if (w.ChannelIOInitialized) {
          return;
        }
        w.ChannelIOInitialized = true;
        const s = document.createElement("script");
        s.type = "text/javascript";
        s.async = true;
        s.src = "https://cdn.channel.io/plugin/ch-plugin-web.js";
        const x = document.getElementsByTagName("script")[0];
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

  boot(option: BootOption) {
    window.ChannelIO?.("boot", option);
  }

  showChannelButton() {
    window.ChannelIO?.("showChannelButton");
  }

  hideChannelButton() {
    window.ChannelIO?.("hideChannelButton");
  }

  showMessenger() {
    window.ChannelIO?.("showMessenger");
  }

  hideMessenger() {
    window.ChannelIO?.("hideMessenger");
  }
}

export default registerWebModule(ExpoChannelIoModule);
