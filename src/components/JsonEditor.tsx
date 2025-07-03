import React from "react";
import Editor from "@monaco-editor/react";

interface Props {
  value: string;
  onChange: (value: string | undefined) => void;
  readOnly: boolean| undefined;
}

export const JsonEditor: React.FC<Props> = ({ value, onChange, readOnly }) => {
  return (
    <div 
      style={{ 
        border: "5px solid #ccc", 
        borderRadius: 4, 
        overflow: "hidden", 
        marginBottom: "1rem", 
        height:"50vh"
        }}>
      <Editor
        height="100%"
        defaultLanguage="json"
        value={value ?? ""}
        onChange={onChange}
        theme="vs-dark"
        options={{
          fontSize: 16,
          minimap: { enabled: false },
          wordWrap: "on",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          readOnly: readOnly
        }}
      />
    </div>
  );
};