const InvalidPathChar = [
  "\\",
  "/",
  ":",
  "*",
  "?",
  '"',
  "<",
  ">",
  "|",
  "$",
  "&",
  "^",
  ".",
];

export default class Dock {
  constructor(plugin, siyuan) {
    this.siyuan = siyuan;
    this.plugin = plugin;
  }

  createDock() {
    const dock = this;
    const plugin = this.plugin;
    const renameDraw = (name) => this.renameDraw(name);
    const copyDraw = (name) => this.copyDraw(name);
    this.plugin.addDock({
      config: {
        position: "LeftBottom",
        size: { width: 200, height: 0 },
        icon: "iconExcalidraw",
        title: "Excalidraw",
      },
      data: {
        files: this.plugin.files || [],
      },
      type: "ExcalidrawDock",
      init() {
        const render = () => {
          this.element.innerHTML = `
<div class="fn__flex-1 fn__flex-column">
    <style>
        .plugin-excalidraw-dock {
            padding: 0px;
        }
        .plugin-excalidraw-dock .excalidraw-draw {
            padding: 4px;
            margin: 2px 6px;
            font-size: 16px;
        }
        .plugin-excalidraw-dock .excalidraw-draw .fileicon {
            display: none;
            margin-left: 4px;
        }
        .plugin-excalidraw-dock .excalidraw-draw:hover .fileicon {
            display: inline;
        }
        .plugin-excalidraw-dock .excalidraw-draw:hover {
            cursor: pointer;
            border-radius: 4px;
            background-color: var(--b3-list-background);
        }
        .plugin-excalidraw-dock .excalidraw-draw {

    }
    .plugin-excalidraw-dock .excalidraw-draw svg {
        width: 14px;
        height: 14px;
        margin-right: 6px;
    }
    </style>
    <div class="block__icons">
        <div class="block__logo">
            <svg><use xlink:href="#iconExcalidraw"></use></svg>
            Excalidraw
        </div>
        <span class="fn__flex-1 fn__space"></span>
        <span data-type="min" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="最小化"><svg><use xlink:href="#iconMin"></use></svg></span>
        <span id="add-draw" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="新建"><svg><use xlink:href="#iconAdd"></use></svg></span>
        <span id="refresh" class="block__icon b3-tooltips b3-tooltips__sw" aria-label="刷新"><svg><use xlink:href="#iconRefresh"></use></svg></span>
    </div>
    
    <div class="fn__flex-1 plugin-excalidraw-dock">
        ${
          this.data.files
            ?.map((file) => {
              return `<div class="excalidraw-draw" data-name="${file}">
                <span>${file}</span>
                <span class="fileicon editfile b3-tooltips b3-tooltips__s" aria-label="修改" data-name="${file}"><svg><use xlink:href="#iconEdit"></use></svg></span>
                <span class="fileicon copyfile b3-tooltips b3-tooltips__s" aria-label="复制链接" data-name="${file}"><svg><use xlink:href="#iconCopy"></use></svg></span>
                <span class="fileicon deletefile b3-tooltips b3-tooltips__s" aria-label="删除" data-name="${file}"><svg><use xlink:href="#iconTrashcan"></use></svg></span>
            </div>`;
            })
            .join("") || '<div style="margin: 0 12px">无数据</div>'
        }
    </div>
</div>`;
          const files = this.element.querySelectorAll(".excalidraw-draw");
          if (!files) {
            return;
          }
          for (const fileEl of files) {
            fileEl.addEventListener("click", () => {
              const file = this.data.files.find(
                (v) => v === fileEl.getAttribute("data-name")
              );
              if (file) {
                plugin.open(file, { load: true });
              }
            });
            fileEl
              .querySelector(".copyfile")
              .addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                copyDraw(fileEl.getAttribute("data-name"));
              });
            fileEl
              .querySelector(".editfile")
              .addEventListener("click", (event) => {
                event.preventDefault();
                event.stopPropagation();
                renameDraw(fileEl.getAttribute("data-name"));
              });
          }
          const deletefiles = this.element.querySelectorAll(".deletefile");
          for (const del of deletefiles) {
            const name = del.getAttribute("data-name");
            del.addEventListener("click", (e) => {
              e.preventDefault();
              e.stopPropagation();
              plugin.deleteDraw(name);
            });
          }
          const add = this.element.querySelector("#add-draw");
          add.addEventListener("click", () => dock.addDraw());
          const refresh = this.element.querySelector("#refresh");
          refresh.addEventListener("click", () => {
            fetch("/api/file/readDir", {
              method: "POST",
              body: JSON.stringify({
                path: "/data/storage/petal/siyuan-plugin-excalidraw",
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                const files = data.data;
                this.data.files.splice(0, this.data.files.length);
                const excalidrawFiles = files
                  .filter((v) => v.name.endsWith(".excalidraw"))
                  .map((v) => v.name.split(".")[0]);
                excalidrawFiles.forEach((f) => this.data.files.push(f));
                plugin.updateFiles(excalidrawFiles);
                dock.refresh();
              });
          });
        };

        dock.el = this.element;
        dock.render = render;

        render();
      },
    });
  }

