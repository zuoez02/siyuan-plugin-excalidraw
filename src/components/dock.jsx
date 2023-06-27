import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Dialog, showMessage, confirm } from "siyuan";
import { loadAllFiles } from "../services/data";

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

export const Dock = (props) => {
  const plugin = props.plugin;
  const [files, setFiles] = useState(props.files);

  const copyDraw = (filename) => {
    const pluginName = "siyuan-plugin-excalidraw";
    const tabType = "excalidraw";
    const link = `siyuan://plugins/${pluginName}${tabType}?icon=iconExcalidraw&title=${filename}&data=${JSON.stringify(
      { name: filename }
    )}`;
    navigator.clipboard.writeText(`[${filename}](${encodeURI(link)})`);
  };

  const renameDraw = (fileName) => {
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
      const name = ele.querySelector("#draw-name").value;
      const result = name.trim();
      if (!result || InvalidPathChar.some((v) => result.indexOf(v) !== -1)) {
        showMessage(`Excalidraw: 名称 ${name} 不合法`);
        return;
      }
      plugin.renameDraw(fileName, name);
      d.destroy();
      files.splice(
        files.findIndex((i) => i === fileName),
        1,
        name
      );
      setFiles([...files]);
    };
    ele.querySelector("#draw-name").addEventListener("keyup", (e) => {
      if (e.key === "Enter") {
        rename();
      }
    });
    ele.querySelector("#renameDraw").addEventListener("click", () => {
      rename();
    });
  };

  const handleOpen = (file) => {
    plugin.open(file, { load: true });
  };

  const handleCopy = (file, event) => {
    event.stopPropagation();
    copyDraw(file);
  };

  const handleDelete = (file, event) => {
    event.stopPropagation();
    confirm("⚠警告: Excalidraw", `确认删除${file}吗?`, () => {
      plugin.deleteDraw(file);
      files.splice(
        files.findIndex((i) => i === file),
        1
      );
      setFiles([...files]);
    });
  };

  const handleEdit = (file, event) => {
    event.stopPropagation();
    renameDraw(file);
  };

  const handleRefresh = async () => {
    const files = await loadAllFiles();
    setFiles(files);
  };

  return (
    <div className="fn__flex-1 fn__flex-column">
      <div className="block__icons">
        <div className="block__logo">
          <svg>
            <use xlinkHref="#iconExcalidraw"></use>
          </svg>
          Excalidraw
        </div>
        <span className="fn__flex-1 fn__space"></span>
        <span
          data-type="min"
          className="block__icon b3-tooltips b3-tooltips__sw"
          aria-label="最小化"
        >
          <svg>
            <use xlinkHref="#iconMin"></use>
          </svg>
        </span>
        <span
          id="add-draw"
          className="block__icon b3-tooltips b3-tooltips__sw"
          aria-label="新建"
          onClick={() => addDraw()}
        >
          <svg>
            <use xlinkHref="#iconAdd"></use>
          </svg>
        </span>
        <span
          id="refresh"
          className="block__icon b3-tooltips b3-tooltips__sw"
          aria-label="刷新"
          onClick={() => handleRefresh()}
        >
          <svg>
            <use xlinkHref="#iconRefresh"></use>
          </svg>
        </span>
      </div>
      <div className="fn__flex-1 plugin-excalidraw-dock">
        {files?.map((file) => {
          return (
            <div key={file} className="excalidraw-draw" data-name={file}>
              <span onClick={() => handleOpen(file)}>{file}</span>
              <span
                className="fileicon editfile b3-tooltips b3-tooltips__s"
                aria-label="修改"
                data-name={file}
                onClick={(e) => handleEdit(file, e)}
              >
                <svg>
                  <use xlinkHref="#iconEdit"></use>
                </svg>
              </span>
              <span
                className="fileicon copyfile b3-tooltips b3-tooltips__s"
                aria-label="复制链接"
                data-name={file}
                onClick={(e) => handleCopy(file, e)}
              >
                <svg>
                  <use xlinkHref="#iconCopy"></use>
                </svg>
              </span>
              <span
                className="fileicon deletefile b3-tooltips b3-tooltips__s"
                aria-label="删除"
                data-name={file}
                onClick={(e) => handleDelete(file, e)}
              >
                <svg>
                  <use xlinkHref="#iconTrashcan"></use>
                </svg>
              </span>
            </div>
          );
        }) || <div style={{ margin: "0 12px" }}>无数据</div>}
      </div>
      ;
    </div>
  );
};

Dock.propTypes = {
  plugin: PropTypes.object.isRequired,
};
