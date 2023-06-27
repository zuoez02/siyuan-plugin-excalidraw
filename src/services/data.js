export const saveData = (name, json) => {
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
export const loadData = (plugin, name) => {
  return plugin.loadData(`${name}.excalidraw`);
};

export const loadAllFiles = () => {
  return fetch("/api/file/readDir", {
    method: "POST",
    body: JSON.stringify({
      path: "/data/storage/petal/siyuan-plugin-excalidraw",
    }),
  })
    .then((res) => res.json())
    .then((data) => {
      return data.data
        .filter((v) => v.name.endsWith(".excalidraw"))
        .map((v) => v.name.split(".")[0]);
    });
};

export function addDraw(name) {
  saveData(name, {});
}

export function editDraw(name, newVal) {
    
}

export function deleteDraw(plugin, name) {
  plugin.removeData(`${name}.excalidraw`);
}
