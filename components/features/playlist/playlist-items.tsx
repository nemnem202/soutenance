import { MouseEvent, useState, type ReactNode } from "react";
import SizeAdapter from "@/components/molecules/size-adapter";
import { WidgetTitle } from "@/components/organisms/widget-carousel";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { LikeButton } from "@/components/ui/custom-buttons";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import type { ExerciseCardDto, SoloExerciseCardDto } from "@/types/dtos/exercise";
import type { PlaylistDetailDto } from "@/types/dtos/playlist";
import { onUserLikesExercise, onUserUnlikesExercise } from "@/telefunc/like.telefunc";
import { errorToast, successToast } from "@/lib/toaster";

export function PlaylistItemsList({ playlist }: { playlist: PlaylistDetailDto }) {
  const { instance } = useLanguage();
  return (
    <div className="w-full">
      <div className="w-full flex justify-between px-4 py-2">
        <p className="paragramh-md text-muted-foreground">{instance.getItem("exercise")}</p>
        <div className="flex items-center">
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
            <Checkbox />
          </PlaylistItemBox>
        </div>
      </div>
      <Separator orientation="horizontal" />
      <div className="w-full flex flex-col justify-between  py-0 mt-2">
        {playlist.exercises.map((exercise, index) => (
          <PlaylistItem index={index} key={index} playlist={playlist} exercise={exercise} />
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
}

export function PlaylistItem({ ...props }: PLaylistItemProps) {
  const { instance } = useLanguage();
  const { exercise } = props;
  const [isLiked, setIsLiked] = useState(exercise.likedByCurrentUser);
  if (!exercise) return null;
  const handleLikeExercise = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      const response = await onUserUnlikesExercise(exercise.id);
      if (!response.success) {
        errorToast(response.title, response.description);
      } else {
        successToast(`${exercise.title} was removed from your likes`);
        setIsLiked(false);
      }
    } else {
      const response = await onUserLikesExercise(exercise.id);
      if (!response.success) {
        errorToast(response.title, response.description);
      } else {
        successToast(`${exercise.title} was added to your likes`);
        setIsLiked(true);
      }
    }
  };
  return (
    <a
      className=" flex justify-between items-center py-1 pl-1 my-1 relative cursor-pointer hover:bg-popover pr-4"
      href="/game"
    >
      <div className="flex items-center h-15">
        <img
          className="w-15 h-15"
          width={60}
          height={60}
          src={props.playlist.cover.url}
          alt={props.playlist.cover.alt}
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
          <LikeButton onClick={handleLikeExercise} liked={isLiked} />
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
          <Checkbox />
        </PlaylistItemBox>
      </div>
    </a>
  );
}

interface SearchPLaylistItemProps {
  index: number;
  exercise: SoloExerciseCardDto;
}

export function SearchPlaylistItem({ ...props }: SearchPLaylistItemProps) {
  const { instance } = useLanguage();
  const { exercise } = props;
  const [isLiked, setIsLiked] = useState(exercise.likedByCurrentUser);
  if (!exercise) return null;
  const handleLikeExercise = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isLiked) {
      const response = await onUserUnlikesExercise(exercise.id);
      if (!response.success) {
        errorToast(response.title, response.description);
      } else {
        successToast(`${exercise.title} was removed from your likes`);
        setIsLiked(false);
      }
    } else {
      const response = await onUserLikesExercise(exercise.id);
      if (!response.success) {
        errorToast(response.title, response.description);
      } else {
        successToast(`${exercise.title} was added to your likes`);
        setIsLiked(true);
      }
    }
  };

  return (
    <a
      className="flex justify-between items-center py-1 pl-1 my-1 relative cursor-pointer hover:bg-popover pr-4"
      href="/game"
    >
      <div className="flex items-center h-15">
        <img
          className="w-15 h-15"
          width={60}
          height={60}
          src={exercise.cover.url}
          alt={exercise.cover.alt}
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
        <SizeAdapter
          md={
            <PlaylistItemBox className="w-40 min-w-40 justify-start">
              <p className="paragraph-md text-muted-foreground">{exercise.author.username}</p>
            </PlaylistItemBox>
          }
        />

        <PlaylistItemBox>
          <LikeButton onClick={handleLikeExercise} liked={isLiked} />
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

export function SearchPlaylistItemsList({ exercises }: { exercises: SoloExerciseCardDto[] }) {
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
  exercises: SoloExerciseCardDto[];
}) {
  return (
    <div className="flex flex-col mx-auto mb-6 container">
      <WidgetTitle title={title} seeAllUrl={seeAllUrl} />
      <SearchPlaylistItemsList exercises={exercises} />
    </div>
  );
}
