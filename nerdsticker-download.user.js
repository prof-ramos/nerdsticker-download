// ==UserScript==
// @name         NerdStickers - Download da Arte
// @namespace    https://nerdstickers.com.br/
// @version      1.1
// @description  Adiciona botões para baixar a arte original do sticker em WebP (padrão) ou PNG
// @author       prof-ramos
// @match        https://nerdstickers.com.br/stickers/*
// @icon         https://nerdstickers.com.br/wp-content/uploads/2024/07/Favicon-NS_1-1.png
// @grant        GM_download
// @downloadURL  https://raw.githubusercontent.com/prof-ramos/nerdsticker-download/main/nerdsticker-download.user.js
// @license      MIT
// ==/UserScript==

(function () {
    'use strict';

    // ── Formata o nome do produto a partir do <h1> ──────────────────────
    function getProductName() {
        const title = document.querySelector('.product_title');
        // O .product_title tem um <span> de rating dentro — pegamos só o
        // primeiro textNode para ignorar a nota.
        return title?.childNodes[0]?.textContent?.trim() || null;
    }

    // ── Sanitiza nome para usar como filename ──────────────────────────
    function sanitizeFileName(name) {
        return name
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, '')
            .replace(/[^a-zA-Z0-9\-_ ]/g, '')
            .trim()
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .toLowerCase();
    }

    // ── Constrói a URL full-size a partir da thumbnail ──────────────────
    function buildUrls(thumbSrc) {
        const base = thumbSrc.replace(/-150x150(?=\.\w+)/, '');
        return {
            webp: base,                              // mantém .webp original
            png:  base.replace(/\.webp$/, '.png'),   // tenta .png (existe no servidor)
        };
    }

    // ── Cria um botão com estilo consistente ───────────────────────────
    function createButton(label, bgColor, hoverColor, textColor = '#fff') {
        const btn = document.createElement('button');
        btn.textContent = label;
        Object.assign(btn.style, {
            padding: '10px 20px',
            backgroundColor: bgColor,
            color: textColor,
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: '600',
            fontSize: '14px',
            transition: 'background .2s',
        });
        btn.addEventListener('mouseenter', () => { btn.style.backgroundColor = hoverColor; });
        btn.addEventListener('mouseleave', () => { btn.style.backgroundColor = bgColor; });
        return btn;
    }

    // ── Feedback temporário no botão ───────────────────────────────────
    function feedback(btn, text, duration = 2500) {
        const original = btn.textContent;
        btn.textContent = text;
        btn.disabled = true;
        setTimeout(() => {
            btn.textContent = original;
            btn.disabled = false;
        }, duration);
    }

    // ── Injeta os botões na página ─────────────────────────────────────
    function injectButtons(thumbImg, productName) {
        const urls = buildUrls(thumbImg.src);
        const baseName = sanitizeFileName(productName);

        // ── Container ────────────────────────────────────────────────
        const container = document.createElement('div');
        container.style.cssText = `
            margin: 12px 0;
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            align-items: center;
        `;

        // ── Botão WebP (principal) ───────────────────────────────────
        const btnWebp = createButton('⬇ Baixar WebP', '#6c5ce7', '#5a4bd1');
        btnWebp.addEventListener('click', () => {
            btnWebp.disabled = true;
            btnWebp.textContent = '⏳ WebP…';
            GM_download({
                url: urls.webp,
                name: baseName + '.webp',
                onload: () => feedback(btnWebp, '✅ WebP baixado!'),
                onerror: () => feedback(btnWebp, '❌ Erro'),
            });
        });

        // ── Botão PNG (alternativa) ──────────────────────────────────
        const btnPng = createButton('⬇ Baixar PNG', '#00b894', '#00a381');
        btnPng.addEventListener('click', () => {
            btnPng.disabled = true;
            btnPng.textContent = '⏳ PNG…';
            GM_download({
                url: urls.png,
                name: baseName + '.png',
                onload: () => feedback(btnPng, '✅ PNG baixado!'),
                onerror: () => feedback(btnPng, '❌ Erro'),
            });
        });

        // ── Botão copiar URL ─────────────────────────────────────────
        const btnCopy = createButton('📋 Copiar URL', '#dfe6e9', '#b2bec3', '#2d3436');
        btnCopy.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(urls.webp);
                feedback(btnCopy, '✅ Copiado!', 2000);
            } catch {
                const ta = document.createElement('textarea');
                ta.value = urls.webp;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                feedback(btnCopy, '✅ Copiado!', 2000);
            }
        });

        // ── Label de resolução ───────────────────────────────────────
        const label = document.createElement('span');
        label.textContent = '1000×1000';
        Object.assign(label.style, {
            fontSize: '12px',
            color: '#636e72',
            marginLeft: '4px',
        });

        container.appendChild(btnWebp);
        container.appendChild(btnPng);
        container.appendChild(btnCopy);
        container.appendChild(label);

        // Injeta após o título
        const titleEl = document.querySelector('.product_title');
        titleEl?.parentNode?.insertBefore(container, titleEl.nextSibling);
    }

    // ── Espera a galeria estar pronta e então injeta os botões ──────────
    const poll = setInterval(() => {
        const firstThumb = document.querySelector(
            '.woocommerce-product-gallery__image img.woocommerce-product-gallery__thumbnail'
        );
        const productName = getProductName();

        if (firstThumb && productName && firstThumb.src) {
            clearInterval(poll);
            injectButtons(firstThumb, productName);
        }
    }, 500);

    // Timeout de segurança (~10 s)
    setTimeout(() => clearInterval(poll), 10000);
})();