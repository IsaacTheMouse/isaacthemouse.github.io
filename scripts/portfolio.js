'use strict';

const { join } = require('path');

const STATUS_LABELS = {
  completed: '已完成',
  ongoing: '进行中'
};

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function sanitizeTagValue(value) {
  return String(value ?? '')
    .replace(/::/g, '：：')
    .replace(/{%|%}/g, '')
    .replace(/[\r\n]+/g, ' ')
    .trim();
}

function asList(value) {
  if (Array.isArray(value)) {
    return value.map((item) => String(item).trim()).filter(Boolean);
  }

  if (value == null || value === '') {
    return [];
  }

  return [String(value).trim()].filter(Boolean);
}

function normalizeId(value, index) {
  const normalized = String(value ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, '-');

  return normalized || `project-${index + 1}`;
}

function renderChips(values, className = '') {
  return asList(values)
    .map((value) => `<span class="portfolio-chip ${className}">${escapeHtml(value)}</span>`)
    .join('');
}

async function renderMarkdown(content, postContext) {
  if (!content) {
    return '';
  }

  const path = postContext?.full_source
    || (postContext?.source ? join(hexo.source_dir, postContext.source) : undefined);
  const rendered = hexo.render.renderSync({
    text: String(content).trim(),
    engine: 'markdown',
    path
  });

  return hexo.extend.tag.render(rendered.trim(), postContext);
}

async function renderLinks(links, postContext) {
  const normalizedLinks = Array.isArray(links) ? links : [];
  const buttons = [];

  for (const link of normalizedLinks) {
    if (!link?.label || !link?.url) {
      continue;
    }

    const label = sanitizeTagValue(link.label);
    const url = sanitizeTagValue(link.url);
    const icon = sanitizeTagValue(link.icon);
    const tag = `{% button regular::${label}::${url}::${icon} %}`;
    let rendered = await hexo.extend.tag.render(tag, postContext);

    if (link.external) {
      rendered = rendered.replace(
        '<a ',
        '<a target="_blank" rel="noopener noreferrer" '
      );
    }

    buttons.push(rendered);
  }

  if (!buttons.length) {
    return '';
  }

  return `<nav class="portfolio-links" aria-label="项目链接"><span class="portfolio-links-label">项目链接</span><div class="portfolio-link-list">${buttons.join('')}</div></nav>`;
}

async function renderProject(project, index, postContext) {
  const id = normalizeId(project.id, index);
  const dialogId = `portfolio-dialog-${id}`;
  const titleId = `${dialogId}-title`;
  const engines = asList(project.engines);
  const roles = asList(project.roles);
  const types = asList(project.types);
  const year = String(project.year ?? '').trim();
  const sortDate = String(project.sort_date ?? '').trim();
  const status = String(project.status ?? '').trim();
  const statusLabel = STATUS_LABELS[status] || status;
  const gameContent = await renderMarkdown(project.game_content, postContext);
  const workContent = await renderMarkdown(project.work_content, postContext);
  const links = await renderLinks(project.links, postContext);
  const filterAttributes = [
    `data-year="${escapeHtml(year)}"`,
    `data-sort-date="${escapeHtml(sortDate)}"`,
    `data-engine="${escapeHtml(engines.join('|'))}"`,
    `data-role="${escapeHtml(roles.join('|'))}"`,
    `data-type="${escapeHtml(types.join('|'))}"`,
    `data-status="${escapeHtml(status)}"`
  ].join(' ');
  const award = project.award
    ? `<span class="portfolio-award"><i class="fa-solid fa-trophy" aria-hidden="true"></i>${escapeHtml(project.award)}</span>`
    : '';
  const statusBadge = status === 'ongoing'
    ? `<span class="portfolio-status">${escapeHtml(statusLabel)}</span>`
    : '';

  return `
    <article class="portfolio-item" role="listitem" ${filterAttributes}>
      <button class="portfolio-card" type="button" data-portfolio-open="${dialogId}" aria-haspopup="dialog" aria-controls="${dialogId}">
        <span class="portfolio-card-media">
          <img src="${escapeHtml(project.cover)}" alt="" loading="lazy" decoding="async">
          ${statusBadge}
        </span>
        <span class="portfolio-card-body">
          <span class="portfolio-card-heading">
            <span class="portfolio-card-title">${escapeHtml(project.title)}</span>
            <i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i>
          </span>
          <span class="portfolio-card-summary">${escapeHtml(project.summary)}</span>
          <span class="portfolio-card-meta">${renderChips([year, ...engines, ...roles])}</span>
          <span class="portfolio-card-event">${escapeHtml(project.event)}</span>
          ${award}
        </span>
      </button>
      <dialog class="portfolio-dialog" id="${dialogId}" data-portfolio-dialog aria-labelledby="${titleId}">
        <div class="portfolio-dialog-frame">
          <header class="portfolio-dialog-header">
            <h2 id="${titleId}">${escapeHtml(project.title)}</h2>
            <button class="portfolio-dialog-close" type="button" data-portfolio-close aria-label="关闭项目详情">
              <i class="fa-solid fa-xmark" aria-hidden="true"></i>
            </button>
          </header>
          <div class="portfolio-dialog-content">
            <img class="portfolio-dialog-cover" src="${escapeHtml(project.cover)}" alt="${escapeHtml(project.title)}封面" loading="lazy" decoding="async">
            <div class="portfolio-dialog-meta">
              ${renderChips([project.period, ...engines, ...roles])}
              ${statusBadge}
            </div>
            <p class="portfolio-dialog-event">${escapeHtml(project.event)}</p>
            ${award}
            ${links}
            <section class="portfolio-dialog-section">
              <h2>游戏内容</h2>
              ${gameContent}
            </section>
            <section class="portfolio-dialog-section">
              <h2>工作内容</h2>
              ${workContent}
            </section>
          </div>
        </div>
      </dialog>
    </article>`;
}

async function renderPortfolio(projects, pageContext) {
  if (!projects.length) {
    return '<p class="portfolio-empty">暂时还没有作品。</p>';
  }

  const items = await Promise.all(
    projects.map((project, index) => renderProject(project, index, pageContext))
  );

  return `<section class="portfolio-shell" data-portfolio><div class="portfolio-grid" role="list">${items.join('')}</div></section>`;
}

hexo.extend.filter.register('template_locals', async function (locals) {
  if (locals.page?.template !== 'portfolio') {
    return locals;
  }

  const projects = Array.isArray(locals.site?.data?.portfolio)
    ? locals.site.data.portfolio
    : [];
  const portfolio = await renderPortfolio(projects, locals.page);

  locals.page.content = `${locals.page.content || ''}\n${portfolio}`;
  return locals;
});

hexo.extend.injector.register('head_end', '<link rel="stylesheet" href="/css/portfolio.css">');
hexo.extend.injector.register('body_end', '<script src="/js/portfolio.js" defer></script>');
