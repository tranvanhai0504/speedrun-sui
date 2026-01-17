import CodeEditor from 'react-simple-code-editor';
import Prism from 'prismjs';
import 'prismjs/components/prism-rust';
import { cn } from "@/lib/utils";

interface EditorProps {
    value: string;
    onChange: (value: string | undefined) => void;
    language?: string;
    filename?: string;
}

export default function Editor({ value, onChange, language = "move", filename = "untitled.move" }: EditorProps) {
    const lines = value.split('\n');

    return (
        <div className="h-full w-full flex flex-col bg-[#1e1e1e]">
            {/* Tab bar */}
            <div className="flex items-center gap-1 px-2 py-0 bg-[#252526] border-b border-[#1e1e1e]">
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1e1e1e] text-sm text-[#d1d5db] border-t-2 border-[#4988C4]">
                    <span>{filename}</span>
                </div>
            </div>

            {/* Editor area with line numbers */}
            <div className="flex-1 flex overflow-hidden relative">
                {/* Line numbers */}
                <div className="bg-[#1e1e1e] px-4 py-4 border-r border-[#2a2d39] select-none h-full overflow-hidden">
                    {lines.map((_, i) => (
                        <div
                            key={i}
                            className="text-xs text-[#858585] font-mono text-right leading-6 h-6"
                        >
                            {i + 1}
                        </div>
                    ))}
                </div>

                {/* Code area - Custom Prism Theme Styles injected directly */}
                <div className="flex-1 bg-[#1e1e1e] overflow-auto relative font-mono text-sm">
                    <style jsx global>{`
                        /* Custom Prism Theme for VS Code Dark+ look */
                        code[class*="language-"],
                        pre[class*="language-"],
                        .editor-container code,
                        .editor-container pre,
                        .editor-container textarea {
                            color: #d4d4d4 !important;
                            text-shadow: none;
                            font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
                            direction: ltr;
                            text-align: left;
                            white-space: pre;
                            word-spacing: normal;
                            word-break: normal;
                            line-height: 1.5rem;
                            tab-size: 4;
                            hyphens: none;
                        }

                        /* Caret color */
                        .editor-container textarea {
                            caret-color: #d4d4d4;
                        }

                        /* Keywords */
                        .token.keyword {
                            color: #569cd6 !important; /* Blue */
                        }
                        
                        /* Strings */
                        .token.string {
                            color: #ce9178 !important; /* Orange/Brown */
                        }

                        /* Comments */
                        .token.comment {
                            color: #6a9955 !important; /* Green */
                        }

                        /* Functions */
                        .token.function {
                            color: #dcdcaa !important; /* Yellow */
                        }

                        /* Numbers and Booleans */
                        .token.number,
                        .token.boolean {
                            color: #b5cea8 !important; /* Light Green */
                        }

                        /* Operators and Punctuation */
                        .token.operator,
                        .token.punctuation {
                            color: #d4d4d4 !important; /* Default Text */
                        }
                        
                        /* Types/Classes */
                        .token.class-name,
                        .token.type-definition {
                            color: #4ec9b0 !important; /* Teal */
                        }
                        
                        /* Specific storage qualifiers often seen in Move/Rust */
                        .token.keyword.module, 
                        .token.keyword.use,
                        .token.keyword.struct,
                        .token.keyword.public,
                        .token.keyword.fun,
                        .token.keyword.let,
                        .token.keyword.mut {
                            color: #569cd6 !important;
                        }
                    `}</style>
                    <CodeEditor
                        className="editor-container"
                        value={value}
                        onValueChange={(code) => onChange(code)}
                        highlight={code => Prism.highlight(code, Prism.languages.rust || Prism.languages.markup, 'rust')} // Using rust as proxy for Move
                        padding={16}
                        style={{
                            fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                            fontSize: 14,
                            backgroundColor: 'transparent',
                            minHeight: '100%',
                            lineHeight: '1.5rem',
                            color: '#d4d4d4'
                        }}
                        textareaClassName="focus:outline-none"
                    />
                </div>
            </div>
        </div>
    );
}
