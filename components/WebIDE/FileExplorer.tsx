"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileNode {
    name: string;
    type: "file" | "folder";
    path: string;
    children?: FileNode[];
    content?: string;
}

interface FileExplorerProps {
    onFileSelect: (path: string, content: string) => void;
    selectedFile?: string;
}

const defaultFiles: FileNode[] = [
    {
        name: "sources",
        type: "folder",
        path: "sources",
        children: [
            {
                name: "hello_world.move",
                type: "file",
                path: "sources/hello_world.move",
                content: `module hello_world::hello {
    use std::string;
    use sui::object::{Self, UID};
    use sui::transfer;
    use sui::tx_context::{Self, TxContext};

    public struct HelloWorld has key {
        id: UID,
        text: string::String
    }

    public entry fun mint(ctx: &mut TxContext) {
        let object = HelloWorld {
            id: object::new(ctx),
            text: string::utf8(b"Hello World!")
        };
        transfer::transfer(object, tx_context::sender(ctx));
    }
}`
            }
        ]
    },
    {
        name: "tests",
        type: "folder",
        path: "tests",
        children: [
            {
                name: "hello_world_tests.move",
                type: "file",
                path: "tests/hello_world_tests.move",
                content: `#[test_only]
module hello_world::hello_tests {
    // Test code here
}`
            }
        ]
    }
];

function FileTreeNode({
    node,
    onFileSelect,
    selectedFile
}: {
    node: FileNode;
    onFileSelect: (path: string, content: string) => void;
    selectedFile?: string;
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    if (node.type === "file") {
        const isSelected = selectedFile === node.path;
        return (
            <div
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-white/10 transition-colors",
                    isSelected && "bg-[#4988C4]/30"
                )}
                onClick={() => onFileSelect(node.path, node.content || "")}
            >
                <File className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-white/90">{node.name}</span>
            </div>
        );
    }

    return (
        <div>
            <div
                className="flex items-center gap-2 px-3 py-1.5 cursor-pointer hover:bg-white/10 transition-colors"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                )}
                <Folder className="h-4 w-4 text-[#4988C4]" />
                <span className="text-sm text-white/90 font-medium">{node.name}</span>
            </div>
            {isExpanded && node.children && (
                <div className="pl-4">
                    {node.children.map((child, i) => (
                        <FileTreeNode
                            key={i}
                            node={child}
                            onFileSelect={onFileSelect}
                            selectedFile={selectedFile}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FileExplorer({ onFileSelect, selectedFile }: FileExplorerProps) {
    return (
        <div className="h-full bg-[#1a1d29] border-r border-[#0F2854]">
            <div className="flex items-center justify-between p-3 border-b border-[#0F2854]">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                    File Explorer
                </h3>
                <button className="p-1 hover:bg-white/10 rounded transition-colors">
                    <Plus className="h-4 w-4 text-gray-400" />
                </button>
            </div>
            <div className="py-2">
                {defaultFiles.map((node, i) => (
                    <FileTreeNode
                        key={i}
                        node={node}
                        onFileSelect={onFileSelect}
                        selectedFile={selectedFile}
                    />
                ))}
            </div>
        </div>
    );
}
