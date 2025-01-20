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
    fontFamily: string;
  };
  sceneContainer: Container;
}


export interface ProjectConfiguration {
  content: {
    global: string;
    sceneLevel: string;
  };
  styles: ProjectStyles;
}

// Interface for project metadata
export interface ProjectMeta {
  title: string;
  description: string;
  category: string;
}

// Main project interface with segregated columns
export interface Project {
  id: string;
  meta: ProjectMeta;
  config: ProjectConfiguration;
  duration: number;
  createdAt: Date;
  lastModified: Date;
}
