"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, Plus, FolderOpen, FilePlus, FolderPlus } from "lucide-react";
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
    onFilesChange?: (files: FileNode[]) => void;
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
    selectedFile,
    level = 0
}: {
    node: FileNode;
    onFileSelect: (path: string, content: string) => void;
    selectedFile?: string;
    level?: number;
}) {
    const [isExpanded, setIsExpanded] = useState(true);

    if (node.type === "file") {
        const isSelected = selectedFile === node.path;
        return (
            <div
                className={cn(
                    "flex items-center gap-2 py-1.5 px-2 cursor-pointer group",
                    "hover:bg-[#2a2d39] transition-colors rounded",
                    isSelected && "bg-[#2a2d39]"
                )}
                style={{ paddingLeft: `${8 + level * 16}px` }}
                onClick={() => onFileSelect(node.path, node.content || "")}
            >
                <File className="h-4 w-4 text-[#6b7280] group-hover:text-[#9ca3af]" />
                <span className="text-sm text-[#d1d5db]">{node.name}</span>
            </div>
        );
    }

    return (
        <div>
            <div
                className="flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-[#2a2d39] transition-colors rounded"
                style={{ paddingLeft: `${8 + level * 16}px` }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-[#6b7280]" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-[#6b7280]" />
                )}
                {isExpanded ? (
                    <FolderOpen className="h-4 w-4 text-[#f59e0b]" />
                ) : (
                    <Folder className="h-4 w-4 text-[#f59e0b]" />
                )}
                <span className="text-sm text-[#d1d5db] font-medium">{node.name}</span>
            </div>
            {isExpanded && node.children && (
                <div>
                    {node.children.map((child, i) => (
                        <FileTreeNode
                            key={i}
                            node={child}
                            onFileSelect={onFileSelect}
                            selectedFile={selectedFile}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FileExplorer({ onFileSelect, selectedFile, onFilesChange }: FileExplorerProps) {
    const [files, setFiles] = useState<FileNode[]>(defaultFiles);
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [creatingType, setCreatingType] = useState<"file" | "folder" | null>(null);
    const [newItemName, setNewItemName] = useState("");

    const handleCreate = (type: "file" | "folder") => {
        setCreatingType(type);
        setNewItemName(type === "file" ? "untitled.move" : "new_folder");
        setShowCreateMenu(false);
    };

    const handleCreateConfirm = () => {
        if (!newItemName.trim() || !creatingType) return;

        const newNode: FileNode = {
            name: newItemName,
            type: creatingType,
            path: `sources/${newItemName}`,
            content: creatingType === "file" ? "// New file\n" : undefined,
            children: creatingType === "folder" ? [] : undefined
        };

        const updatedFiles = [...files];
        const sourcesFolder = updatedFiles.find(f => f.name === "sources");
        if (sourcesFolder && sourcesFolder.children) {
            sourcesFolder.children.push(newNode);
        }

        setFiles(updatedFiles);
        if (onFilesChange) onFilesChange(updatedFiles);

        setCreatingType(null);
        setNewItemName("");
    };

    const handleCreateCancel = () => {
        setCreatingType(null);
        setNewItemName("");
    };

    return (
        <div className="h-full bg-[#1e2029] border-r border-[#2a2d39] flex flex-col">
            <div className="flex items-center justify-between px-3 py-3 border-b border-[#2a2d39]">
                <h3 className="text-xs font-bold text-[#9ca3af] uppercase tracking-wider">
                    File Explorer
                </h3>
                <div className="relative">
                    <button
                        onClick={() => setShowCreateMenu(!showCreateMenu)}
                        className="p-1 hover:bg-[#2a2d39] rounded transition-colors"
                    >
                        <Plus className="h-4 w-4 text-[#6b7280]" />
                    </button>

                    {showCreateMenu && (
                        <div className="absolute right-0 mt-1 w-40 bg-[#2a2d39] border border-[#3a3d49] rounded-lg shadow-xl z-10">
                            <button
                                onClick={() => handleCreate("file")}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#d1d5db] hover:bg-[#3a3d49] rounded-t-lg transition-colors"
                            >
                                <FilePlus className="h-4 w-4" />
                                New File
                            </button>
                            <button
                                onClick={() => handleCreate("folder")}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#d1d5db] hover:bg-[#3a3d49] rounded-b-lg transition-colors"
                            >
                                <FolderPlus className="h-4 w-4" />
                                New Folder
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {creatingType && (
                <div className="px-3 py-2 bg-[#252830] border-b border-[#2a2d39]">
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreateConfirm();
                            if (e.key === "Escape") handleCreateCancel();
                        }}
                        className="w-full px-2 py-1 text-sm bg-[#1e2029] text-[#d1d5db] border border-[#4988C4] rounded focus:outline-none"
                        placeholder={creatingType === "file" ? "filename.move" : "folder_name"}
                        autoFocus
                    />
                    <div className="flex gap-2 mt-2">
                        <button
                            onClick={handleCreateConfirm}
                            className="flex-1 px-2 py-1 text-xs bg-[#4988C4] text-white rounded hover:bg-[#1C4D8D] transition-colors"
                        >
                            Create
                        </button>
                        <button
                            onClick={handleCreateCancel}
                            className="flex-1 px-2 py-1 text-xs bg-[#3a3d49] text-[#d1d5db] rounded hover:bg-[#4a4d59] transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <div className="flex-1 overflow-y-auto py-2 px-1">
                {files.map((node, i) => (
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
