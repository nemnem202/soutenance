import sys
import json
import base64
import os
from music21 import converter, tempo, repeat, bar
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

def extract_metadata(score):
    md = score.metadata
    title = md.title if md else None
    composer = md.composer if md else None
    return {"title": title, "composer": composer}

def extract_bpm(score):
    tempo_marks = score.flatten().getElementsByClass(tempo.MetronomeMark)  # tempo = module
    result = []
    for t in tempo_marks:
        result.append({
            "measure": t.measureNumber,
            "bpm": t.getQuarterBPM(),
            "text": t.text,
        })
    return result

 
def extract_measures(score):
    measures = []
    # On prend la première Part comme référence pour les numéros de mesure
    part = score.parts[0] if score.parts else score
    for m in part.getElementsByClass('Measure'):
        measures.append({
            "number": m.number,
            "offset": m.offset,          # position temporelle (en noires) depuis le début
            "duration": m.duration.quarterLength,
        })
    return measures

def extract_repeats(score):
    repeats = []

    # Barres de reprise (début/fin de répétition) : music21.bar.Repeat
    for r in score.flatten().getElementsByClass(bar.Repeat):
        repeats.append({
            "type": "barline_repeat",
            "measure": r.measureNumber,
            "direction": r.direction,  # 'start' ou 'end'
            "times": r.times,           # nombre de répétitions si spécifié
        })

    # Marques de reprise textuelles : Segno, Coda, DaCapo, DalSegno, etc.
    for r in score.flatten().getElementsByClass(repeat.RepeatMark):
        repeats.append({
            "type": type(r).__name__,   # ex: "Segno", "Coda", "DaCapoAlFine"
            "measure": r.measureNumber,
        })

    return repeats

def extract_chords(score):
    chords = [{"figure": c.figure, "measure": c.measureNumber}
              for c in score.flatten().getElementsByClass(['ChordSymbol'])]
    return chords

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

    chords = extract_chords(score)
    metadata = extract_metadata(score)
    bpm_data = extract_bpm(score)
    measures = extract_measures(score)
    repeats = extract_repeats(score)

    mf = streamToMidiFile(score)
    midi_bytes = mf.writestr()
    midi_b64 = base64.b64encode(midi_bytes).decode('utf-8')

    print(json.dumps({
        "content": {
            "chords": chords,
            "metadata": metadata,
            "bpm": bpm_data,
            "measures": measures,
            "repeats": repeats,
        },
        "midi": midi_b64,
    }))

if __name__ == "__main__":
    process_music(sys.argv[1])