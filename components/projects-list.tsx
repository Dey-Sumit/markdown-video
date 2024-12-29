"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CreateProjectDialog } from "./create-project-dialog";
import dynamic from "next/dynamic";
import type { Project } from "@/lib/dexie-db";

const getRandomEmoji = () => {
  const emojis = ["🎥", "📹", "🎬", "🎦", "📽️", "🎭", "🎪", "🎨"];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const ProjectsList = () => {
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    const loadProjects = async () => {
      const db = (await import("../lib/dexie-db")).db;
      const allProjects = await db.getAllProjects();
      setProjects(allProjects);
    };
    loadProjects();
  }, []);

  // Replace MOCK_PROJECTS.map with projects.map
  return (
    <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      <CreateProjectDialog />

      {projects.map((project) => (
        <Link href={`/projects/${project.id}`} key={project.id}>
          <div
            key={project.id}
            className="flex min-h-52 cursor-pointer flex-col rounded-lg border border-gray-200 bg-gray-100 p-1 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div className="flex h-full min-h-40 flex-col justify-between rounded-md bg-white p-4 shadow-sm dark:bg-neutral-900">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="grow">
                  <h5 className="font-semibold text-gray-800 dark:text-neutral-200">
                    {project.title}
                  </h5>
                </div>

                <span className="inline-flex items-center gap-x-1.5 rounded-full border px-2 py-0.5 text-xs font-medium text-neutral-400 dark:border-neutral-600">
                  {project.duration}
                </span>
              </div>

              <div className="flex items-center gap-x-3">
                <div>
                  <div className="rounded-md border p-1 dark:border-neutral-700">
                    <span
                      role="img"
                      aria-label="icon"
                      className="object-contain"
                    >
                      {getRandomEmoji()}
                    </span>
                  </div>
                </div>

                <div className="grow">
                  <p className="text-sm text-gray-800 dark:text-neutral-200">
                    {project.category}
                  </p>
                  <p className="inline-flex items-center gap-x-1 text-xs text-muted-foreground">
                    <svg
                      className="size-3.5 shrink-0"
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Last modified on{" "}
                    {new Date(project.lastModified).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-auto">
              <ul className="flex flex-wrap items-center justify-center gap-3">
                <li className="relative inline-flex items-center pe-3.5 text-xs text-gray-500 after:absolute after:end-0 after:top-1/2 after:inline-block after:h-3 after:w-px after:-translate-y-1/2 after:bg-gray-300 last:pe-0 last:after:hidden dark:text-neutral-500 dark:after:bg-neutral-600">
                  <button
                    type="button"
                    disabled
                    className="py-3 text-xs font-medium text-gray-800 underline underline-offset-4 hover:text-indigo-600 focus:text-indigo-600 focus:outline-none disabled:pointer-events-none disabled:no-underline disabled:opacity-50 dark:text-neutral-200 dark:hover:text-indigo-400 dark:focus:text-indigo-400"
                  >
                    Remove
                  </button>
                </li>
                <li className="relative inline-flex items-center pe-3.5 text-xs text-gray-500 after:absolute after:end-0 after:top-1/2 after:inline-block after:h-3 after:w-px after:-translate-y-1/2 after:bg-gray-300 last:pe-0 last:after:hidden dark:text-neutral-500 dark:after:bg-neutral-600">
                  <button
                    type="button"
                    className="py-3 text-xs font-medium text-gray-800 hover:text-indigo-600 focus:text-indigo-600 focus:outline-none disabled:pointer-events-none disabled:no-underline disabled:opacity-50 dark:text-neutral-200 dark:hover:text-indigo-400 dark:focus:text-indigo-400"
                  >
                    Share
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ProjectsList;
