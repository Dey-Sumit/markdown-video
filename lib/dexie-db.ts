import Dexie, { type Table } from "dexie";

interface EditorContent {
  id: number;
  content: string;
  updatedAt: Date;
}

export class EditorDatabase extends Dexie {
  editorContent!: Table<EditorContent>;

  constructor() {
    super("EditorDatabase");
    this.version(1).stores({
      editorContent: "++id, content, updatedAt",
    });
  }
}

export const db = new EditorDatabase();
