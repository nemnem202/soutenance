import { useState, type ReactNode } from "react";
import SizeAdapter from "@/components/molecules/size-adapter";
import { WidgetTitle } from "@/components/organisms/widget-carousel";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { LikeButton } from "@/components/ui/custom-buttons";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import type { ExerciseCardDto } from "@/types/dtos/exercise";
import type { PlaylistDetailDto } from "@/types/dtos/playlist";
import useSession from "@/hooks/use-session";
import { Plus } from "lucide-react";
import ExerciseContextMenuButton, { MultiExerciseContextMenuButton } from "./exercise-menu";
import { handleLikeExercise } from "@/lib/utils";

export function PlaylistItemsList({
  playlist,
  displayedExercises,
}: {
  playlist: PlaylistDetailDto;
  displayedExercises: ExerciseCardDto[];
}) {
  const { instance } = useLanguage();
  const { session } = useSession();
  const [selected, setSelected] = useState<ExerciseCardDto[]>([]);

  const handleExerciseSelectChange = (exercise: ExerciseCardDto, isSelected: boolean) => {
    if (!isSelected) {
      setSelected((prev) => prev.filter((e) => e.id !== exercise.id));
    } else if (!selected.find((e) => e.id === exercise.id)) {
      setSelected((prev) => {
        if (prev.find((e) => e.id === exercise.id)) return prev;
        return [...prev, exercise];
      });
    }
  };

  const handleSelectChangeForAll = (select: boolean) => {
    if (select) {
      setSelected(playlist.exercises);
    } else {
      setSelected([]);
    }
  };

  return (
    <div className="w-full">
      <div className="w-full flex justify-between px-4 py-2">
        <p className="paragramh-md text-muted-foreground">{instance.getItem("exercise")}</p>
        <div className="flex items-center max-h-6">
          <PlaylistItemBox>
            <p className="paragraph-md text-muted-foreground">{instance.getItem("bpm")}</p>
          </PlaylistItemBox>
          <SizeAdapter
            md={
              <PlaylistItemBox>
                <p className="paragraph-md text-muted-foreground">{instance.getItem("pop")}</p>
              </PlaylistItemBox>
            }
          />
          <PlaylistItemBox>
            <div className={`${selected.length < 2 && "hidden"}`}>
              <MultiExerciseContextMenuButton exercises={selected} playlistContext={playlist} />
            </div>
          </PlaylistItemBox>
          <PlaylistItemBox className="!min-w-8">
            <Checkbox
              onCheckedChange={handleSelectChangeForAll}
              checked={selected.length === playlist.exercises.length}
            />
          </PlaylistItemBox>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="w-full flex flex-col justify-between  py-0 mt-2">
        {session?.id === playlist.author.id && <AddNewExercisePlaylistItem />}
        {displayedExercises.map((exercise, index) => (
          <PlaylistItem
            index={index}
            key={index}
            playlist={playlist}
            exercise={exercise}
            selected={!!selected.find((e) => e.id === exercise.id)}
            onSelectChange={(isSelected) => handleExerciseSelectChange(exercise, isSelected)}
          />
        ))}
      </div>
    </div>
  );
}

export function PlaylistItemBox({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`md:min-w-12.5 min-w-8 flex justify-end ${className}`}>{children}</div>;
}

export interface PLaylistItemProps {
  index: number;
  playlist: PlaylistDetailDto;
  exercise: ExerciseCardDto;
  onSelectChange?: (select: boolean) => void;
  selected?: boolean;
}

export function AddNewExercisePlaylistItem() {
  const { instance } = useLanguage();
  return (
    <a
      className=" flex justify-between items-center py-1 pl-1 my-1 relative cursor-pointer hover:bg-popover pr-4 transition"
      href="/new-game"
    >
      <div className="flex items-center h-15 text-primary gap-4">
        <div className="h-full aspect-square  flex justify-center bg-popover items-center">
          <Plus />
        </div>
        <p className="paragraph">{instance.getItem("new_exercise")}</p>
      </div>
    </a>
  );
}

export function PlaylistItem({ ...props }: PLaylistItemProps) {
  const { instance } = useLanguage();
  const { exercise } = props;
  const [isLiked, setIsLiked] = useState(exercise.likedByCurrentUser);
  if (!exercise) return null;

  return (
    <a
      className=" flex justify-between items-center py-1 pl-1 my-1 relative cursor-pointer hover:bg-popover pr-4 transition"
      href="/game"
    >
      <div className="flex items-center h-15">
        <img
          className="w-15 h-15 object-cover "
          width={60}
          height={60}
          src={props.exercise.cover.url}
          alt={props.exercise.cover.alt}
        />

        <div className="flex flex-1 min-w-0 h-fit gap-3">
          <div className="flex flex-1 flex-col min-w-0 pl-2 gap-1">
            <p className="title-4 whitespace-nowrap overflow-hidden text-ellipsis">
              {exercise.title}
            </p>
            <p className="paragraph-md text-muted-foreground">{exercise.author.username}</p>
          </div>

          <SizeAdapter
            md={
              <div className="flex gap-1 h-full">
                {exercise.chordsGrid && (
                  <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                    {instance.getItem("chords")}
                  </Badge>
                )}

                {exercise.midifileUrl && (
                  <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                    {instance.getItem("melody").toLowerCase()}
                  </Badge>
                )}
              </div>
            }
          />
        </div>
      </div>
      <div className="flex items-center">
        <PlaylistItemBox>
          <LikeButton
            onClick={(e) => {
              handleLikeExercise(e, isLiked, setIsLiked, exercise);
            }}
            liked={isLiked}
          />
        </PlaylistItemBox>
        <PlaylistItemBox>
          <p className="paragraph-md text-muted-foreground">{exercise.defaultConfig.bpm}</p>
        </PlaylistItemBox>
        <SizeAdapter
          md={
            <PlaylistItemBox>
              <p className="paragraph-md">
                |||<span className="text-muted-foreground">|||</span>
              </p>
            </PlaylistItemBox>
          }
        />
        <PlaylistItemBox>
          <ExerciseContextMenuButton exercise={exercise} playlistContext={props.playlist} />
        </PlaylistItemBox>
        <PlaylistItemBox className="!min-w-8">
          <Checkbox onCheckedChange={props.onSelectChange} checked={props.selected} />
        </PlaylistItemBox>
      </div>
    </a>
  );
}

