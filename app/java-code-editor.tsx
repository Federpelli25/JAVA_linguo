'use client';

import { java } from '@codemirror/lang-java';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

const JAVA_EDITOR_EXTENSIONS = [java()];

type JavaCodeEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

export default function JavaCodeEditor({ value, onChange }: JavaCodeEditorProps) {
  return (
    <CodeMirror
      className="java-code-editor"
      aria-label="Codice Java nel file Main.java"
      value={value}
      height="100%"
      theme={vscodeDark}
      extensions={JAVA_EDITOR_EXTENSIONS}
      basicSetup={{
        lineNumbers: true,
        highlightActiveLineGutter: true,
        foldGutter: true,
        dropCursor: true,
        allowMultipleSelections: true,
        indentOnInput: true,
        bracketMatching: true,
        closeBrackets: true,
        autocompletion: true,
        highlightActiveLine: true,
        highlightSelectionMatches: true,
      }}
      onChange={onChange}
    />
  );
}
