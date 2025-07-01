const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'https://api.github.com/repos/sonic-pi-net/sonic-pi/contents/';
const SAMPLES_PATH = 'etc/samples';
const BRANCH = 'dev';
const TARGET_DIR = path.join(__dirname, 'websonic/public/samples');

// Ensure target directory exists
fs.mkdirSync(TARGET_DIR, { recursive: true });

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (response) => {
      // Handle redirects
      if (response.statusCode > 300 && response.statusCode < 400 && response.headers.location) {
        https.get(response.headers.location, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
          res.pipe(file);
          file.on('finish', () => {
            file.close(resolve);
          });
        }).on('error', (err) => {
          fs.unlink(dest, () => reject(err));
        });
      } else {
        response.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      }
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function getContents(subPath) {
  const url = `${API_BASE_URL}${subPath}?ref=${BRANCH}`;
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Node.js' } }, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function downloadAllSamples(subPath = SAMPLES_PATH, currentDir = TARGET_DIR) {
  const contents = await getContents(subPath);

  if (!Array.isArray(contents)) {
      console.error('Could not fetch contents, maybe API rate limit exceeded.', contents);
      return;
  }

  for (const item of contents) {
    if (item.type === 'file' && (item.name.endsWith('.wav') || item.name.endsWith('.flac'))) {
      console.log(`Downloading ${item.name} to ${currentDir}`);
      const destPath = path.join(currentDir, item.name);
      await downloadFile(item.download_url, destPath);
    } else if (item.type === 'dir') {
      const newDirPath = path.join(currentDir, item.name);
      fs.mkdirSync(newDirPath, { recursive: true });
      await downloadAllSamples(item.path, newDirPath);
    }
  }
}

downloadAllSamples()
  .then(() => console.log('All samples downloaded.'))
  .catch((err) => console.error('Error downloading samples:', err));
