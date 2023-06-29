import { Fragment, useState, useRef } from "react";
import { Excalidraw, MainMenu, serializeAsJSON } from "@zuoez02/excalidraw";
import { saveData } from "../services/data";
import PropTypes from "prop-types";

export const Tab = (props) => {
  const initData = props.initData;
  const [realName, setRealName] = useState(props.name);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const excalidrawRef = useRef(null);

  function toggleFullscreen() {
    const el = props.el.querySelector(".excalidraw-wrapper");
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
    const json = serializeAsJSON(
      excalidrawRef.current.getSceneElements(),
      excalidrawRef.current.getAppState(),
      excalidrawRef.current.getFiles(),
      "local"
    );
    saveData(realName, json);
  }

  function save() {
    debounce(() => {
      saveNow();
    }, 500);
  }
  return (
    <Fragment>
      <div className="excalidraw-component">
        <Excalidraw
          ref={excalidrawRef}
          onChange={() => save()}
          langCode="zh-CN"
          initialData={initData}
          onLinkOpen={(element, event) => {
            const link = element.link;
            const { nativeEvent } = event.detail;
            const isNewTab = nativeEvent.ctrlKey || nativeEvent.metaKey;
            const isNewWindow = nativeEvent.shiftKey;
            const isInternalLink =
              link.startsWith("siyuan:") ||
              link.includes(window.location.origin);
            if (isInternalLink && !isNewTab && !isNewWindow) {
              window.open(link);
            } else {
              window.open(link, "_blank");
            }
            event.preventDefault();
          }}
          UIOptions={{
            canvasActions: {
              loadScene: true,
              theme: true,
            },
          }}
        >
          <MainMenu key="mainmenu">
            <MainMenu.DefaultItems.ToggleTheme />
            <MainMenu.DefaultItems.ClearCanvas />
            <MainMenu.DefaultItems.Help />
            <MainMenu.Item
              key="refresh"
              icon={
                <svg>
                  <use xlinkHref="#iconHelp"></use>
                </svg>
              }
              onSelect={() => window.location.reload(true)}
            >
              刷新
            </MainMenu.Item>
            <MainMenu.Item
              key="fullscreen"
              icon={
                <svg>
                  <use xlinkHref="#iconHelp"></use>
                </svg>
              }
              onSelect={() => toggleFullscreen()}
            >
              全屏
            </MainMenu.Item>
            <MainMenu.DefaultItems.ChangeCanvasBackground />
          </MainMenu>
        </Excalidraw>
      </div>
    </Fragment>
  );
};

Tab.propTypes = {
  el: PropTypes.object.isRequired,
};
