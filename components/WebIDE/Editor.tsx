import { Editor as MonacoEditor } from "@monaco-editor/react";
import { useTheme } from "next-themes";

interface EditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
}

export default function Editor({ value, onChange, language = "rust" }: EditorProps) {
    const { theme } = useTheme();

    return (
        <div className="h-full w-full bg-[#1e1e1e]">
            <MonacoEditor
                height="100%"
                defaultLanguage={language}
                value={value}
                onChange={onChange}
                theme="vs-dark"
                options={{
                    minimap: { enabled: false },
                    fontSize: 14,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    padding: { top: 16, bottom: 16 },
                    fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
                    fontLigatures: true,
                }}
            />
        </div>
    );
}