interface SearchPLaylistItemProps {
  index: number;
  exercise: ExerciseCardDto;
}

export function SearchPlaylistItem({ ...props }: SearchPLaylistItemProps) {
  const { instance } = useLanguage();
  const { exercise } = props;
  const [isLiked, setIsLiked] = useState(exercise.likedByCurrentUser);
  if (!exercise) return null;

  return (
    <a
      className="flex justify-between items-center py-1 pl-1 my-1 relative cursor-pointer hover:bg-popover pr-4 "
      href="/game"
    >
      <div className="flex items-center h-15">
        <img
          className="w-15 h-15 object-cover"
          width={60}
          height={60}
          src={exercise.cover.url}
          alt={exercise.cover.alt}
        />
        <div className="flex flex-1 min-w-0 h-fit gap-3">
          <div className="flex flex-1 flex-col min-w-0 pl-2 gap-1">
            <p className="title-4 whitespace-nowrap overflow-hidden text-ellipsis ">
              {exercise.title}
            </p>
            <p className="paragraph-md text-muted-foreground">{exercise.author.username}</p>
          </div>

          <SizeAdapter
            md={
              <div className="flex gap-1 h-full">
                {exercise.chordsGrid && (
                  <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                    {instance.getItem("chords")}
                  </Badge>
                )}

                {exercise.midifileUrl && (
                  <Badge variant="outline" className="text-muted-foreground paragraph-xs h-min">
                    {instance.getItem("melody").toLowerCase()}
                  </Badge>
                )}
              </div>
            }
          />
        </div>
      </div>

      <div className="flex items-center">
        <SizeAdapter
          md={
            <PlaylistItemBox className="w-40 min-w-40 justify-start">
              <p className="paragraph-md text-muted-foreground whitespace-nowrap overflow-hidden text-ellipsis">
                {exercise.author.username}
              </p>
            </PlaylistItemBox>
          }
        />

        <PlaylistItemBox>
          <LikeButton
            onClick={(e) => {
              handleLikeExercise(e, isLiked, setIsLiked, exercise);
            }}
            liked={isLiked}
          />
        </PlaylistItemBox>

        <PlaylistItemBox>
          <p className="paragraph-md text-muted-foreground">{exercise.defaultConfig.bpm}</p>
        </PlaylistItemBox>

        <SizeAdapter
          md={
            <PlaylistItemBox>
              <p className="paragraph-md text-muted-foreground">{instance.getItem("pop")}</p>
            </PlaylistItemBox>
          }
        />
      </div>
    </a>
  );
}

export function SearchPlaylistItemsList({ exercises }: { exercises: ExerciseCardDto[] }) {
  const { instance } = useLanguage();
  return (
    <div className="w-full">
      <div className="w-full flex justify-between pr-4 py-2">
        <div></div>
        <div className="flex items-center">
          <SizeAdapter
            md={
              <PlaylistItemBox className="w-40 min-w-40 justify-start">
                <p className="paragraph-md text-muted-foreground">{instance.getItem("user")}</p>
              </PlaylistItemBox>
            }
            sm={
              <PlaylistItemBox>
                <div></div>
              </PlaylistItemBox>
            }
          />

          <PlaylistItemBox>
            <div></div>
          </PlaylistItemBox>

          <PlaylistItemBox>
            <p className="paragraph-md text-muted-foreground">{instance.getItem("bpm")}</p>
          </PlaylistItemBox>

          <SizeAdapter
            md={
              <PlaylistItemBox>
                <p className="paragraph-md text-muted-foreground">{instance.getItem("pop")}</p>
              </PlaylistItemBox>
            }
          />
        </div>
      </div>

      <Separator orientation="horizontal" />

      <div className="w-full flex flex-col justify-between py-0 mt-2">
        {exercises.map((exercise, index) => (
          <SearchPlaylistItem index={index} key={index} exercise={exercise} />
        ))}
      </div>
    </div>
  );
}

export function SearchExercisesList({
  title,
  seeAllUrl,
  exercises,
}: {
  title?: string;
  seeAllUrl?: string;
  exercises: ExerciseCardDto[];
}) {
  return (
    <div className="flex flex-col mx-auto mb-6 container">
      <WidgetTitle title={title} seeAllUrl={seeAllUrl} />
      <SearchPlaylistItemsList exercises={exercises} />
    </div>
  );
}
