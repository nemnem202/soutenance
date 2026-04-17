import FavoritesSearchbarSpace from "@/components/features/layout/favorites-searchbar-space";
import { useLanguage } from "@/hooks/use-language";
import type { Data } from "../+data";
import { useData } from "vike-react/useData";
import { SearchExercisesList } from "@/components/features/playlist/playlist-items";

export default function Page() {
  const { instance } = useLanguage();
  const { exercises } = useData<Data>();
  return (
    <div className="w-full flex flex-col">
      {exercises.success && exercises.data.length > 0 && (
        <>
          <FavoritesSearchbarSpace
            label={instance.getItem("exercises")}
            numberOfItems={exercises.data.length}
          />
          <SearchExercisesList key="exercises" exercises={exercises.data} />
        </>
      )}
    </div>
  );
}
