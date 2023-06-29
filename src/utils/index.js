import React from "react";
import ReactDOM from "react-dom/client";
import { loadData, loadAllFiles } from "../services/data";
import { Dock } from "../components/dock";
import { Tab } from "../components/tab";

export function registerIcon(name, size, svg) {
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

export function initExcalidrawTab(plugin) {
  return plugin.addTab({
    type: `excalidraw`,
    async init() {
      this.element.innerHTML =
        '<div class="fn__flex fn__flex-1 fn__flex-column"><div style="border: none" class="excalidraw excalidraw-wrapper fn__flex fn__flex-1"></div></div>';
      const initData = await loadData(this.data.name);
      const root = ReactDOM.createRoot(
        this.element.querySelector(".excalidraw-wrapper")
      );
      root.render(React.createElement(Tab, { initData, name: this.data.name, el: this.element }));
      this.data.destroy = () => {
        root && root.unmount();
      };
    },
    beforeDestroy() {
      this.data.destroy && this.data.destroy();
    },
  });
}

export async function initExcalidrawDock(plugin) {
  const props = {
    files: [],
    plugin,
  };
  const data = await loadAllFiles();
  if (data) {
    props.files = data;
  }
  let root;
  plugin.addDock({
    config: {
      position: "LeftBottom",
      size: { width: 200, height: 0 },
      icon: "iconExcalidraw",
      title: "Excalidraw",
    },
    data: {
      files: props.files,
    },
    type: "ExcalidrawDock",
    init() {
      root = ReactDOM.createRoot(this.element);
      root.render(React.createElement(Dock, props));
    },
  });
}
