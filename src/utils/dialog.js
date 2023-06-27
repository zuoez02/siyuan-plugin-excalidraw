import { Dialog } from 'siyuan';
import { DialogContent } from '../components/dialog-content';

export const addDraw = (callback) => {
  const d = new Dialog({
    title: "Create Excalidraw",
    content: `<div class="b3-dialog__content"><div id="create-excalidraw"></div></div>`,
    width: "520px",
  });
  let root;
  const props = {
    type: 'create',
    oldName: '',
    onSave: (name) => {
        root.unmount();
        d.destroy();
        callback(name);
    }
  }
  root = ReactDOM.createRoot(
    document.querySelector("#create-excalidraw")
  );
  root.render(React.createElement(DialogContent, props));
};

export const editDraw = (name, callback) => {
    const d = new Dialog({
      title: "Rename Excalidraw",
      content: `<div class="b3-dialog__content"><div id="rename-excalidraw"></div></div>`,
      width: "520px",
    });
    let root;
    const props = {
      type: 'rename',
      oldName: name,
      onSave: (newName) => {
          root.unmount();
          d.destroy();
          callback(newName);
      }
    }
    root = ReactDOM.createRoot(
      document.querySelector("#rename-excalidraw")
    );
    root.render(React.createElement(DialogContent, props));
  };