import { useState } from "react";
import { Plus } from "lucide-react";
import { getRandomProject } from "@/pages/+data";

export function SmallPlaylistWidget() {
  const [project, setProject] = useState(getRandomProject());
  return (
    <a
      className="h-12 w-full hover:bg-popover rounded flex gap-2 cursor-pointer transition"
      href={`/playlist/${project.id}`}
    >
      <div className="h-12 w-12 aspect-square overflow-hidden">
        <img src={project.image.src} alt={project.image.alt} className="object-cover h-full w-full" width={48} />
      </div>
      <div className="flex flex-1 flex-col min-w-0">
        <p className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">{project.title}</p>
        <p className="paragraph-sm text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
          by {project.author}
        </p>
      </div>
    </a>
  );
}

export function MediumPlaylistWidget() {
  const [project, setProject] = useState(getRandomProject());

  return (
    <div className=" w-50 cursor-pointer hover:opacity-90 rounded-md transition">
      <a href={`/playlist/${project.id}`} className="flex flex-col rounded gap-2.5">
        <div className="w-full aspect-square rounded overflow-hidden">
          <img src={project.image.src} alt={project.image.alt} className="w-full h-full object-cover" width={185} />
        </div>

        <div className="flex-col flex w-full">
          <h3 className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">{project.title}</h3>
          <div className="w-full justify-between paragraph-sm text-muted-foreground flex wrap">
            <p className="whitespace-nowrap overflow-hidden text-ellipsis">by {project.author}</p>
          </div>
        </div>
      </a>
    </div>
  );
}

function MediumAddNewProjectWidget() {
  return (
    <div className=" w-50 cursor-pointer hover:bg-popover p-2 rounded-md transition">
      <a href="/new-project" className="flex flex-col rounded gap-2.5">
        <div className="w-full aspect-square rounded overflow-hidden bg-card flex items-center justify-center">
          <Plus size={100} />
        </div>

        <div className="flex-col flex w-full">
          <h3 className="title-4">New Project</h3>
        </div>
      </a>
    </div>
  );
}

export function MediumPlaylistWrapper({ allowToAddANewProject }: { allowToAddANewProject?: boolean }) {
  return (
    <div className="flex  gap-x-auto gap-y-5 flex-wrap container">
      {allowToAddANewProject && (
        <div className="mr-6.5">
          <MediumAddNewProjectWidget />
        </div>
      )}
      {Array.from({ length: 50 }).map((_, index) => (
        <div className="mr-6.5" key={index}>
          <MediumPlaylistWidget />
        </div>
      ))}
    </div>
  );
}
