import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import Editor from "./Editor";
import Terminal from "./Terminal";

interface WebIDEProps {
    initialCode?: string;
    onCodeChange?: (value: string | undefined) => void;
}

export default function WebIDE({ initialCode = "// Start coding...", onCodeChange }: WebIDEProps) {
    return (
        <ResizablePanelGroup direction="vertical" className="min-h-[600px] border-2 border-[#0F2854] rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_#0F2854]">
            <ResizablePanel defaultSize={70} minSize={30}>
                <Editor value={initialCode} onChange={onCodeChange ?? (() => { })} />
            </ResizablePanel>
            <ResizableHandle withHandle className="bg-[#0F2854] h-2" />
            <ResizablePanel defaultSize={30} minSize={10}>
                <Terminal />
            </ResizablePanel>
        </ResizablePanelGroup>
    );
}
