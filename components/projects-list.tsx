import { MOCK_PROJECTS } from "@/data/mock.projects";
import Link from "next/link";

const getRandomEmoji = () => {
  const emojis = ["🎥", "📹", "🎬", "🎦", "📽️", "🎭", "🎪", "🎨"];
  return emojis[Math.floor(Math.random() * emojis.length)];
};

const ProjectsList = () => {
  return (
    <div className="grid w-full grid-cols-1 gap-5 sm:grid-cols-3 lg:grid-cols-4">
      <button
        type="button"
        className="group flex min-h-52 gap-y-2 rounded-2xl border border-dashed border-gray-300 bg-gray-100 p-1 hover:border-gray-400 focus:border-gray-400 focus:outline-none dark:border-neutral-700 dark:bg-neutral-800 dark:hover:border-neutral-600 dark:focus:border-neutral-600"
        data-hs-overlay="#hs-pro-shcpm"
      >
        <div className="flex h-full min-h-40 w-full flex-col items-center justify-center rounded-xl bg-white shadow-sm dark:bg-neutral-900">
          <svg
            className="size-7 shrink-0 text-primary dark:text-primary"
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14" />
            <path d="M12 5v14" />
          </svg>

          <span className="text-sm text-primary dark:text-primary">
            Create new project
          </span>
        </div>
      </button>

      {MOCK_PROJECTS.map((project) => (
        <Link href={`/projects/${project.id}`} key={project.id}>
          <div
            key={project.id}
            className="flex min-h-52 cursor-pointer flex-col rounded-2xl border border-gray-200 bg-gray-100 p-1 dark:border-neutral-700 dark:bg-neutral-800"
          >
            <div className="flex h-full min-h-40 flex-col justify-between rounded-xl bg-white p-4 shadow-sm dark:bg-neutral-900">
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
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
