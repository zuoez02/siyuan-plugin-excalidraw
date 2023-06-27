import { useState } from "react";
import { editDraw } from "../services/data";

export const DialogContent = (props) => {
  const [name, setName] = useState(props.oldName);
  const save = (name) => {
    const result = name.trim();
    if (!result || InvalidPathChar.some((v) => result.indexOf(v) !== -1)) {
      this.siyuan.showMessage(`Excalidraw: 名称 ${name} 不合法`);
      return;
    }
    if (props.type === 'create') {
      addDraw(name);
    } else {
      editDraw(name);
    }
    props.onSave && props.onSave(name);
  };

  const handleKeyUp = (e) => {
    console.log(e);
    if (e.key === 'Enter') {
        save(e.target.value);
    }
  }

  return (
    <div id="create-excalidraw">
      <label class="fn__flex b3-label config__item">
        <div class="fn__flex-1">
          名称
          <div class="b3-label__text">
            名称为文件名，不可包含/,*,$等特殊字符
          </div>
        </div>
        <span class="fn__space"></span>
        <input
          id="draw-name"
          class="b3-text-field fn__flex-center fn__size200"
          value={name}
          onChange={(value) => setName(value)}
          onKeyUp={(e) => handleKeyUp(e)}
        />
      </label>
      <div class="button-group" style="float: right; margin: 20px 0 10px">
        <button id="saveDraw" class="b3-button" onClick={() => save(name)}>
          保存
        </button>
      </div>
    </div>
  );
};
