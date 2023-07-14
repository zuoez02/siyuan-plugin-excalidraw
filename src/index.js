import "./utils/env";
import { Plugin, openTab } from "siyuan";
import { icon } from "./assets/icon";
import { registerIcon, initExcalidrawTab, initExcalidrawDock } from "./utils";


export default class ExcalidrawPlugin extends Plugin {
  onload() {
    this.tab = null;
    this.tabs = [];

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
