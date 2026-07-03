import sys
import json
import base64
import os
from music21 import converter, tempo, repeat, bar, harmony, expressions
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

def normalize_note(note_str):
    """Convertit le format de note music21 (ex: E-) au format Zod (ex: Eb)"""
    if not note_str:
        return "C"
    res = note_str.replace('-', 'b')
    allowed_notes = ["C", "C#", "Db", "D", "D#", "Eb", "E", "F", "F#", "Gb", "G", "G#", "Ab", "A", "A#", "Bb", "B", "%"]
    return res if res in allowed_notes else "C"

def parse_chord_symbol(c):
    """Extrait le pattern structurel attendu par chordSchema"""
    root = normalize_note(c.root().name)
    # Extrait le modificateur (ex: 'm7', 'maj7') en retirant la tonique du texte complet
    modifier = c.figure.replace(c.root().name, "").strip()
    
    over = None
    if c.bass() and c.bass() != c.root():
        over = {
            "note": normalize_note(c.bass().name),
            "modifier": ""
        }
        
    return {
        "content": {
            "note": root,
            "modifier": modifier if modifier else "max" # ou une valeur par défaut cohérente
        },
        "over": over,
        "alt": None
    }

def map_barline(barline):
    """Mappe les types de barres de mesure music21 vers ton enum Zod"""
    if not barline:
        return "single"
    if isinstance(barline, bar.Repeat):
        return "loopOpen" if barline.direction == 'start' else "loopClose"
    if barline.type == 'double': 
        return 'double'
    if barline.type == 'final': 
        return 'final'
    return 'single'

