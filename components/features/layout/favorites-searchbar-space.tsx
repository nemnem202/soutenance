import FilterSearchbar, {
  type FilterSearchbarExercises,
  type FilterSearchbarPlaylists,
  type FilterSearchbarUsers,
} from "@/components/organisms/filter-searchbar";

export default function FavoritesSearchbarSpace({
  label,
  numberOfItems,
  ...props
}: {
  label: string;
  numberOfItems: number;
} & (FilterSearchbarExercises | FilterSearchbarPlaylists | FilterSearchbarUsers)) {
  return (
    <div className="md:w-full w-[70vw] min-w-70 flex flex-col-reverse md:flex-row md:justify-between md:items-center md:my-9 mb-5 md:mb-0">
      <p className="title-3 hidden md:block">
        {numberOfItems} {label}
      </p>
      <div className="w-full max-w-116 ">
        <FilterSearchbar {...props} />
      </div>
    </div>
  );
}
