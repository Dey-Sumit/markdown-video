import Dexie, { type Table } from "dexie";
import { nanoid } from "nanoid";
import { DEFAULT_COMPOSITION_STYLES } from "./const";
import type { ProjectStyles } from "@/types/project.types";
import { DEFAULT_PROJECT_TEMPLATE } from "@/store/project.const";

// Project configuration interface (content + styles)
export interface ProjectConfiguration {
  content: {
    global: string;
    sceneLevel: string;
  };
  styles: ProjectStyles;
}

// Project metadata interface
export interface ProjectMeta {
  title: string;
  description: string;
  category: string;
}

// Database-specific project interface (without scenes)
export interface ProjectDB {
  id: string;
  meta: ProjectMeta;
  config: ProjectConfiguration;
  duration: number;
  createdAt: Date;
  lastModified: Date;
}

export class EditorDatabase extends Dexie {
  projects!: Table<ProjectDB>;

  constructor() {
    super("MarkdownVideoEditor");

    this.version(1).stores({
      projects: "id, &meta.title, duration, createdAt, lastModified",
    });
  }

  /**
   * Creates a new project
   * @param title Project title
   * @param description Project description
   * @param category Project category
   * @returns Promise resolving to the new project's ID
   */
  async createProject(
    title: string,
    description: string,
    category: string,
  ): Promise<string> {
    const id = nanoid(6);
    const now = new Date();

    const project: ProjectDB = {
      id,
      meta: {
        title,
        description,
        category,
      },
      config: {
        content: {
          global: "",
          sceneLevel: DEFAULT_PROJECT_TEMPLATE,
        },
        styles: DEFAULT_COMPOSITION_STYLES,
      },
      duration: 0,
      createdAt: now,
      lastModified: now,
    };

    await this.projects.add(project);
    return id;
  }

  /**
   * Retrieves all projects
   * @returns Promise resolving to array of projects
   */
  async getAllProjects(): Promise<ProjectDB[]> {
    return await this.projects.toArray();
  }

  /**
   * Gets a single project by ID
   * @param id Project ID
   * @returns Promise resolving to project or undefined
   */
  async getProject(id: string): Promise<ProjectDB | undefined> {
    return await this.projects.get(id);
  }

  /**
   * Updates entire project data
   * @param id Project ID
   * @param data Partial project data to update
   */
  async updateProject(
    id: string,
    data: Partial<Omit<ProjectDB, "id" | "createdAt">>,
  ): Promise<void> {
    await this.projects.update(id, {
      ...data,
      lastModified: new Date(),
    });
  }

  /**
   * Updates project metadata
   * @param id Project ID
   * @param meta Partial metadata to update
   */
  async updateProjectMeta(
    id: string,
    meta: Partial<ProjectMeta>,
  ): Promise<void> {
    const project = await this.projects.get(id);
    if (!project) throw new Error("Project not found");

    await this.projects.update(id, {
      meta: { ...project.meta, ...meta },
      lastModified: new Date(),
    });
  }

  /**
   * Updates project configuration (content or styles)
   * @param id Project ID
   * @param type Configuration type to update
   * @param data New configuration data
   */
  async updateProjectConfig(
    id: string,
    type: keyof ProjectConfiguration,
    data: any,
  ): Promise<void> {
    const project = await this.projects.get(id);
    if (!project) throw new Error("Project not found");

    await this.projects.update(id, {
      config: {
        ...project.config,
        [type]: data,
      },
      lastModified: new Date(),
    });
  }

  /**
   * Updates project content (global or sceneLevel)
   * @param id Project ID
   * @param type Content type to update
   * @param content New content
   */
  async updateContent(
    id: string,
    type: "global" | "sceneLevel",
    content: string,
  ): Promise<void> {
    const project = await this.projects.get(id);
    if (!project) throw new Error("Project not found");

    await this.projects.update(id, {
      config: {
        ...project.config,
        content: {
          ...project.config.content,
          [type]: content,
        },
      },
      lastModified: new Date(),
    });
  }

  /**
   * Updates project duration
   * @param id Project ID
   * @param duration New duration
   */
  async updateDuration(id: string, duration: number): Promise<void> {
    await this.projects.update(id, {
      duration,
      lastModified: new Date(),
    });
  }

  /**
   * Deletes a project
   * @param id Project ID
   */
  async deleteProject(id: string): Promise<void> {
    await this.projects.delete(id);
  }

  /**
   * Gets projects by category
   * @param category Category to filter by
   * @returns Promise resolving to filtered projects
   */
  async getProjectsByCategory(category: string): Promise<ProjectDB[]> {
    return await this.projects
      .filter((project) => project.meta.category === category)
      .toArray();
  }

  /**
   * Searches projects by title
   * @param query Search query
   * @returns Promise resolving to matching projects
   */
  async searchProjects(query: string): Promise<ProjectDB[]> {
    return await this.projects
      .filter(
        (project) =>
          project.meta.title.toLowerCase().includes(query.toLowerCase()) ||
          project.meta.description.toLowerCase().includes(query.toLowerCase()),
      )
      .toArray();
  }
}

// Export database instance
export const dexieDB = new EditorDatabase();
