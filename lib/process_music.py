import sys
import json
import base64
from music21 import converter
import io
import os
import tempfile

def process_music(file_path):
    if not os.path.exists(file_path):
        sys.stderr.write(f"DEBUG: Le fichier {file_path} est introuvable !")
        sys.exit(1)

    score = converter.parse(file_path)

    chords = [{"figure": c.figure, "measure": c.measureNumber}
              for c in score.flatten().getElementsByClass(['ChordSymbol'])]

    # Écrit le MIDI dans un fichier temporaire puis le relit en bytes
    with tempfile.NamedTemporaryFile(suffix=".mid", delete=False) as tmp:
        tmp_path = tmp.name

    score.write('midi', fp=tmp_path)

    with open(tmp_path, 'rb') as f:
        midi_bytes = f.read()
    os.remove(tmp_path)

    midi_b64 = base64.b64encode(midi_bytes).decode('utf-8')

    print(json.dumps({"chords": chords, "midi": midi_b64}))

if __name__ == "__main__":
    process_music(sys.argv[1])