export function SmallPlaylistWidget() {
  return (
    <div className="h-12 w-full hover:bg-popover rounded flex gap-2 cursor-pointer">
      <img src="assets/playlist1.png"></img>
      <div className="flex flex-col">
        <p className="title-4">2501 standarts</p>
        <p className="paragraph-sm text-muted-foreground">par Naïm</p>
      </div>
    </div>
  );
}
