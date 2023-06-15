const { Plugin, openTab, Dialog, showMessage } = require('siyuan');

const icon = '<image href="data:image/png;base64,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"/>';

function registerIcon(name, size, svg) {
    document.body.insertAdjacentHTML('beforeend', `
            <svg style="position: absolute; width: 0; height: 0; overflow: hidden;" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <symbol id="${name}" viewBox="0 0 ${size} ${size}">
                        ${svg}
                    </symbol>
                </defs>
            </svg>`);
}

module.exports = class OpenMd extends Plugin {
    constructor(options) {
        super(options);
        this.dock = new Dock(this);
        this.tabs = [];
        this.eventListener = null;
        this.windows = {};
    }

    onload() {
        registerIcon('iconExcalidraw', '1024', icon);
        this.files = [];
        this.dock.createDock();
    }

    onLayoutReady() {
        this.loadData('files.json').then((data) => {
            if (data) {
                data.forEach(d => this.files.push(d));
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
        this.saveData('files.json', JSON.stringify(this.files, null, 2));
    }

    getDraw(name) {
        return this.loadData(`${name}.excalidraw`)
    }

    async addDraw(name, options) {
        this.files.push(name);
        this.updateFiles();
        await this.saveData(`${name}.excalidraw`, '');
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
        const i = this.files.findIndex((v) => v === name);
        if (i >= 0) {
            this.files.splice(i, 1);
            this.updateFiles();
        }
        this.removeData(`${name}.excalidraw`);
        this.closeTab(name);
        this.dock.refresh();
    }

    initDependency() {
        let scriptId
        scriptId = 'react';
        if (!document.getElementById(scriptId)) {
            const s = document.createElement('script');
            s.id = scriptId;
            s.async = false;
            s.src = '/plugins/siyuan-plugin-excalidraw/react.development.js';
            document.body.appendChild(s);
        }
        scriptId = 'react-dom';
        if (!document.getElementById(scriptId)) {
            const s = document.createElement('script');
            s.id = scriptId;
            s.async = false;
            s.src = '/plugins/siyuan-plugin-excalidraw/react-dom.development.js';
            document.body.appendChild(s);
        }

        scriptId = 'excalidraw';
        if (!document.getElementById(scriptId)) {
            window.EXCALIDRAW_ASSET_PATH = "/plugins/siyuan-plugin-excalidraw/excalidraw/";
            const s = document.createElement('script');
            s.id = scriptId;
            s.async = false;
            s.src = '/plugins/siyuan-plugin-excalidraw/excalidraw/excalidraw.development.js';
            document.body.appendChild(s);
        }
        const styleId = 'excalidraw-style';
        if (!document.getElementById(styleId)) {
            const s = document.createElement('link');
            s.id = styleId;
            s.href = '/plugins/siyuan-plugin-excalidraw/style.css';
            s.rel = 'stylesheet';
            document.head.appendChild(s);
        }
    }

    async open(name) {
        const plugin = this;
        const tab = this.addTab({
            type: `excalidraw-${name}`,
            init() {
                const id = (Math.random() * 1000).toFixed(0);
                this.element.innerHTML = `<div class="fn__flex fn__flex-1 fn__flex-column"><iframe src="/plugins/siyuan-plugin-excalidraw/index.html" style="border: none" class="excalidraw excalidraw-wrapper fn__flex fn__flex-1" data-name="${name}" data-id="${id}"></iframe></div>`;
                const contentWindow = this.element.querySelector('.excalidraw').contentWindow;
                plugin.windows[id] = contentWindow;
            },
            destroy: () => {
                this.tabs.splice(this.tabs.findIndex((v) => v.name === name), 1);
            }
        });
        const t = openTab({
            custom: {
                icon: 'iconExcalidraw',
                title: name,
                data: {
                    name,
                },
                fn: tab,
            },
        });
        this.tabs.push({ name, tab: t })
    }

    closeTab(name) {
        const t = this.tabs.find((v) => v.name === name);
        if (t) {
            t.tab.close();
        }
    }
}

const InvalidPathChar = ['\\', '/', ':', '*', '?', '"', '<', '>', '|', '$', '&', '^', '.'];

class Dock {
    constructor(plugin) {
        this.plugin = plugin;
    }

    createDock() {
            const dock = this;
            const plugin = this.plugin;
            const renameDraw = (name) => this.renameDraw(name);
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
                        type: 'ExcalidrawDock',
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
        ${this.data.files?.map((file) => {
                        return `<div class="excalidraw-draw" data-name="${file}">
                <span>${file}</span>
                <span class="deletefile b3-tooltips b3-tooltips__w" aria-label="删除" data-name="${file}"><svg><use xlink:href="#iconTrashcan"></use></svg></span>
            </div>`
                    }).join('') || '<div style="margin: 0 12px">无数据</div>'}
    </div>
</div>`;
                    const files = this.element.querySelectorAll('.excalidraw-draw');
                    if (!files) {
                        return;
                    }
                    for (const fileEl of files) {
                        fileEl.addEventListener('click', () => {
                            const file = this.data.files.find((v) => v === fileEl.getAttribute('data-name'));
                            if (file) {
                                plugin.open(file, { load: true });
                            }
                        });
                        fileEl.addEventListener('contextmenu', () => {
                            renameDraw(fileEl.getAttribute('data-name'));
                        });

                    }
                    const deletefiles = this.element.querySelectorAll('.deletefile');
                    for (const del of deletefiles) {
                        const name = del.getAttribute('data-name');
                        del.addEventListener('click', (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            plugin.deleteDraw(name);
                        });
                    }
                    const add = this.element.querySelector('#add-draw');
                    add.addEventListener('click', () => dock.addDraw());
                    const refresh = this.element.querySelector('#refresh');
                    refresh.addEventListener('click', () => {
                        fetch('/api/file/readDir', { method: 'POST', body: JSON.stringify({
                            path: '/data/storage/petal/siyuan-plugin-excalidraw'
                        })}).then((res) => res.json()).then((data) => {
                            const files = data.data;
                            this.data.files.splice(0, this.data.files.length);
                            const excalidrawFiles = files.filter(v => v.name.endsWith('.excalidraw')).map(v => v.name.split('.')[0]);
                            excalidrawFiles.forEach(f => this.data.files.push(f));
                            plugin.updateFiles(excalidrawFiles);
                            dock.refresh();
                        })
                    });
                }

                dock.el = this.element;
                dock.render = render;

                render();
            },
        });
    }

    addDraw() {
        const d = new Dialog({
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
            const name = document.getElementById('draw-name').value;
            const result = name.trim();
            if (!result || InvalidPathChar.some(v => result.indexOf(v) !== -1)) {
                showMessage(`Excalidraw: 名称 ${name} 不合法`);
                return;
            }
            this.plugin.addDraw(name, { open: true });
            d.destroy();
        }
        document.getElementById('draw-name').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                save();
            }
        })
        document.getElementById('saveDraw').addEventListener('click', () => {
            save();
        });
    }

    renameDraw(fileName) {
        const d = new Dialog({
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
            const name = ele.querySelector('#draw-name').value;
            const result = name.trim();
            if (!result || InvalidPathChar.some(v => result.indexOf(v) !== -1)) {
                showMessage(`Excalidraw: 名称 ${name} 不合法`);
                return;
            }
            this.plugin.renameDraw(fileName, name);
            d.destroy();
        }
        ele.querySelector('#draw-name').addEventListener('keyup', (e) => {
            if (e.key === 'Enter') {
                rename();
            }
        })
        ele.querySelector('#renameDraw').addEventListener('click', () => {
            rename();
        });
    }

    refresh() {
        this.render && this.render();
    }
}