  addDraw() {
    const d = new this.siyuan.Dialog({
      title: "Create Excalidraw",
      content: `<div class="b3-dialog__content">
            <div id="create-excalidraw">
            <label class="fn__flex b3-label config__item">
                <div class="fn__flex-1">名称
                <div class="b3-label__text">名称为文件名，不可包含/,*,$等特殊字符</div>
                </div>
                <span class="fn__space"></span>
                <input id="draw-name" class="b3-text-field fn__flex-center fn__size200">
            </label>
            <div class="button-group" style="float: right; margin: 20px 0 10px">
            <button id="saveDraw" class="b3-button">保存</button>
            </div>
            </div>
            </div>`,
      width: "920px",
    });
    const save = () => {
      const name = document.getElementById("draw-name").value;
      const result = name.trim();
      if (!result || InvalidPathChar.some((v) => result.indexOf(v) !== -1)) {
        this.siyuan.showMessage(`Excalidraw: 名称 ${name} 不合法`);
        return;
      }
      this.plugin.addDraw(name, { open: true });
      d.destroy();
    };
    document.getElementById("draw-name").addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        save();
      }
    });
    document.getElementById("saveDraw").addEventListener("click", () => {
      save();
    });
  }

  copyDraw(filename) {
    const pluginName = "siyuan-plugin-excalidraw";
    const tabType = "excalidraw";
    const link = `siyuan://plugins/${pluginName}${tabType}?icon=iconExcalidraw&title=${filename}&data=${JSON.stringify(
      { name: filename }
    )}`;
    navigator.clipboard.writeText(`[${filename}](${encodeURI(link)})`);
  }

  renameDraw(fileName) {
    const d = new this.siyuan.Dialog({
      title: "Rename Excalidraw",
      content: `<div class="b3-dialog__content">
            <div id="rename-excalidraw">
            <label class="fn__flex b3-label config__item">
                <div class="fn__flex-1">名称
                <div class="b3-label__text">名称为文件名，不可包含/,*,$等特殊字符</div>
                </div>
                <span class="fn__space"></span>
                <input id="draw-name" class="b3-text-field fn__flex-center fn__size200" placeholder="新文件名" value="${fileName}">
            </label>
            <div class="button-group" style="float: right; margin: 20px 0 10px">
            <button id="renameDraw" class="b3-button">更新</button>
            </div>
            </div>
            </div>`,
      width: "920px",
    });
    const ele = d.element;
    const rename = () => {
      const name = ele.querySelector("#draw-name").value;
      const result = name.trim();
      if (!result || InvalidPathChar.some((v) => result.indexOf(v) !== -1)) {
        this.siyuan.showMessage(`Excalidraw: 名称 ${name} 不合法`);
        return;
      }
      this.plugin.renameDraw(fileName, name);
      d.destroy();
    };
    ele.querySelector("#draw-name").addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        rename();
      }
    });
    ele.querySelector("#renameDraw").addEventListener("click", () => {
      rename();
    });
  }

  refresh() {
    this.render && this.render();
  }
}
