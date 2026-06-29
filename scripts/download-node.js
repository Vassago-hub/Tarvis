#!/usr/bin/env node

/**
 * Cross-platform Node.js portable download script
 * Downloads Node.js v22.14.0 LTS to .node/ directory
 */

const https = require('https');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { execSync, spawn } = require('child_process');

const NODE_VERSION = 'v22.14.0';
const NODE_DIST_URL = 'https://nodejs.org/dist/';
const TARGET_DIR = path.join(process.cwd(), '.node');

/**
 * Get platform-specific download info
 */
function getPlatformInfo() {
  const platform = os.platform();
  const arch = os.arch();

  let fileName;
  let extractDir;

  switch (platform) {
    case 'win32':
      fileName = `node-${NODE_VERSION}-win-x64.zip`;
      extractDir = `node-${NODE_VERSION}-win-x64`;
      break;
    case 'darwin':
      // Use x64 for Intel Macs, arm64 for Apple Silicon
      const darwinArch = arch === 'arm64' ? 'arm64' : 'x64';
      fileName = `node-${NODE_VERSION}-darwin-${darwinArch}.tar.gz`;
      extractDir = `node-${NODE_VERSION}-darwin-${darwinArch}`;
      break;
    case 'linux':
      fileName = `node-${NODE_VERSION}-linux-x64.tar.gz`;
      extractDir = `node-${NODE_VERSION}-linux-x64`;
      break;
    default:
      throw new Error(`Unsupported platform: ${platform}`);
  }

  return {
    platform,
    arch: platform === 'darwin' ? (arch === 'arm64' ? 'arm64' : 'x64') : 'x64',
    fileName,
    extractDir,
    downloadUrl: `${NODE_DIST_URL}${NODE_VERSION}/${fileName}`,
    archivePath: path.join(process.cwd(), fileName),
  };
}

/**
 * Download file with progress display
 */
function downloadFile(url, destPath) {
  return new Promise((resolve, reject) => {
    console.log(`\n📥 Downloading from: ${url}`);
    console.log(`📁 Saving to: ${destPath}\n`);

    const file = fs.createWriteStream(destPath);
    let downloadedBytes = 0;
    let totalBytes = 0;
    let lastProgress = 0;

    const request = (url) => {
      https.get(url, (response) => {
        // Handle redirects
        if (response.statusCode === 301 || response.statusCode === 302) {
          const redirectUrl = response.headers.location;
          console.log(`↪️  Redirecting to: ${redirectUrl}`);
          request(redirectUrl);
          return;
        }

        if (response.statusCode !== 200) {
          reject(new Error(`Download failed with status: ${response.statusCode}`));
          return;
        }

        totalBytes = parseInt(response.headers['content-length'], 10);
        const totalMB = (totalBytes / 1024 / 1024).toFixed(2);

        response.on('data', (chunk) => {
          downloadedBytes += chunk.length;
          const percent = Math.floor((downloadedBytes / totalBytes) * 100);

          // Update progress every 5%
          if (percent - lastProgress >= 5 || percent === 100) {
            const downloadedMB = (downloadedBytes / 1024 / 1024).toFixed(2);
            process.stdout.write(`\r⏳ Progress: ${percent}% (${downloadedMB}/${totalMB} MB)`);
            lastProgress = percent;
          }
        });

        response.pipe(file);

        file.on('finish', () => {
          file.close();
          console.log('\n✅ Download completed!\n');
          resolve();
        });
      }).on('error', (err) => {
        fs.unlink(destPath, () => {});
        reject(err);
      });
    };

    request(url);
  });
}

/**
 * Extract archive based on platform
 */
