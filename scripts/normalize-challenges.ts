const sharp = require('sharp');
const { parse } = require('csv-parse');
const fs = require('fs/promises');
const path = require('path');

// Types for VIA annotations
interface ViaFileAttributes {
  type?: string;
  question?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface ViaRegionShape {
  name: 'polygon' | 'rect' | 'ellipse';
  all_points_x?: number[];
  all_points_y?: number[];
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  cx?: number;
  cy?: number;
  rx?: number;
  ry?: number;
}

interface ViaRegionAttributes {
  isCorrect: string; // From VIA tool this comes as "true"/"false" string
  label: string;
}

interface ViaAnnotation {
  filename: string;
  file_attributes: string; // JSON string
  region_shape_attributes: string; // JSON string
  region_attributes: string; // JSON string
}

// Types for our challenge format
interface ChallengeRegion {
  shape: ViaRegionShape;
  isCorrect: boolean;
  label: string;
}

interface Challenge {
  id: string;
  type: string;
  question: string;
  imageUrl: string;
  difficulty: 'easy' | 'medium' | 'hard';
  regions: ChallengeRegion[];
}

interface Challenges {
  version: string;
  challenges: Challenge[];
}

const TARGET_WIDTH = 800;
const TARGET_HEIGHT = 600;

async function normalizeImage(
  inputPath: string,
  outputPath: string
): Promise<{ scaleX: number; scaleY: number }> {
  const image = sharp(inputPath);
  const metadata = await image.metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Could not get dimensions for ${inputPath}`);
  }

  // Calculate scaling factors
  const scaleX = TARGET_WIDTH / metadata.width;
  const scaleY = TARGET_HEIGHT / metadata.height;

  // Resize and convert to WebP
  await image
    .resize(TARGET_WIDTH, TARGET_HEIGHT, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .webp({ quality: 80 })
    .toFile(outputPath);

  return { scaleX, scaleY };
}

function scaleCoordinates(
  shape: ViaRegionShape,
  scaleX: number,
  scaleY: number
): ViaRegionShape {
  const scaled = { ...shape };

  if (shape.name === 'polygon' && shape.all_points_x && shape.all_points_y) {
    scaled.all_points_x = shape.all_points_x.map(x => Math.round(x * scaleX));
    scaled.all_points_y = shape.all_points_y.map(y => Math.round(y * scaleY));
  } else if (shape.name === 'rect') {
    scaled.x = Math.round((shape.x || 0) * scaleX);
    scaled.y = Math.round((shape.y || 0) * scaleY);
    scaled.width = Math.round((shape.width || 0) * scaleX);
    scaled.height = Math.round((shape.height || 0) * scaleY);
  } else if (shape.name === 'ellipse') {
    scaled.cx = Math.round((shape.cx || 0) * scaleX);
    scaled.cy = Math.round((shape.cy || 0) * scaleY);
    scaled.rx = Math.round((shape.rx || 0) * scaleX);
    scaled.ry = Math.round((shape.ry || 0) * scaleY);
  }

  return scaled;
}

async function processAnnotations(
  csvPath: string,
  inputDir: string,
  outputDir: string
): Promise<void> {
  // Ensure output directory exists
  await fs.mkdir(outputDir, { recursive: true });

  // Read and parse CSV
  const csvContent = await fs.readFile(csvPath, 'utf-8');
  const records: ViaAnnotation[] = await new Promise((resolve, reject) => {
    parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    }, (err: Error | null, records: ViaAnnotation[]) => {
      if (err) reject(err);
      else resolve(records);
    });
  });

  const challenges: Challenge[] = [];
  const processedFiles = new Set<string>();

  // Process each annotation
  for (const record of records) {
    if (processedFiles.has(record.filename)) continue;
    processedFiles.add(record.filename);

    // Get all regions for this file
    const fileRegions = records.filter(r => r.filename === record.filename);
    
    // Process image
    const inputPath = path.join(inputDir, record.filename);
    const outputFilename = path.basename(record.filename, path.extname(record.filename)) + '.webp';
    const outputPath = path.join(outputDir, outputFilename);
    
    console.log(`Processing ${record.filename}...`);
    const { scaleX, scaleY } = await normalizeImage(inputPath, outputPath);

    // Process regions
    const regions: ChallengeRegion[] = fileRegions.map(region => {
      const shapeAttrs = JSON.parse(region.region_shape_attributes) as ViaRegionShape;
      const regionAttrs = JSON.parse(region.region_attributes) as ViaRegionAttributes;

      return {
        shape: scaleCoordinates(shapeAttrs, scaleX, scaleY),
        isCorrect: regionAttrs.isCorrect === "true",
        label: regionAttrs.label,
      };
    });

    // Create challenge
    const fileAttrs = JSON.parse(record.file_attributes) as ViaFileAttributes;
    challenges.push({
      id: path.basename(record.filename, path.extname(record.filename)),
      type: fileAttrs.type || 'unknown',
      question: fileAttrs.question || 'Identify the issue in this image',
      imageUrl: `/challenges/normalized/${outputFilename}`,
      difficulty: fileAttrs.difficulty || 'medium',
      regions,
    });
  }

  // Write challenges.json
  const challengesData: Challenges = {
    version: '1.0.0',
    challenges,
  };

  await fs.writeFile(
    path.join(outputDir, 'challenges.json'),
    JSON.stringify(challengesData, null, 2),
    'utf-8'
  );

  console.log('Processing complete!');
  console.log(`Processed ${processedFiles.size} images`);
  console.log(`Created ${challenges.length} challenges`);
}

// Run the script
const [,, csvPath, inputDir, outputDir] = process.argv;

if (!csvPath || !inputDir || !outputDir) {
  console.error('Usage: ts-node normalize-challenges.ts <csv-path> <input-dir> <output-dir>');
  process.exit(1);
}

processAnnotations(csvPath, inputDir, outputDir).catch(console.error);
