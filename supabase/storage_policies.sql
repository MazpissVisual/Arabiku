-- 1. Create the 'images' bucket (if you haven't done it in the UI)
insert into storage.buckets (id, name, public)
values ('images', 'images', true)
on conflict (id) do nothing;

-- 2. Enable RLS (Should be on by default, but just in case)
alter table storage.objects enable row level security;

-- 3. Policy: Everyone can view images
create policy "Public images are viewable by everyone"
on storage.objects for select
using ( bucket_id = 'images' );

-- 4. Policy: Authenticated users (Admins) can upload/insert images
create policy "Admins can upload images"
on storage.objects for insert
with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

-- 5. Policy: Admins can update/replace images
create policy "Admins can update images"
on storage.objects for update
with check ( bucket_id = 'images' and auth.role() = 'authenticated' );

-- 6. Policy: Admins can delete images
create policy "Admins can delete images"
on storage.objects for delete
using ( bucket_id = 'images' and auth.role() = 'authenticated' );
