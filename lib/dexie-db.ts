import { nanoid } from "nanoid";

/**
 * @fileoverview Core database setup and type definitions for the Markdown-to-Video editor
 * using Dexie as the IndexedDB wrapper.
 */

import Dexie, { type Table } from "dexie";
import { DEFAULT_PROJECT_TEMPLATE } from "@/store/project-store";
import { DEFAULT_COMPOSITION_STYLES } from "./const";

/**
 * Background configuration for the project
 */
export interface Background {
  color: string;
  gradient: {
    angle: number;
    colors: string[];
  };
  image: string;
  activeType: "color" | "gradient" | "image";
}

/**
 * Container styling configuration
 */
export interface Container {
  inset: number;
  padding: number;
  borderRadius: number;
}

/**
 * Project-wide styling configuration
 */
export interface ProjectStyles {
  backgroundContainer: {
    background: Background;
  };
  sceneContainer: Container;
}

/**
 * Core project data structure
 */

export interface Project {
  id: string; // Changed from number to string for UUID
  title: string; // Changed from name
  category: string; // Added
  duration: number; // Added
  description: string;
  content: string;
  styles: ProjectStyles;
  createdAt: Date;
  lastModified: Date;
}

/**
 * Database class extending Dexie with typed tables
 */
export class EditorDatabase extends Dexie {
  projects!: Table<Project>;

  constructor() {
    super("MarkdownVideoEditor");
    this.version(1).stores({
      projects: "id",
    });
  }

  /**
   * Creates a new project with default values
   * @param name - Project name
   * @param description - Project description
   * @returns Promise resolving to the new project's ID
   */
  async createProject(
    title: string,
    description: string,
    category: string,
  ): Promise<string> {
    const id = nanoid(6);
    const project: Project = {
      id,
      title,
      description,
      category,
      duration: 0,
      content: DEFAULT_PROJECT_TEMPLATE,
      styles: DEFAULT_COMPOSITION_STYLES,
      createdAt: new Date(),
      lastModified: new Date(),
    };

    await this.projects.add(project);
    return id;
  }

  /**
   * Retrieves all projects from the database
   * @returns Promise resolving to an array of projects
   */
  async getAllProjects(): Promise<Project[]> {
    return await this.projects.toArray();
  }

  /**
   * Updates an existing project
   * @param id - Project ID
   * @param data - Partial project data to update
   * @returns Promise resolving when update is complete
   */
  async updateProject(
    id: string, // Changed from number to string
    data: Partial<Omit<Project, "id" | "createdAt">>,
  ): Promise<void> {
    await this.projects.update(id, {
      ...data,
      lastModified: new Date(),
    });
  }
  /**
   * Deletes a project
   * @param id - Project ID
   * @returns Promise resolving when deletion is complete
   */
  async deleteProject(id: string): Promise<void> {
    await this.projects.delete(id);
  }
}

// Export a singleton instance
export const db = new EditorDatabase();
