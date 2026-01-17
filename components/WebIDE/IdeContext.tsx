"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProject, saveProject, IDEProject } from "@/lib/api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export interface FileNode {
    name: string;
    type: "file" | "folder";
    path: string;
    children?: FileNode[];
    content?: string;
}

interface IdeContextType {
    files: Record<string, string>;
    fileTree: FileNode[];
    activeFile: string | null;
    openFile: (path: string) => void;
    updateFileContent: (path: string, content: string) => void;
    createFile: (path: string) => void;
    createFolder: (path: string) => void;
    deleteFile: (path: string) => void;
    save: () => Promise<void>;
    isSaving: boolean;
    isLoading: boolean;
    projectId: string | null;
    setProjectId: (id: string | null) => void;
}

const IdeContext = createContext<IdeContextType | undefined>(undefined);

// Helper to convert flat files to tree
function buildFileTree(files: Record<string, string>): FileNode[] {
    const root: FileNode[] = [];

    Object.keys(files).sort().forEach(path => {
        const parts = path.split('/');
        let currentLevel = root;
        let currentPath = "";

        parts.forEach((part, index) => {
            currentPath = currentPath ? `${currentPath}/${part}` : part;
            const isFile = index === parts.length - 1;

            let node = currentLevel.find(n => n.name === part);

            if (!node) {
                node = {
                    name: part,
                    type: isFile ? "file" : "folder",
                    path: currentPath,
                    children: isFile ? undefined : [],
                    content: isFile ? files[path] : undefined
                };
                currentLevel.push(node);
            }

            if (!isFile && node.children) {
                currentLevel = node.children;
            }
        });
    });

    return root;
}

export function IdeProvider({ children, challengeId }: { children: React.ReactNode; challengeId?: string }) {
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [files, setFiles] = useState<Record<string, string>>({
        "sources/module.move": "// Start coding here..."
    });
    const [activeFile, setActiveFile] = useState<string | null>("sources/module.move");
    const [projectId, setProjectId] = useState<string | null>(null);

    // Initial load intent - check if we have a saved project for this challenge?
    // For now, we rely on the user to "Load" or we can auto-load if we had an endpoint for "get my project for challenge X".
    // The current API `getProject(id)` requires a project ID.
    // We might need to store the projectId in localStorage mapped to challengeId.

    useEffect(() => {
        if (challengeId) {
            const savedProjId = localStorage.getItem(`ide_project_${challengeId}`);
            if (savedProjId) {
                setProjectId(savedProjId);
            }
        }
    }, [challengeId]);

    const { data: project, isLoading } = useQuery({
        queryKey: ['ide-project', projectId],
        queryFn: () => projectId ? getProject(projectId) : Promise.resolve(null),
        enabled: !!projectId
    });

    useEffect(() => {
        if (project) {
            setFiles(project.files);
            // If active file is not in new files, reset it
            if (activeFile && !project.files[activeFile]) {
                setActiveFile(Object.keys(project.files)[0] || null);
            }
        }
    }, [project]);

    const saveMutation = useMutation({
        mutationFn: async (currentFiles: Record<string, string>) => {
            const projectData: IDEProject = {
                id: projectId || undefined,
                name: `Challenge ${challengeId || 'Untitled'}`,
                files: currentFiles,
                description: `Solution for challenge ${challengeId}`
            };
            return saveProject(projectData);
        },
        onSuccess: (data) => {
            if (data.id) {
                setProjectId(data.id);
                if (challengeId) {
                    localStorage.setItem(`ide_project_${challengeId}`, data.id);
                }
                toast.success("Project saved");
            }
        },
        onError: (error: unknown) => {
            toast.error("Failed to save project");
            console.error(error);
        }
    });

    const openFile = useCallback((path: string) => {
        setActiveFile(path);
    }, []);

    const updateFileContent = useCallback((path: string, content: string) => {
        setFiles(prev => ({ ...prev, [path]: content }));
    }, []);

    const createFile = useCallback((path: string) => {
        setFiles(prev => {
            if (prev[path]) return prev; // Already exists
            return { ...prev, [path]: "" };
        });
        setActiveFile(path);
    }, []);

    const createFolder = useCallback((path: string) => {
        // Folders are implicit in keys, but we can't really have empty folders in this flat structure easily 
        // without a placeholder file like .keep.
        // For simplicity, we might just handle file creation.
        // If we really need empty folders, we'd need to mock them or just allow creating files inside them.
        // Let's assume we just create a placeholder
        // setFiles(prev => ({ ...prev, [`${path}/.keep`]: "" }));
    }, []);

    const deleteFile = useCallback((path: string) => {
        setFiles(prev => {
            const newFiles = { ...prev };
            delete newFiles[path];

            // Also delete children if it was a folder (implied by path prefix)
            Object.keys(newFiles).forEach(key => {
                if (key.startsWith(path + '/')) {
                    delete newFiles[key];
                }
            });

            return newFiles;
        });
        if (activeFile === path) {
            setActiveFile(null);
        }
    }, [activeFile]);

    const save = async () => {
        await saveMutation.mutateAsync(files);
    };

    const fileTree = React.useMemo(() => buildFileTree(files), [files]);

    return (
        <IdeContext.Provider value={{
            files,
            fileTree,
            activeFile,
            openFile,
            updateFileContent,
            createFile,
            createFolder,
            deleteFile,
            save,
            isSaving: saveMutation.isPending,
            isLoading,
            projectId,
            setProjectId
        }}>
            {children}
        </IdeContext.Provider>
    );
}

export function useIde() {
    const context = useContext(IdeContext);
    if (context === undefined) {
        throw new Error("useIde must be used within an IdeProvider");
    }
    return context;
}
