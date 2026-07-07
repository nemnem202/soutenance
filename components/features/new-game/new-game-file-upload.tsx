import { FileUploadSection } from "@/components/organisms/file-upload-section";
import convertAudioFileToMidiFile from "@/converters/audio-to-midi";
import convertMidiFileToChordGrid from "@/converters/midi-to-chord-grid";
import { convertMidiFileToState, getMidiFileFromBuffer } from "@/converters/midi-to-state";
import { FileWithPreview } from "@/hooks/use-file-upload";
import useGame from "@/hooks/use-game";
import { logger } from "@/lib/logger";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { Action } from "@/midi-editor/types/actions";
import onMusicFile from "@/telefunc/music-file.telefunc";
import { ChordsGridSchema } from "@/types/entities";

export default function NewGameFileUpload() {
  const { updateExercise } = useGame();
  const { dispatch } = useMidiStore();
  const handleFilesChange = async (files: FileWithPreview[]) => {
    if (!files || files.length === 0) {
      logger.info("Aucun fichier sélectionné ou liste réinitialisée.");
      return;
    }

    const fileEntry = files[0];
    const file = fileEntry.file || fileEntry;
    if (!file) {
      logger.error("Structure de fichier invalide");
      return;
    }
    let actualFile: File =
      (fileEntry as any).file instanceof File ? (fileEntry as any).file : fileEntry;

    if (!(actualFile instanceof File)) {
      logger.error("L'objet n'est pas un fichier valide");
      return;
    }

    const MIDI_MIME_TYPES = ["audio/midi", "audio/mid", "audio/sp-midi", "audio/x-midi"];

    if (
      actualFile.type &&
      actualFile.type.startsWith("audio/") &&
      !MIDI_MIME_TYPES.includes(actualFile.type)
    ) {
      const midiFile = await convertAudioFileToMidiFile(actualFile);
      const midiBytes = midiFile.toArray();

      const arrayBuffer = midiBytes.buffer.slice(
        midiBytes.byteOffset,
        midiBytes.byteOffset + midiBytes.byteLength
      ) as ArrayBuffer;

      actualFile = new File([arrayBuffer], actualFile.name.replace(/\.[^/.]+$/, "") + ".mid", {
        type: "audio/midi",
        lastModified: Date.now(),
      });
    }

    let chordsGrid: ChordsGridSchema | undefined = undefined;

    if (actualFile.type === "audio/midi") {
      chordsGrid = (await convertMidiFileToChordGrid(actualFile)) ?? undefined;
    }

    if (
      [".xml", ".mxl", ".musicxml", ".mid", ".midi", ".abc", ".krn", ".mei", "audio/midi"].includes(
        actualFile.type
      )
    ) {
      const response = await onMusicFile(actualFile, chordsGrid);
      if (response.success) {
        const { exercise, midiFile } = response.data;
        updateExercise(exercise);
        const midi = await getMidiFileFromBuffer(midiFile);
        const newState = convertMidiFileToState(midi, exercise);
        useMidiStore.setState({ state: newState });
        dispatch({ type: Action.RESET_STATE });
      }
    } else {
      logger.error("File format not supported: ", actualFile.type);
    }
  };
  return (
    <FileUploadSection
      multiple={false}
      accept="audio/*, .mid, .midi, audio/midi, application/x-midi .xml, .mxl, .musicxml, .abc, .krn, .mei"
      title="Upload a midi, music or audio file"
      onFilesChange={handleFilesChange}
    />
  );
}
