# SUPABASE_POLICIES.md

## Policy d'upload vidéo sécurisée (bucket `videos`)

```sql
CREATE POLICY "Allow creators to upload in their own folder"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'videos'
  AND auth.role() = 'authenticated'
  AND (auth.jwt() -> 'user_metadata' ->> 'role') = 'createur'
  AND auth.uid()::text = ANY(storage.foldername(name))
);
```

- Cette policy permet uniquement aux utilisateurs ayant le rôle `createur` d'uploader dans leur propre dossier (`/videos/<user_id>/...`).
- À placer dans Supabase Studio > Storage > videos > Policies.
- Pour la lecture ou la suppression, adapter la policy selon les besoins.
