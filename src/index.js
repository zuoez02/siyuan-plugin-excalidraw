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

  async onload() {
    registerIcon("iconExcalidraw", "1024", icon);
    initExcalidrawDock(this);
    this.tab = initExcalidrawTab(this);
  }

  getDraw(name) {
    return this.loadData(`${name}.excalidraw`);
  }

  async addDraw(name, options) {
    await this.saveData(`${name}.excalidraw`, "");
    if (options && options.open) {
      this.open(name);
    }
  }

  async renameDraw(oldName, newName) {
    if (oldName === newName) {
      return;
    }
    const content = await this.loadData(`${oldName}.excalidraw`);
    const i = this.files.findIndex((name) => oldName === name);
    if (i >= 0) {
      this.files.splice(i, 1);
      this.files.push(newName);
      this.saveData(`${newName}.excalidraw`, content);
      this.removeData(`${oldName}.excalidraw`);
    }
  }

  deleteDraw(name) {
    const i = this.files.findIndex((v) => v === name);
    if (i >= 0) {
      this.files.splice(i, 1);
    }
    this.removeData(`${name}.excalidraw`);
    this.closeTab(name);
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
