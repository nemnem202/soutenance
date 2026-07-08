import { FileUploadSection } from "@/components/organisms/file-upload-section";
import convertAudioFileToMidiFile from "@/converters/audio-to-midi";
import convertMidiFileToChordGrid from "@/converters/midi-to-chord-grid";
import { convertMidiFileToState, getMidiFileFromBuffer } from "@/converters/midi-to-state";
import { FileWithPreview } from "@/hooks/use-file-upload";
import useGame from "@/hooks/use-game";
import { getFileFromEntry, isMidi, processAudioToMidi } from "@/hooks/use-music-file-processor";
import { logger } from "@/lib/logger";
import { errorToast } from "@/lib/toaster";
import { useMidiStore } from "@/midi-editor/stores/use-midi-store";
import { Action } from "@/midi-editor/types/actions";
import onMusicFile from "@/telefunc/music-file.telefunc";
import { ChordsGridSchema } from "@/types/entities";
import { useState } from "react";
import { navigate } from "vike/client/router";

export default function NewGameFileUpload() {
  const { updateExercise } = useGame();
  const { dispatch } = useMidiStore();
  const [progess, setProgress] = useState(0);

  const handleFilesChange = async (files: FileWithPreview[]) => {
    setProgress(1);
    const rawFile = files[0] ? getFileFromEntry(files[0]) : null;
    if (!rawFile) return logger.error("Fichier invalide");

    try {
      let fileToProcess = rawFile;

      if (rawFile.type.startsWith("audio/") && !isMidi(rawFile)) {
        fileToProcess = await processAudioToMidi(rawFile, setProgress);
      }

      const chordsGrid = isMidi(fileToProcess)
        ? await convertMidiFileToChordGrid(fileToProcess)
        : undefined;

      const response = await onMusicFile(fileToProcess, chordsGrid ?? undefined);

      if (!response.success) throw new Error("Échec du traitement serveur");

      const { exercise, midiFile } = response.data;
      updateExercise(exercise);

      const midi = await getMidiFileFromBuffer(midiFile);
      useMidiStore.setState({ state: convertMidiFileToState(midi, exercise) });
      dispatch({ type: Action.RESET_STATE });

      logger.success("Fichier traité avec succès");
      setProgress(100);
      navigate("/new-game/editor");
    } catch (err) {
      errorToast("Erreur lors du traitement", String(err));
    }
  };

  return (
    <FileUploadSection
      multiple={false}
      accept="audio/*, .mid, .midi, audio/midi, application/x-midi .xml, .mxl, .musicxml, .abc, .krn, .mei"
      title="Upload a midi, music or audio file"
      onFilesChange={handleFilesChange}
      progress={progess}
    />
  );
}
