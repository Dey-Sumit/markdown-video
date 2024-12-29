import { useEffect, useState } from "react";
import { EditorDatabase, type Project } from "./dexie-db";

export const useProjectDb = () => {
  const [db, setDb] = useState<EditorDatabase | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const { EditorDatabase } = require("./dexie-db");
      setDb(new EditorDatabase());
    }
  }, []);

  const createProject = async (
    title: string,
    description: string,
    category: string,
  ) => {
    if (!db) return null;
    return await db.createProject(title, description, category);
  };

  const getAllProjects = async () => {
    if (!db) return [];
    return await db.getAllProjects();
  };

  const updateProject = async (
    id: string,
    data: Partial<Omit<Project, "id" | "createdAt">>,
  ) => {
    if (!db) return;
    await db.updateProject(id, data);
  };

  const deleteProject = async (id: number) => {
    if (!db) return;
    await db.deleteProject(id);
  };

  return {
    createProject,
    getAllProjects,
    updateProject,
    deleteProject,
    isReady: !!db,
  };
};
