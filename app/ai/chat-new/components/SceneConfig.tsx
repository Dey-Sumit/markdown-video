import ReactJson from "react-json-view";

interface SceneConfigProps {
  config: any;
}

export function SceneConfig({ config }: SceneConfigProps) {
  console.log("SceneConfig renders");

  return (
    <div className="mb-4 rounded-lg bg-gray-800 p-4">
      <h3 className="mb-2 text-lg font-semibold text-gray-200">
        Scene Configuration:
      </h3>
      <ReactJson
        src={config}
        theme="monokai"
        displayDataTypes={false}
        displayObjectSize={false}
        enableClipboard={false}
        style={{ backgroundColor: "transparent" }}
      />
    </div>
  );
}
