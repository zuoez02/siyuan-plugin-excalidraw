const siyuan = require("siyuan");
const { Plugin, openTab, confirm } = siyuan;

function registerIcon(name, size, svg) {
  document.body.insertAdjacentHTML(
    "beforeend",
    `<svg style="position: absolute; width: 0; height: 0; overflow: hidden;" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <symbol id="${name}" viewBox="0 0 ${size} ${size}">
            ${svg}
        </symbol>
    </defs>
</svg>`
  );
}

module.exports = class OpenMd extends Plugin {
  constructor(options) {
    super(options);
    this.tabs = [];
    this.eventListener = null;
    this.windows = {};
    this.initDependency();
  }

  async onload() {
    import("/plugins/siyuan-plugin-excalidraw/icon.js")
      .then((m) => m.icon)
      .then((icon) => {
        registerIcon("iconExcalidraw", "1024", icon);
      });
    import("/plugins/siyuan-plugin-excalidraw/dock.js")
      .then((m) => m.default)
      .then((Dock) => {
        this.dock = new Dock(this, siyuan);
        this.files = [];
        this.dock.createDock();
        const plugin = this;
        this.tab = this.addTab({
          type: `excalidraw`,
          init() {
            this.element.innerHTML = `<div class="fn__flex fn__flex-1 fn__flex-column"><div style="border: none" class="excalidraw excalidraw-wrapper fn__flex fn__flex-1"></div></div>`;
            import("/plugins/siyuan-plugin-excalidraw/tab.js")
              .then((m) => m.InitExcalidrawTab)
              .then((InitExcalidrawTab) => {
                this.data.destroy = InitExcalidrawTab(
                  this.data.name,
                  plugin,
                  this.element.querySelector(".excalidraw-wrapper")
                );
              });
          },
          beforeDestroy() {
            this.data.destroy && this.data.destroy();
          },
        });
      });
  }

  onLayoutReady() {
    this.loadData("files.json").then((data) => {
      if (data) {
        data.forEach((d) => this.files.push(d));
        this.dock.refresh();
      } else {
        this.updateFiles();
      }
    });
  }

  updateFiles(files) {
    if (files) {
      this.files = files;
    }
    this.saveData("files.json", JSON.stringify(this.files, null, 2));
  }

  getDraw(name) {
    return this.loadData(`${name}.excalidraw`);
  }

  async addDraw(name, options) {
    this.files.push(name);
    this.updateFiles();
    await this.saveData(`${name}.excalidraw`, "");
    if (options && options.open) {
      this.open(name);
    }
    this.dock.refresh();
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
      this.dock.refresh();
    }
  }

  deleteDraw(name) {
    confirm("⚠警告: Excalidraw", `确认删除${name}吗?`, () => {
      const i = this.files.findIndex((v) => v === name);
      if (i >= 0) {
        this.files.splice(i, 1);
        this.updateFiles();
      }
      this.removeData(`${name}.excalidraw`);
      this.closeTab(name);
      this.dock.refresh();
    });
  }

  initDependency() {
    let scriptId;
    scriptId = "react";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.async = false;
      s.src = "/plugins/siyuan-plugin-excalidraw/react.development.js";
      document.body.appendChild(s);
    }
    scriptId = "react-dom";
    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.async = false;
      s.src = "/plugins/siyuan-plugin-excalidraw/react-dom.development.js";
      document.body.appendChild(s);
    }

    scriptId = "excalidraw";
    if (!document.getElementById(scriptId)) {
      window.EXCALIDRAW_ASSET_PATH =
        "/plugins/siyuan-plugin-excalidraw/excalidraw/";
      const s = document.createElement("script");
      s.id = scriptId;
      s.async = false;
      s.src =
        "/plugins/siyuan-plugin-excalidraw/excalidraw/excalidraw.development.js";
      document.body.appendChild(s);
    }
    const styleId = "excalidraw-style";
    if (!document.getElementById(styleId)) {
      const s = document.createElement("link");
      s.id = styleId;
      s.href = "/plugins/siyuan-plugin-excalidraw/style.css";
      s.rel = "stylesheet";
      document.head.appendChild(s);
    }
  }

  async open(name) {
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
};