function extractArchive(archivePath, extractDir, platform) {
  console.log(`📦 Extracting: ${archivePath}`);

  const cwd = process.cwd();

  if (platform === 'win32') {
    // Use PowerShell to extract zip on Windows
    console.log('🔧 Using PowerShell to extract zip...');
    try {
      execSync(`powershell -Command "Expand-Archive -Path '${archivePath}' -DestinationPath '${cwd}' -Force"`, {
        stdio: 'inherit',
      });
    } catch (error) {
      throw new Error(`Failed to extract archive: ${error.message}`);
    }
  } else {
    // Use tar command on macOS and Linux
    console.log('🔧 Using tar to extract archive...');
    try {
      execSync(`tar -xzf "${archivePath}"`, {
        stdio: 'inherit',
        cwd,
      });
    } catch (error) {
      throw new Error(`Failed to extract archive: ${error.message}`);
    }
  }

  console.log('✅ Extraction completed!\n');
}

/**
 * Move extracted directory to target location
 */
function moveToTarget(extractDir, targetDir) {
  const extractedPath = path.join(process.cwd(), extractDir);

  // Remove existing target directory if it exists
  if (fs.existsSync(targetDir)) {
    console.log(`🗑️  Removing existing directory: ${targetDir}`);
    fs.rmSync(targetDir, { recursive: true, force: true });
  }

  // Rename extracted directory to target directory
  console.log(`📁 Moving ${extractDir} to ${path.basename(targetDir)}/`);
  fs.renameSync(extractedPath, targetDir);
  console.log('✅ Directory structure ready!\n');
}

/**
 * Clean up downloaded archive
 */
function cleanup(archivePath) {
  if (fs.existsSync(archivePath)) {
    console.log(`🧹 Cleaning up: ${path.basename(archivePath)}`);
    fs.unlinkSync(archivePath);
  }
}

/**
 * Verify Node.js installation
 */
function verifyInstallation(targetDir) {
  const nodeExe = os.platform() === 'win32' ? 'node.exe' : 'node';
  const nodePath = path.join(targetDir, 'bin', nodeExe);

  // On Windows, node.exe is in the root directory
  const windowsNodePath = path.join(targetDir, nodeExe);
  const actualNodePath = os.platform() === 'win32' ? windowsNodePath : nodePath;

  if (!fs.existsSync(actualNodePath)) {
    throw new Error(`Node.js executable not found at: ${actualNodePath}`);
  }

  console.log('🔍 Verifying installation...');
  const version = execSync(`"${actualNodePath}" --version`, { encoding: 'utf-8' }).trim();
  console.log(`✅ Node.js ${version} installed successfully!\n`);

  console.log('📍 Installation details:');
  console.log(`   Directory: ${targetDir}`);
  console.log(`   Executable: ${actualNodePath}`);
  console.log(`   Version: ${version}\n`);
}

/**
 * Main function
 */
async function main() {
  console.log('╔══════════════════════════════════════════════╗');
  console.log('║     Node.js Portable Download Script        ║');
  console.log('╚══════════════════════════════════════════════╝\n');

  try {
    // Get platform information
    const platformInfo = getPlatformInfo();

    console.log('🖥️  System Information:');
    console.log(`   Platform: ${platformInfo.platform}`);
    console.log(`   Architecture: ${platformInfo.arch}`);
    console.log(`   Target Version: ${NODE_VERSION}\n`);

    console.log('📦 Download Package:');
    console.log(`   File: ${platformInfo.fileName}`);
    console.log(`   URL: ${platformInfo.downloadUrl}\n`);

    // Download archive
    await downloadFile(platformInfo.downloadUrl, platformInfo.archivePath);

    // Extract archive
    extractArchive(platformInfo.archivePath, platformInfo.extractDir, platformInfo.platform);

    // Move to target directory
    moveToTarget(platformInfo.extractDir, TARGET_DIR);

    // Verify installation
    verifyInstallation(TARGET_DIR);

    // Clean up
    cleanup(platformInfo.archivePath);

    console.log('🎉 All done! Node.js is ready to use.\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('\nStack trace:', error.stack);
    process.exit(1);
  }
}

// Run the script
main();