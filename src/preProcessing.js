import { Midi } from "@tonejs/midi";
import fs from "fs";

export function processMidi(filePath) {
  const midiData = fs.readFileSync(filePath);
  const parsedMidi = new Midi(midiData);

  let sourceCode = "";
  let sourceMap = [];
  let allNotes = [];

  // 1. Flatten all tracks, dropping the comment channel instantly
  parsedMidi.tracks.forEach((track) => {
    if (track.channel === 6) return; // Channel 6 is our silent comment track

    track.notes.forEach((note) => {
      allNotes.push({
        channel: track.channel,
        pitch: note.midi,
        velocity: Math.floor(note.velocity * 127),
        time: note.time,
        duration: note.duration,
      });
    });
  });

  // 2. Sort chronologically
  allNotes.sort((a, b) => a.time - b.time);

  // 3. Translate to Text & Build Source Map
  let lastNoteEndTime = 0;

  allNotes.forEach((note) => {
    // A. Handle explicit whitespace based on time gaps
    const gap = note.time - lastNoteEndTime;

    if (lastNoteEndTime > 0) {
      let spaceChar = "";
      if (gap >= 1.0 && gap < 2.5) spaceChar = "\t";
      else if (gap >= 2.5) spaceChar = "\n";
      else if (gap >= 0.2) spaceChar = " ";

      if (spaceChar) {
        // We log implicitly generated whitespace in the source map too!
        sourceMap.push({
          index: sourceCode.length,
          char: spaceChar,
          time: note.time.toFixed(2),
          channel: "Implicit",
          pitch: "N/A",
        });
        sourceCode += spaceChar;
      }
    }

    let charToAppend = "";

    // B. Channel Routing
    switch (note.channel) {
      case 1: // Keywords & Library Functions
        charToAppend = getKeyword(note.pitch);
        break;
      case 2: // Alphabet
        const ALPHABET = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        charToAppend = ALPHABET[note.pitch % ALPHABET.length];
        break;
      case 3: // Numbers & Math Logic
        const MATH_CHARS = "0123456789.+-*/%^=";
        charToAppend = MATH_CHARS[note.pitch % MATH_CHARS.length];
        break;
      case 4: // Special Characters & Punctuation
        const SPECIALS = "{}()[],;:<>";
        charToAppend = SPECIALS[note.pitch % SPECIALS.length];
        break;
      case 5: // Explicit Whitespace
        if (note.pitch % 3 === 0) charToAppend = " ";
        if (note.pitch % 3 === 1) charToAppend = "\t";
        if (note.pitch % 3 === 2) charToAppend = "\n";
        break;
      default:
        // Channels 7-16: Unicode calculation
        if (note.channel >= 7 && note.channel <= 16) {
          const codepoint =
            (note.channel - 7) * 16384 + note.pitch * 128 + note.velocity;
          charToAppend = String.fromCodePoint(codepoint);
        }
        break;
    }

    // C. Append to string and push to Source Map
    if (charToAppend) {
      sourceMap.push({
        index: sourceCode.length, // Capture the exact string position
        char: charToAppend,
        time: note.time.toFixed(2),
        channel: note.channel,
        pitch: note.pitch,
      });
      sourceCode += charToAppend;
    }

    lastNoteEndTime = note.time + note.duration;
  });

  return { sourceCode, sourceMap };
}

function getKeyword(pitch) {
  // 1. Core Variable & Struct Logic
  // 2. I/O & Loops
  // 3. Operators & Functions
  // 4. Control Flow
  // 5. Types & Booleans
  // 6. Math Library
  const KEYWORDS = [
    // Variables & Structs
    "note",
    "key",
    "chord",

    // I/O & Loops
    "play",
    "measure",
    "from",
    "to",
    "vamp",
    "encore",
    "cut",

    // Functions & Scope
    "compose",
    "fin",
    "cadence",

    // Control Flow
    "cue",
    "alt",
    "drop",

    // Booleans & Types
    "gate",
    "open",
    "closed",
    "ghost",
    "level",
    "lyric",
    "silence",
    "noise",

    // Standard Library Functions
    "sqrt",
    "hypot",

    // Postfix Operators
    "sharp",
    "flat",
  ];

  // Map the 128 possible MIDI pitches to our array using modulo
  const word = KEYWORDS[pitch % KEYWORDS.length];

  // Return the word with a trailing space to guarantee it stays
  // separated from identifiers, even if the user plays the notes too fast.
  return word;
}
