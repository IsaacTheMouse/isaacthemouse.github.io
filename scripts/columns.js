'use strict';

const { join } = require('path');

const DEFAULT_GAP = '16px';
const COLUMN_MARKER_REGEX = /^[\t ]*<!--\s*column\s*-->\s*$/gm;
const CSS_LENGTH_REGEX = /^-?\d+(?:\.\d+)?(?:px|rem|em|%|vw|vh|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/i;

function parseNamedArgs(args) {
  const named = {};

  for (const token of args) {
    const equalIndex = token.indexOf('=');
    if (equalIndex <= 0) {
      continue;
    }
    const key = token.slice(0, equalIndex).trim();
    const value = token.slice(equalIndex + 1).trim().replace(/^["']|["']$/g, '');
    if (key) {
      named[key] = value;
    }
  }

  return named;
}

function normalizeGap(value) {
  const normalized = String(value ?? '').trim();

  if (!normalized) {
    return DEFAULT_GAP;
  }

  if (/^-?\d+(?:\.\d+)?$/.test(normalized)) {
    return `${normalized}px`;
  }

  if (CSS_LENGTH_REGEX.test(normalized)) {
    return normalized;
  }

  return DEFAULT_GAP;
}

function parseRatio(value) {
  const normalized = String(value ?? '').trim();

  if (!normalized) {
    return null;
  }

  const parts = normalized.split(':').map((part) => Number(part.trim()));

  if (parts.length < 2 || parts.some((part) => !Number.isFinite(part) || part <= 0)) {
    return null;
  }

  return parts;
}

function resolveRatios(named, blockCount, sourcePath) {
  const ratio = parseRatio(named.ratio);
  const cols = Number(named.cols);
  let ratios;

  if (ratio) {
    ratios = ratio;
  } else if (Number.isFinite(cols) && cols >= 2) {
    ratios = new Array(Math.floor(cols)).fill(1);
  } else {
    ratios = new Array(blockCount).fill(1);
  }

  if (ratios.length !== blockCount) {
    console.warn(`[columns] ${sourcePath}: expected ${ratios.length} column(s) but found ${blockCount} <!-- column --> block(s); using actual block count`);
    if (ratios.length > blockCount) {
      ratios = ratios.slice(0, blockCount);
    } else {
      ratios = ratios.concat(new Array(blockCount - ratios.length).fill(1));
    }
  }

  return ratios;
}

function splitColumnBlocks(content) {
  const markers = [];
  let match;

  COLUMN_MARKER_REGEX.lastIndex = 0;
  while ((match = COLUMN_MARKER_REGEX.exec(content)) !== null) {
    markers.push({ start: match.index, end: match.index + match[0].length });
  }

  if (!markers.length) {
    return [content];
  }

  return markers.map((marker, index) => {
    const nextStart = markers[index + 1]?.start ?? content.length;
    return content.slice(marker.end, nextStart);
  });
}

async function renderColumnContent(content, postContext) {
  const path = postContext?.full_source
    || (postContext?.source ? join(hexo.source_dir, postContext.source) : undefined);
  const rendered = hexo.render.renderSync({ text: content.trim(), engine: 'markdown', path });
  return hexo.extend.tag.render(rendered.trim(), postContext);
}

async function postColumns(args, content) {
  const named = parseNamedArgs(args);
  const gap = normalizeGap(named.gap);
  const fill = String(named.fill ?? '').toLowerCase() === 'true';
  const blocks = splitColumnBlocks(content);
  const sourcePath = this?.source || this?.path || 'unknown source';
  const ratios = resolveRatios(named, blocks.length, sourcePath);

  const columns = await Promise.all(blocks.map(async (block, index) => {
    const rendered = await renderColumnContent(block, this);
    return `<div class="post-column" style="flex:${ratios[index]} 1 0%; min-width:0;">${rendered}</div>`;
  }));

  const className = fill ? 'post-columns post-columns-fill' : 'post-columns';
  return `<div class="${className}" style="display:flex; align-items:flex-start; gap:${gap};">${columns.join('')}</div>`;
}

hexo.extend.tag.register('columns', postColumns, { ends: true, async: true });

hexo.extend.injector.register('head_end', `<style>
.post-columns { margin: 1rem 0; }
.post-columns > .post-column > :first-child { margin-top: 0 !important; }
.post-columns > .post-column > :last-child { margin-bottom: 0 !important; }
.post-columns > .post-column > :first-child > img:first-child { margin-top: 0 !important; }
.post-columns > .post-column > :last-child > img:last-child { margin-bottom: 0 !important; }
.post-columns-fill .post-column img { width: 100%; height: auto; }
@media (max-width: 768px) {
  .post-columns { flex-direction: column; }
  .post-columns > .post-column { flex: 1 1 auto !important; width: 100%; }
}
</style>`);
