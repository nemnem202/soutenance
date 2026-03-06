import AccountPP from "@/components/account-pp";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import { Label } from "@/components/label";
import Searchbar from "@/components/searchbar";
import { Separator } from "@/components/separator";
import getPlaceholders from "@/pages/+data";
import { Project, ProjectSchema } from "@/types/project";
import { Heart } from "lucide-react";
import { ReactNode, useState } from "react";
import { usePageContext } from "vike-react/usePageContext";

export default function Page() {
  const { id } = usePageContext().routeParams;
  const [project, setProject] = useState(getPlaceholders().PROJECTS_PLACEHOLDERS.find((e) => e.id === id));

  if (!project) return null;
  return (
    <div className="flex flex-col ">
      <section>
        <Banner project={project} />
      </section>
      <section>
        <Content project={project} />
      </section>
    </div>
  );
}

function Banner({ project }: { project: Project }) {
  const account = getPlaceholders().ACCOUNTS_PLACEHOLDER.find((account) => account.id === project.accountId);
  return (
    <div className="flex w-full gap-8 items-center">
      <div className="w-75 rounded aspect-square overflow-hidden">
        <img
          src={project.image.src}
          alt={project.image.alt}
          width={300}
          height={300}
          className="object-cover h-full w-full"
        />
      </div>

      <div className="flex flex-col justify-center flex-1">
        <h1 className="headline h-min">{project.title}</h1>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            {account && <AccountPP account={account} />}
            <Label className="title-4">{project.author}</Label>
          </div>
          <div className="flex gap-2">
            <Label className="text-muted-foreground">{project.exercicesIds.length} exercices</Label>
            <Separator orientation="vertical" />
            <Label className="text-muted-foreground">medium</Label>
            <Separator orientation="vertical" />
            <Label className="text-muted-foreground">pop</Label>
          </div>
        </div>
      </div>
    </div>
  );
}

function Content({ project }: { project: Project }) {
  return (
    <div className="w-full">
      <div className="ml-auto max-w-116 my-9">
        <Searchbar placeholder="search the playlist" />
      </div>
      <PlaylistItemsList project={project} />
    </div>
  );
}

function PlaylistItemsList({ project }: { project: Project }) {
  return (
    <div className="w-full">
      <div className="w-full flex justify-between px-4 py-2">
        <Label className="paragramh-md text-muted-foreground">Exercice</Label>
        <div className="flex items-center">
          <PlaylistItemBox>
            <Label className="paragraph-md text-muted-foreground">Bpm</Label>
          </PlaylistItemBox>
          <PlaylistItemBox>
            <Label className="paragraph-md text-muted-foreground">Pop</Label>
          </PlaylistItemBox>
          <PlaylistItemBox>
            <Checkbox />
          </PlaylistItemBox>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="w-full flex flex-col justify-between  py-0 mt-2">
        {project.exercicesIds.map((id, index) => (
          <PlaylistItem index={index} key={index} project={project} id={id} />
        ))}
      </div>
    </div>
  );
}

function PlaylistItemBox({ children }: { children: ReactNode }) {
  return <div className={`w-12.5 flex justify-end`}>{children}</div>;
}

interface PLaylistItemProps {
  index: number;
  project: Project;
  id: string;
}

function PlaylistItem({ ...props }: PLaylistItemProps) {
  const exercice = getPlaceholders().EXERCICES_PLACEHOLDER.find((e) => e.id === props.id);
  if (!exercice) return null;

  return (
    <a
      className=" flex justify-between items-center py-1 my-1 relative cursor-pointer hover:bg-popover pr-4"
      href="/game"
    >
      <div className="flex items-center h-15">
        <img className="w-15 h-15" width={60} height={60} src={props.project.image.src} alt={props.project.image.alt} />
        <div className="flex h-fit gap-3">
          <div className="flex flex-col pl-2 gap-1">
            <Label className="title-4">{exercice.title}</Label>
            <Label className="paragraph-md text-muted-foreground">{exercice.author}</Label>
          </div>
          <div className="flex gap-1 h-full">
            {exercice.hasChords && (
              <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                chords
              </Badge>
            )}

            {exercice.haseMelody && (
              <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                melody
              </Badge>
            )}
          </div>
        </div>
      </div>
      <div className="flex items-center">
        <PlaylistItemBox>
          <Button size={"icon"} variant={"ghost"} className="rounded-full">
            <Heart className="stroke-muted-foreground" />
          </Button>
        </PlaylistItemBox>
        <PlaylistItemBox>
          <Label className="paragraph-md text-muted-foreground">{exercice.config.bpm}</Label>
        </PlaylistItemBox>
        <PlaylistItemBox>
          <Label className="paragraph-md">
            |||<span className="text-muted-foreground">|||</span>
          </Label>
        </PlaylistItemBox>
        <PlaylistItemBox>
          <Checkbox />
        </PlaylistItemBox>
      </div>
    </a>
  );
}
