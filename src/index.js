import { Plugin, openTab } from "siyuan";
import { icon } from "./assets/icon";
import { registerIcon, initExcalidrawTab, initExcalidrawDock } from "./utils";

export default class OpenMd extends Plugin {
  constructor(options) {
    super(options);
    this.tab = null;
    this.tabs = [];
    window.EXCALIDRAW_ASSET_PATH =
      "/plugins/siyuan-plugin-excalidraw/excalidraw/";
  }

  onload() {
    registerIcon("iconExcalidraw", "1024", icon);
    initExcalidrawDock(this);
    this.tab = initExcalidrawTab(this);
  }

  open(name) {
    const tab = this.tab;
    const t = openTab({
      custom: {
        icon: "iconExcalidraw",
        title: name,
        data: {
          name,
        },
        fn: tab,
      },
    });
    this.tabs.push({ name, tab: t });
  }

  closeTab(name) {
    const t = this.tabs.find((v) => v.name === name);
    if (t) {
      t.tab.close();
    }
  }
}
