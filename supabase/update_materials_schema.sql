-- Add new columns to materials table for richer content

alter table materials 
add column if not exists reading text, -- Cara membaca (Transliteration), e.g. "Tuffāḥah"
add column if not exists example_sentence text, -- Contoh kalimat Arab
add column if not exists example_meaning text; -- Arti kalimat

-- Update comment for clarity
comment on column materials.reading is 'Cara membaca / Transliterasi';
comment on column materials.example_sentence is 'Contoh penggunaan dalam kalimat';
comment on column materials.example_meaning is 'Arti dari contoh kalimat';
