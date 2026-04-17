-- CreateTable
CREATE TABLE "_PlaylistCollections" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlaylistCollections_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlaylistCollections_B_index" ON "_PlaylistCollections"("B");

-- AddForeignKey
ALTER TABLE "_PlaylistCollections" ADD CONSTRAINT "_PlaylistCollections_A_fkey" FOREIGN KEY ("A") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlaylistCollections" ADD CONSTRAINT "_PlaylistCollections_B_fkey" FOREIGN KEY ("B") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
