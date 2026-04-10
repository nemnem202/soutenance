/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "SectionType" AS ENUM ('Generic', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'Intro', 'Verse', 'Bridge', 'Solo', 'Refrain', 'Melody', 'Outro', 'Tacet');

-- CreateEnum
CREATE TYPE "CellKind" AS ENUM ('Chord', 'Spacer', 'Empty');

-- CreateTable
CREATE TABLE "Exercise" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "composer" TEXT NOT NULL,
    "playlistId" INTEGER NOT NULL,

    CONSTRAINT "Exercise_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Midifile" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "Midifile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Config" (
    "id" SERIAL NOT NULL,
    "bpm" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "groove" TEXT NOT NULL,
    "timeSignatureId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "Config_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSignature" (
    "id" SERIAL NOT NULL,
    "top" INTEGER NOT NULL,
    "bottom" INTEGER NOT NULL,

    CONSTRAINT "TimeSignature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChordsGrid" (
    "id" SERIAL NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "ChordsGrid_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Section" (
    "id" SERIAL NOT NULL,
    "index" INTEGER NOT NULL,
    "type" "SectionType" NOT NULL,
    "label" TEXT NOT NULL,
    "chordsGridId" INTEGER NOT NULL,

    CONSTRAINT "Section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Measure" (
    "id" SERIAL NOT NULL,
    "index" INTEGER NOT NULL,
    "sectionId" INTEGER,
    "voltaId" INTEGER,

    CONSTRAINT "Measure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoltaBracket" (
    "id" SERIAL NOT NULL,
    "volta" INTEGER NOT NULL,
    "sectionId" INTEGER NOT NULL,

    CONSTRAINT "VoltaBracket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cell" (
    "id" SERIAL NOT NULL,
    "kind" "CellKind" NOT NULL,
    "keychange" TEXT,
    "measureId" INTEGER NOT NULL,
    "chordId" INTEGER,
    "tsChangeId" INTEGER,

    CONSTRAINT "Cell_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chord" (
    "id" SERIAL NOT NULL,
    "note" TEXT NOT NULL,
    "modifiers" TEXT NOT NULL,
    "overId" INTEGER,
    "altId" INTEGER,

    CONSTRAINT "Chord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "imageId" INTEGER NOT NULL,
    "exerciseId" INTEGER NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Midifile_exerciseId_key" ON "Midifile"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "Config_timeSignatureId_key" ON "Config"("timeSignatureId");

-- CreateIndex
CREATE UNIQUE INDEX "Config_exerciseId_key" ON "Config"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "ChordsGrid_exerciseId_key" ON "ChordsGrid"("exerciseId");

-- CreateIndex
CREATE UNIQUE INDEX "Cell_tsChangeId_key" ON "Cell"("tsChangeId");

-- CreateIndex
CREATE UNIQUE INDEX "Chord_overId_key" ON "Chord"("overId");

-- CreateIndex
CREATE UNIQUE INDEX "Chord_altId_key" ON "Chord"("altId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AddForeignKey
ALTER TABLE "Exercise" ADD CONSTRAINT "Exercise_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Midifile" ADD CONSTRAINT "Midifile_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_timeSignatureId_fkey" FOREIGN KEY ("timeSignatureId") REFERENCES "TimeSignature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Config" ADD CONSTRAINT "Config_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChordsGrid" ADD CONSTRAINT "ChordsGrid_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Section" ADD CONSTRAINT "Section_chordsGridId_fkey" FOREIGN KEY ("chordsGridId") REFERENCES "ChordsGrid"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measure" ADD CONSTRAINT "Measure_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Measure" ADD CONSTRAINT "Measure_voltaId_fkey" FOREIGN KEY ("voltaId") REFERENCES "VoltaBracket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoltaBracket" ADD CONSTRAINT "VoltaBracket_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "Section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_measureId_fkey" FOREIGN KEY ("measureId") REFERENCES "Measure"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_chordId_fkey" FOREIGN KEY ("chordId") REFERENCES "Chord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cell" ADD CONSTRAINT "Cell_tsChangeId_fkey" FOREIGN KEY ("tsChangeId") REFERENCES "TimeSignature"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chord" ADD CONSTRAINT "Chord_overId_fkey" FOREIGN KEY ("overId") REFERENCES "Chord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chord" ADD CONSTRAINT "Chord_altId_fkey" FOREIGN KEY ("altId") REFERENCES "Chord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_imageId_fkey" FOREIGN KEY ("imageId") REFERENCES "Image"("id") ON DELETE CASCADE ON UPDATE CASCADE;
