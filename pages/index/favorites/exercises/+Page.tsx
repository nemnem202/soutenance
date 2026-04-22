import FavoritesSearchbarSpace from "@/components/features/layout/favorites-searchbar-space";
import { useLanguage } from "@/hooks/use-language";
import type { Data } from "../+data";
import { useData } from "vike-react/useData";
import { SearchExercisesList } from "@/components/features/playlist/playlist-items";
import type { ExerciseCardDto } from "@/types/dtos/exercise";
import { useState } from "react";

export default function Page() {
  const { instance } = useLanguage();
  const { exercises } = useData<Data>();
  return (
    <div className="w-full flex flex-col">
      {exercises.success && exercises.data.length > 0 ? (
        <Content exercises={exercises.data} />
      ) : (
        <p className="paragraph-md text-muted-foreground">{instance.getItem("nothing_yet")}</p>
      )}
    </div>
  );
}

function Content({ exercises }: { exercises: ExerciseCardDto[] }) {
  const { instance } = useLanguage();
  const [displayedExercises, setDisplayedExercises] = useState(exercises);
  return (
    <>
      <FavoritesSearchbarSpace
        label={instance.getItem("exercises")}
        numberOfItems={exercises.length}
        placeholder={instance.getItem("search")}
        items={exercises}
        onUpdate={setDisplayedExercises}
        type="exercises"
      />
      <SearchExercisesList key="exercises" exercises={displayedExercises} />
    </>
  );
}