def process_music(file_path):
    print("process_music.py successfully called", file=sys.stderr, flush=True)

    if not os.path.exists(file_path):
        sys.stderr.write(f"DEBUG: Le fichier {file_path} est introuvable !")
        sys.exit(1)

    ext = os.path.splitext(file_path)[1].lower()
    fmt = FORMAT_MAP.get(ext)

    if fmt is None:
        sys.stderr.write(f"Extension non supportée: {ext}")
        sys.exit(1)

    try:
        score = converter.parse(file_path, format=fmt)
    except Exception as e:
        sys.stderr.write(f"Erreur de parsing music21 (format={fmt}): {e}")
        sys.exit(1)

    # 1. Extraction des métadonnées globales
    md = score.metadata
    title = md.title if md and md.title else "Untitled"
    composer = md.composer if md and md.composer else "Unknown"

    # 2. Configuration par défaut (BPM, Clef, Time Signature)
    tempo_marks = score.flatten().getElementsByClass(tempo.MetronomeMark)
    default_bpm = int(tempo_marks[0].getQuarterBPM()) if tempo_marks else 120
    
    try:
        analyzed_key = score.analyze('key')
        default_key = analyzed_key.tonic.name + ('m' if analyzed_key.mode == 'minor' else '')
    except:
        default_key = "C"

    ts_list = score.flatten().getTimeSignatures()
    default_ts_top = ts_list[0].numerator if ts_list else 4
    default_ts_bottom = ts_list[0].denominator if ts_list else 4

    # 3. Cartographie des Sections via les RehearsalMarks
    part = score.parts[0] if score.parts else score
    rehearsal_marks = part.flatten().getElementsByClass(expressions.RehearsalMark)
    sections_markers = {}
    for rm in rehearsal_marks:
        # On s'assure d'avoir une chaîne propre et on gère le numéro de mesure
        if rm.measureNumber is not None:
            sections_markers[rm.measureNumber] = str(rm.content).strip()

    # 4. Traitement des mesures et découpage hiérarchique
    measures_data = []
    current_ts_top = default_ts_top
    current_ts_bottom = default_ts_bottom

    raw_measures = list(part.getElementsByClass('Measure'))
    
    # Initialisation de la première section par défaut
    sections_list = []
    current_section = {
        "index": 0,
        "label": "Intro" if 1 in sections_markers else "Generic",
        "type": "Generic",
        "commonMeasures": [],
        "voltas": [],
        "repeatCount": None
    }

    section_idx = 0
    
    for m in raw_measures:
        # Si un changement de section (RehearsalMark) est détecté sur cette mesure
        if m.number in sections_markers and m.number != 1:
            sections_list.append(current_section)
            section_idx += 1
            label = sections_markers[m.number]
            # Tente de deviner le type de section selon le nom, sinon "Generic"
            sec_type = label if label in ["A", "B", "C", "D", "Intro", "Verse", "Bridge", "Solo", "Refrain", "Outro"] else "Generic"
            current_section = {
                "index": section_idx,
                "label": label,
                "type": sec_type,
                "commonMeasures": [],
                "voltas": [],
                "repeatCount": None
            }

        # Suivi local des changements de signature rythmique
        m_ts = m.timeSignature
        key_change = None
        ts_change_top = None
        ts_change_bottom = None
        
        if m_ts:
            current_ts_top = m_ts.numerator
            current_ts_bottom = m_ts.denominator
            ts_change_top = current_ts_top
            ts_change_bottom = current_ts_bottom

        # Analyse des symboles de structure répétés présents dans la mesure
        is_coda = len(m.flatten().getElementsByClass(repeat.Coda)) > 0
        is_segno = len(m.flatten().getElementsByClass(repeat.Segno)) > 0
        is_fine = len(m.flatten().getElementsByClass(repeat.Fine)) > 0
        is_fermata = len(m.flatten().getElementsByClass(expressions.Fermata)) > 0

        # Génération des cellules basées sur les temps (Beats) de la mesure
        cells = []
        chords_in_measure = m.flatten().getElementsByClass(harmony.ChordSymbol)
        
        for beat_idx in range(current_ts_top):
            # Filtre pour voir s'il y a un accord posé sur ce temps précis
            # beat_idx + 1 car les temps music21 commencent à 1.0
            chord_match = next((c for c in chords_in_measure if int(c.beat) == beat_idx + 1), None)
            
            cell_base = {
                "index": beat_idx,
                "keychange": key_change,
                "timeSignatureChangeTop": ts_change_top if beat_idx == 0 else None,
                "timeSignatureChangeBottom": ts_change_bottom if beat_idx == 0 else None,
                "isCodaSymbol": is_coda if beat_idx == 0 else False,
                "isSegnoSymbol": is_segno if beat_idx == 0 else False,
                "isFermataSymbol": is_fermata if beat_idx == 0 else False,
                "isFineSymbol": is_fine if beat_idx == 0 else False,
                "isBreakSymbol": False,
                "navigation": None,
                "rhythmGrouping": None
            }
            
            if chord_match:
                cell_base["kind"] = "Chord"
                cell_base["chord"] = parse_chord_symbol(chord_match)
            else:
                cell_base["kind"] = "Spacer" if beat_idx > 0 else "Empty"
                
            cells.append(cell_base)

        # Construction de la mesure finale
        measure_obj = {
            "index": m.number,
            "cells": cells,
            "bars": {
                "left": map_barline(m.leftBarline),
                "right": map_barline(m.rightBarline)
            }
        }
        current_section["commonMeasures"].append(measure_obj)

    # Ajout de la dernière section en cours
    sections_list.append(current_section)

    # 5. Export MIDI standardisé
    mf = streamToMidiFile(score)
    midi_bytes = mf.writestr()
    midi_b64 = base64.b64encode(midi_bytes).decode('utf-8')

    # 6. Structuration finale calquée sur exerciseSchema
    exercise_payload = {
        "title": title,
        "composer": composer,
        "defaultConfig": {
            "bpm": default_bpm,
            "key": default_key,
            "groove": "Generic",  # Remplacer par ta valeur par défaut issue de MMAGrooveTitle
            "timeSignatureTop": default_ts_top,
            "timeSignatureBottom": default_ts_bottom
        },
        "chordsGrid": {
            "sections": sections_list
        },
        "midifileUrl": None  # Géré côté Node suite à l'upload du fichier brut
    }

    print(json.dumps({
        "exercise": exercise_payload,
        "midi": midi_b64
    }))

if __name__ == "__main__":
    if len(sys.argv) > 1:
        process_music(sys.argv[1])