import { readFileSync, readdirSync, existsSync } from 'fs';
import { join } from 'path';

/**
 * Custom configuration loader for Docker Secrets.
 * Reads files from /run/secrets and returns an object of key-value pairs.
 */
export default () => {
  const secretsDir = '/run/secrets';
  const secrets: Record<string, string> = {};

  if (existsSync(secretsDir)) {
    try {
      const files = readdirSync(secretsDir);
      for (const file of files) {
        const filePath = join(secretsDir, file);
        // Skip directories and common system files
        if (file.startsWith('..')) continue;
        
        try {
          const content = readFileSync(filePath, 'utf8').trim();
          secrets[file] = content;
        } catch (err) {
          // Log or handle error reading specific secret
          console.error(`Error reading secret ${file}:`, err);
        }
      }
    } catch (err) {
      console.error('Error reading secrets directory:', err);
    }
  }

  return secrets;
};
