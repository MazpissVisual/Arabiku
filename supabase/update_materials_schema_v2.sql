-- Add reading for existing example and columns for a second example

alter table materials 
add column if not exists example_reading text, -- Cara baca contoh kalimat 1
add column if not exists example_sentence_2 text, -- Contoh kalimat Arab 2
add column if not exists example_reading_2 text, -- Cara baca contoh kalimat 2
add column if not exists example_meaning_2 text; -- Arti contoh kalimat 2
