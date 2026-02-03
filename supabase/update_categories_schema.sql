-- Add description to categories table
alter table categories 
add column if not exists description text;

comment on column categories.description is 'Deskripsi singkat tentang kategori/bab pelajaran';
