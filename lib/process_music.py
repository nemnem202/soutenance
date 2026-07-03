import sys
import json
import base64
import os
from music21 import converter
from music21.midi.translate import streamToMidiFile

FORMAT_MAP = {
    ".xml": "musicxml",
    ".mxl": "musicxml",
    ".musicxml": "musicxml",
    ".mid": "midi",
    ".midi": "midi",
    ".abc": "abc",
    ".krn": "humdrum",
    ".mei": "mei",
}

def process_music(file_path):
    print("process_music.py sucessfully called", file=sys.stderr, flush=True)

    if not os.path.exists(file_path):
        sys.stderr.write(f"DEBUG: Le fichier {file_path} est introuvable !")
        sys.exit(1)

    ext = os.path.splitext(file_path)[1].lower()
    fmt = FORMAT_MAP.get(ext)

    if fmt is None:
        sys.stderr.write(f"Extension non supportée: {ext}")
        sys.exit(1)

    print(f"DEBUG: parsing {file_path} avec format={fmt}", file=sys.stderr, flush=True)

    try:
        score = converter.parse(file_path, format=fmt)
    except Exception as e:
        sys.stderr.write(f"Erreur de parsing music21 (format={fmt}): {e}")
        sys.exit(1)

    chords = [{"figure": c.figure, "measure": c.measureNumber}
              for c in score.flatten().getElementsByClass(['ChordSymbol'])]

    mf = streamToMidiFile(score)
    midi_bytes = mf.writestr()
    midi_b64 = base64.b64encode(midi_bytes).decode('utf-8')

    print(json.dumps({"chords": chords, "midi": midi_b64}))

if __name__ == "__main__":
    process_music(sys.argv[1])