import AccountPP from "@/components/account-pp";
import { Button } from "@/components/button";
import { Checkbox } from "@/components/checkbox";
import { Label } from "@/components/label";
import Searchbar from "@/components/searchbar";
import { Separator } from "@/components/separator";
import { Heart } from "lucide-react";
import { ReactNode } from "react";

export default function Page() {
  return (
    <div className="flex flex-col ">
      <section>
        <Banner />
      </section>
      <section>
        <Content />
      </section>
    </div>
  );
}

function Banner() {
  return (
    <div className="flex w-full gap-8 items-center">
      <div className="w-75 rounded aspect-square overflow-hidden">
        <img src="assets/playlist2.png" width={300} height={300} className="object-cover" />
      </div>

      <div className="flex flex-col justify-center flex-1">
        <h1 className="headline h-min">Brown Sugar</h1>
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <AccountPP />
            <Label className="title-4">D'Angelo</Label>
          </div>
          <div className="flex gap-2">
            <Label className="text-muted-foreground">50 exercices</Label>
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

function Content() {
  return (
    <div className="w-full">
      <div className="ml-auto max-w-116 my-9">
        <Searchbar placeholder="search the playlist" />
      </div>
      <PlaylistItemsList />
    </div>
  );
}

function PlaylistItemsList() {
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
        {Array.from({ length: 40 }).map((_, index) => (
          <PlaylistItem index={index} key={index} />
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
}

function PlaylistItem({ ...props }: PLaylistItemProps) {
  return (
    <a className=" flex justify-between items-center py-1 relative cursor-pointer hover:bg-popover pr-4" href="/game">
      <div className="flex items-center">
        <img className="w-15 h-15" width={60} height={60} src="assets/playlist2.png" />
        <div className="flex flex-col pl-2 gap-1">
          <Label className="title-4">Feel like makin' love</Label>
          <Label className="paragraph-md text-muted-foreground">Erold Graner</Label>
        </div>
      </div>
      <div className="flex items-center">
        <PlaylistItemBox>
          <Button size={"icon"} variant={"ghost"} className="rounded-full">
            <Heart className="stroke-muted-foreground" />
          </Button>
        </PlaylistItemBox>
        <PlaylistItemBox>
          <Label className="paragraph-md text-muted-foreground">120</Label>
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
