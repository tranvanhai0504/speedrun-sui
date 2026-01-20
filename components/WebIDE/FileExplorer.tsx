"use client";

import React, { useState, useMemo } from "react";
import { ChevronRight, ChevronDown, File, Folder, Plus, FolderOpen, FilePlus, FolderPlus } from "lucide-react";
import { cn } from "@/lib/utils";

export interface FileNode {
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
    buildFiles?: Record<string, string>; // Build artifacts from compilation
}

export const defaultFiles: FileNode[] = [
    {
        name: "Move.toml",
        type: "file",
        path: "Move.toml",
        content: `[package]
name = "hello_world"
version = "0.0.1"
edition = "2024.alpha"

[dependencies]
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "framework/testnet" }

[addresses]
hello_world = "0x0"`
    },
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

    public struct HelloWorld has key, store {
        id: UID,
        text: string::String
    }

    fun init(ctx: &mut TxContext) {
        let object = HelloWorld {
            id: object::new(ctx),
            text: string::utf8(b"Hello World!")
        };
        transfer::public_transfer(object, tx_context::sender(ctx));
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
    level = 0,
    onDragStart,
    onDrop,
    onDragOver
}: {
    node: FileNode;
    onFileSelect: (path: string, content: string) => void;
    selectedFile?: string;
    level?: number;
    onDragStart: (node: FileNode) => void;
    onDrop: (targetNode: FileNode) => void;
    onDragOver: (e: React.DragEvent) => void;
}) {
    const [isExpanded, setIsExpanded] = useState(true);
    const [isDragOver, setIsDragOver] = useState(false);

    if (node.type === "file") {
        const isSelected = selectedFile === node.path;
        return (
            <div
                draggable
                onDragStart={() => onDragStart(node)}
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                    onDragOver(e);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    onDrop(node);
                }}
                className={cn(
                    "flex items-center gap-2 py-1.5 px-2 cursor-pointer group",
                    "hover:bg-[#2a2d39] transition-colors rounded",
                    isSelected && "bg-[#2a2d39]",
                    isDragOver && "bg-[#4988C4]/20 border border-[#4988C4]"
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
                onDragOver={(e) => {
                    e.preventDefault();
                    setIsDragOver(true);
                    onDragOver(e);
                }}
                onDragLeave={() => setIsDragOver(false)}
                onDrop={(e) => {
                    e.preventDefault();
                    setIsDragOver(false);
                    onDrop(node);
                }}
                className={cn(
                    "flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-[#2a2d39] transition-colors rounded",
                    isDragOver && "bg-[#4988C4]/20 border border-[#4988C4]"
                )}
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
                            onDragStart={onDragStart}
                            onDrop={onDrop}
                            onDragOver={onDragOver}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default function FileExplorer({ onFileSelect, selectedFile, onFilesChange, buildFiles }: FileExplorerProps) {
    const [files, setFiles] = useState<FileNode[]>(defaultFiles);
    const [showCreateMenu, setShowCreateMenu] = useState(false);
    const [creatingType, setCreatingType] = useState<"file" | "folder" | null>(null);
    const [newItemName, setNewItemName] = useState("");
    const [draggedNode, setDraggedNode] = useState<FileNode | null>(null);

    // Convert buildFiles to FileNode structure
    const buildFolderNode: FileNode | null = useMemo(() => {
        if (!buildFiles || Object.keys(buildFiles).length === 0) return null;

        const root: FileNode = {
            name: "build",
            type: "folder",
            path: "build",
            children: []
        };

        Object.entries(buildFiles).forEach(([path, content]) => {
            // Hide dependencies/ folder to reduce clutter
            if (path.includes('/dependencies/')) return;

            // Remove 'build/' prefix if exists (since root is 'build')
            // path from backend is like: build/Pkg/bytecode_modules/x.mv
            const relativePath = path.startsWith('build/') ? path.slice(6) : path;
            const parts = relativePath.split('/');

            let currentLevel = root.children!;
            let currentPath = "build";

            parts.forEach((part, index) => {
                const isFile = index === parts.length - 1;
                currentPath = `${currentPath}/${part}`;

                if (isFile) {
                    currentLevel.push({
                        name: part,
                        type: "file",
                        path: path, // Use full path key
                        content: part.endsWith('.mv')
                            ? `// Compiled bytecode (Base64)\n// This file is read-only.\n${content}`
                            : content
                    });
                } else {
                    let folder = currentLevel.find(n => n.name === part && n.type === "folder");
                    if (!folder) {
                        folder = {
                            name: part,
                            type: "folder",
                            path: currentPath,
                            children: []
                        };
                        currentLevel.push(folder);
                    }
                    currentLevel = folder.children!;
                }
            });
        });

        // Sort: Folders first, then files
        const sortNodes = (nodes: FileNode[]) => {
            nodes.sort((a, b) => {
                if (a.type === b.type) return a.name.localeCompare(b.name);
                return a.type === "folder" ? -1 : 1;
            });
            nodes.forEach(n => {
                if (n.children) sortNodes(n.children);
            });
        };
        if (root.children) sortNodes(root.children);

        return root;
    }, [buildFiles]);

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

    const handleDragStart = (node: FileNode) => {
        setDraggedNode(node);
    };

    const handleDrop = (targetNode: FileNode) => {
        if (!draggedNode || draggedNode.path === targetNode.path) return;

        let targetPath = targetNode.path;

        // If dropping on a file, target its parent folder
        if (targetNode.type === "file") {
            const lastSlash = targetNode.path.lastIndexOf('/');
            targetPath = lastSlash === -1 ? "" : targetNode.path.substring(0, lastSlash);
        }

        // Prevent moving into self or children
        if (draggedNode.type === "folder" && (targetPath === draggedNode.path || targetPath.startsWith(draggedNode.path + '/'))) {
            return;
        }

        // Prevent moving to same location
        const draggedParent = draggedNode.path.lastIndexOf('/') === -1 ? "" : draggedNode.path.substring(0, draggedNode.path.lastIndexOf('/'));
        if (draggedParent === targetPath) return;

        // Recursive helper to update paths
        const updateNodePaths = (node: FileNode, newBasePath: string): FileNode => {
            const newPath = newBasePath ? `${newBasePath}/${node.name}` : node.name;
            return {
                ...node,
                path: newPath,
                children: node.children?.map(child => updateNodePaths(child, newPath))
            };
        };

        // Remove from old location
        const removeNode = (nodes: FileNode[], path: string): FileNode[] => {
            return nodes.filter(n => {
                if (n.path === path) return false;
                if (n.children) {
                    n.children = removeNode(n.children, path);
                }
                return true;
            });
        };

        // Add to new location
        const addNode = (nodes: FileNode[], targetFolder: string, nodeToAdd: FileNode): FileNode[] => {
            return nodes.map(n => {
                if (n.path === targetFolder && n.type === "folder") {
                    const updatedNode = updateNodePaths(nodeToAdd, targetFolder);
                    return {
                        ...n,
                        children: [...(n.children || []), updatedNode]
                    };
                }
                if (n.children) {
                    return { ...n, children: addNode(n.children, targetFolder, nodeToAdd) };
                }
                return n;
            });
        };

        let updatedFiles = removeNode([...files], draggedNode.path);

        // If dropping to root
        if (targetPath === "") {
            const updatedNode = updateNodePaths(draggedNode, "");
            updatedFiles.push(updatedNode);
        } else {
            updatedFiles = addNode(updatedFiles, targetPath, draggedNode);
        }

        setFiles(updatedFiles);
        if (onFilesChange) onFilesChange(updatedFiles);
        setDraggedNode(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    // Root drop zone
    const handleRootDrop = (e: React.DragEvent) => {
        e.preventDefault();
        if (!draggedNode) return;

        // Prevent moving if already in root
        const draggedParent = draggedNode.path.lastIndexOf('/') === -1 ? "" : draggedNode.path.substring(0, draggedNode.path.lastIndexOf('/'));
        if (draggedParent === "") return;

        const updateNodePaths = (node: FileNode, newBasePath: string): FileNode => {
            const newPath = newBasePath ? `${newBasePath}/${node.name}` : node.name;
            return {
                ...node,
                path: newPath,
                children: node.children?.map(child => updateNodePaths(child, newPath))
            };
        };

        // Remove from old location
        const removeNode = (nodes: FileNode[], path: string): FileNode[] => {
            return nodes.filter(n => {
                if (n.path === path) return false;
                if (n.children) {
                    n.children = removeNode(n.children, path);
                }
                return true;
            });
        };

        let updatedFiles = removeNode([...files], draggedNode.path);
        const updatedNode = updateNodePaths(draggedNode, "");
        updatedFiles.push(updatedNode);

        setFiles(updatedFiles);
        if (onFilesChange) onFilesChange(updatedFiles);
        setDraggedNode(null);
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

            <div
                className="flex-1 overflow-y-auto py-2 px-1"
                onDragOver={handleDragOver}
                onDrop={handleRootDrop}
            >
                {files.map((node, i) => (
                    <FileTreeNode
                        key={i}
                        node={node}
                        onFileSelect={onFileSelect}
                        selectedFile={selectedFile}
                        onDragStart={handleDragStart}
                        onDrop={handleDrop}
                        onDragOver={handleDragOver}
                    />
                ))}
                {buildFolderNode && (
                    <FileTreeNode
                        key="build"
                        node={buildFolderNode}
                        onFileSelect={onFileSelect}
                        selectedFile={selectedFile}
                        onDragStart={handleDragStart} // Allow dragging copies from build
                        onDrop={() => { }} // Prevent dropping into build folder
                        onDragOver={() => { }}
                    />
                )}
            </div>
        </div>
    );
}
