---
description: Create a database backup and store it in the backups entry
---

1. Create a timestamp
// turbo
2. Run pg_dump within the postgres container and save to backups folder
```powershell
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
docker compose exec -T postgres pg_dump -U agency agency > backups/agency_backup_$timestamp.sql
```
3. Verify the file exists
```powershell
ls backups/agency_backup_$timestamp.sql
```
