export function InitExcalidrawTab(name, plugin, el) {
  const saveData = (name, json) => {
    const formData = new FormData();
    const pathString = `/data/storage/petal/siyuan-plugin-excalidraw/${name}.excalidraw`;
    let file;
    if (typeof json === "object") {
      file = new File(
        [
          new Blob([JSON.stringify(json)], {
            type: "application/json",
          }),
        ],
        pathString.split("/").pop()
      );
    } else {
      file = new File([new Blob([json])], pathString.split("/").pop());
    }
    formData.append("path", pathString);
    formData.append("file", file);
    formData.append("isDir", "false");
    fetch("/api/file/putFile", {
      method: "POST",
      body: formData,
    });
  };
  const loadData = (name) => {
    return plugin.loadData(`${name}.excalidraw`);
  };
  let initData;

  const App = () => {
    const [isFullScreen, setIsFullScreen] = React.useState(false);
    const excalidrawRef = React.useRef(null);

    function toggleFullscreen() {
      const el = document.querySelector(".excalidraw-wrapper");
      if (!el) {
        return;
      }
      if (!isFullScreen) {
        el.requestFullscreen && el.requestFullscreen();
      } else {
        document.exitFullscreen && document.exitFullscreen();
      }

      setIsFullScreen(!isFullScreen);
    }

    let timer;

    function debounce(fn, timeout) {
      if (timer) {
        clearTimeout(timer);
      }
      timer = setTimeout(() => fn(), timeout);
    }

    function saveNow() {
      const json = ExcalidrawLib.serializeAsJSON(
        excalidrawRef.current.getSceneElements(),
        excalidrawRef.current.getAppState(),
        excalidrawRef.current.getFiles(),
        "local"
      );
      saveData(name, json);
    }

    function save() {
      debounce(() => {
        saveNow();
      }, 500);
    }

    const props = {
      key: "excalidraw",
      ref: excalidrawRef,
      onChange: () => {
        save();
      },
      langCode: "zh-CN",
      initialData: initData,
      onLinkOpen: (element, event) => {
        const link = element.link;
        const { nativeEvent } = event.detail;
        const isNewTab = nativeEvent.ctrlKey || nativeEvent.metaKey;
        const isNewWindow = nativeEvent.shiftKey;
        const isInternalLink =
          link.startsWith("siyuan:") || link.includes(window.location.origin);
        if (isInternalLink && !isNewTab && !isNewWindow) {
          window.open(link);
        } else {
          window.open(link, "_blank");
        }
        event.preventDefault();
      },
      UIOptions: {
        canvasActions: {
          loadScene: true,
          theme: true,
        },
      },
    };
    return React.createElement(
      React.Fragment,
      null,
      React.createElement(
        "div",
        {
          className: "excalidraw-component",
        },
        React.createElement(ExcalidrawLib.Excalidraw, props, [
          React.createElement(
            ExcalidrawLib.MainMenu,
            {
              key: "mainmenu",
            },
            [
              React.createElement(
                ExcalidrawLib.MainMenu.DefaultItems.ToggleTheme,
                {
                  key: "ToggleTheme",
                }
              ),
              React.createElement(
                ExcalidrawLib.MainMenu.DefaultItems.ClearCanvas,
                {
                  key: "ClearCanvas",
                }
              ),
              React.createElement(ExcalidrawLib.MainMenu.DefaultItems.Help, {
                key: "help",
              }),
              React.createElement(
                ExcalidrawLib.MainMenu.Item,
                {
                  key: "refresh",
                  icon: React.createElement(
                    "svg",
                    null,
                    React.createElement("use", {
                      xlinkHref: "#iconHelp",
                    })
                  ),
                  onSelect: () => window.location.reload(true),
                },
                "刷新"
              ),
              React.createElement(
                ExcalidrawLib.MainMenu.Item,
                {
                  key: "fullscreen",
                  icon: React.createElement(
                    "svg",
                    null,
                    React.createElement("use", {
                      xlinkHref: "#iconHelp",
                    })
                  ),
                  onSelect: () => toggleFullscreen(),
                },
                "全屏"
              ),

              React.createElement(
                ExcalidrawLib.MainMenu.DefaultItems.ChangeCanvasBackground,
                {
                  key: "ChangeCanvasBackground",
                }
              ),
            ]
          ),
        ])
      )
    );
  };


  let root;

  async function init() {
    initData = await loadData(name);
    // const excalidrawWrapper = document.querySelector(".excalidraw-wrapper");
    const excalidrawWrapper = el;
    root = ReactDOM.createRoot(excalidrawWrapper);
    root.render(React.createElement(App));
  }

  init();

  return () => {
    root && root.unmount();
  }
}
