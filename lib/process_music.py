import sys
import json
import base64
from music21 import converter
import io

def process_music():
    input_data = sys.stdin.buffer.read()
    score = converter.parse(input_data)

    chords = [{"figure": c.figure, "measure": c.measureNumber} 
              for c in score.flatten().getElementsByClass(['ChordSymbol'])]
    
    mf = score.midiFile
    midi_stream = io.BytesIO()
    mf.writeFile(midi_stream)
    midi_b64 = base64.b64encode(midi_stream.getvalue()).decode('utf-8')
    
    result = {"chords": chords, "midi": midi_b64}
    print(json.dumps(result))

if __name__ == "__main__":
    process_music(sys.argv[1])