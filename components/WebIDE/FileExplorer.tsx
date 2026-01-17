"use client";

import { useState } from "react";
import { ChevronRight, ChevronDown, File, Folder, Plus, FolderOpen, FilePlus, FolderPlus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useIde, FileNode } from "./IdeContext";

interface FileTreeNodeProps {
    node: FileNode;
    level?: number;
}

function FileTreeNode({
    node,
    level = 0
}: FileTreeNodeProps) {
    const { activeFile, openFile, deleteFile } = useIde();
    const [isExpanded, setIsExpanded] = useState(true);
    const [showActions, setShowActions] = useState(false);

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete ${node.name}?`)) {
            deleteFile(node.path);
        }
    };

    if (node.type === "file") {
        const isSelected = activeFile === node.path;
        return (
            <div
                className={cn(
                    "flex items-center justify-between gap-2 py-1.5 px-2 cursor-pointer group rounded select-none relative",
                    isSelected ? "bg-[#2a2d39]" : "hover:bg-[#2a2d39] transition-colors"
                )}
                style={{ paddingLeft: `${8 + level * 16}px` }}
                onClick={() => openFile(node.path)}
                onMouseEnter={() => setShowActions(true)}
                onMouseLeave={() => setShowActions(false)}
            >
                <div className="flex items-center gap-2 overflow-hidden">
                    <File className="h-4 w-4 text-[#6b7280] group-hover:text-[#9ca3af] flex-shrink-0" />
                    <span className="text-sm text-[#d1d5db] truncate">{node.name}</span>
                </div>
                {showActions && (
                    <button
                        onClick={handleDelete}
                        className="p-1 hover:bg-[#3a3d49] rounded"
                        title="Delete"
                    >
                        <Trash2 className="h-3 w-3 text-red-400" />
                    </button>
                )}
            </div>
        );
    }

    return (
        <div>
            <div
                className="flex items-center justify-between gap-2 py-1.5 px-2 cursor-pointer hover:bg-[#2a2d39] transition-colors rounded select-none group"
                style={{ paddingLeft: `${8 + level * 16}px` }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center gap-2">
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
                {/* Folder actions could go here */}
            </div>
            {isExpanded && node.children && (
                <div>
                    {node.children.map((child, i) => (
                        <FileTreeNode
                            key={`${child.path}-${i}`}
                            node={child}
                            level={level + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FileExplorer() {
    const { fileTree, createFile, createFolder } = useIde();
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

        // Default to sources/ if not specified, or just root?
        // IdeContext's createFile behaves simply on path.
        // For better UX, we might want to allow creating relative to selected folder, but flat list relies on full path.
        // Let's assume root "sources/" prefix if not present for simplicity or just root.
        // Given current structure is sources/module.move, let's prepend sources/ if not starting with it, or just allow free paths.
        // Let's use `sources/` as default root for new files for now if simple.

        let path = newItemName;
        if (!path.includes('/') && creatingType === 'file') {
            path = `sources/${path}`;
        }

        if (creatingType === "file") {
            createFile(path);
        } else {
            createFolder(path);
        }

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
                    Explorer
                </h3>
                <div className="relative">
                    <button
                        onClick={() => setShowCreateMenu(!showCreateMenu)}
                        className="p-1 hover:bg-[#2a2d39] rounded transition-colors"
                        title="New..."
                    >
                        <Plus className="h-4 w-4 text-[#6b7280]" />
                    </button>

                    {showCreateMenu && (
                        <div className="absolute right-0 mt-1 w-40 bg-[#2a2d39] border border-[#3a3d49] rounded-lg shadow-xl z-20">
                            <button
                                onClick={() => handleCreate("file")}
                                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#d1d5db] hover:bg-[#3a3d49] rounded-t-lg transition-colors"
                            >
                                <FilePlus className="h-4 w-4" />
                                New File
                            </button>
                            {/* Folder creation might be tricky with flat structure until we have real folder support, but kept for UI */}
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
                    <div className="text-xs text-[#9ca3af] mb-1">
                        Creating {creatingType}...
                    </div>
                    <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") handleCreateConfirm();
                            if (e.key === "Escape") handleCreateCancel();
                        }}
                        className="w-full px-2 py-1 text-sm bg-[#1e2029] text-[#d1d5db] border border-[#4988C4] rounded focus:outline-none focus:border-[#4988C4]"
                        placeholder={creatingType === "file" ? "sources/filename.move" : "folder_name"}
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
                {fileTree.map((node, i) => (
                    <FileTreeNode
                        key={`${node.path}-${i}`}
                        node={node}
                    />
                ))}
                {fileTree.length === 0 && (
                    <div className="text-center py-4 text-[#6b7280] text-sm">
                        No files yet
                    </div>
                )}
            </div>
        </div>
    );
}
