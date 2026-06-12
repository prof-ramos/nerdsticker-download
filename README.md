# 🎨 Nerd Stickers — Download da Arte

**UserScript** que adiciona botões de download nas páginas de produto da [Nerd Stickers](https://nerdstickers.com.br) para baixar a **arte original** dos stickers em máxima qualidade.

## ✨ Funcionalidades

- ⬇ **Baixar WebP** — formato padrão, mesma qualidade com metade do tamanho (~124KB)
- ⬇ **Baixar PNG** — alternativa sem perdas (~220KB)
- 📋 **Copiar URL** — copia o link direto da imagem full-size
- **1000×1000px** — resolução máxima disponível no servidor

## 📸 Preview

```
┌──────────────────────────────────────────────┐
│  **Done is Better**                          │
│                                              │
│  [⬇ Baixar WebP] [⬇ Baixar PNG] [📋 Copiar] │
│                                   1000×1000  │
│                                              │
│  ┌──────────────────────────────────────┐    │
│  │          Imagem do sticker            │    │
│  └──────────────────────────────────────┘    │
└──────────────────────────────────────────────┘
```

## 🔧 Como funciona

O site Nerd Stickers usa WooCommerce com uma galeria de 3 fotos por produto:

| # | Conteúdo |
|---|----------|
| `-01` | **🎯 Arte do sticker** (a que nos interessa) |
| `-02` | Sticker sendo utilizado (ilustrativa) |
| `-03` | Sticker sendo utilizado (ilustrativa) |

O script:

1. Pega a **primeira thumbnail** da galeria (sempre a `-01`)
2. Remove o sufixo `-150x150` da URL → obtém a imagem **1000×1000px original**
3. Oferece download em **WebP** (padrão) ou **PNG** (alternativa)

Também existe a versão `.png` no servidor para quem preferir o formato sem compressão.

## 📦 Instalação

### 1. Instale um gerenciador de UserScripts

| Navegador | Extensão |
|-----------|----------|
| **Safari** | [Userscripts](https://github.com/quoid/userscripts) |
| **Chrome** | [Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo) |
| **Firefox** | [Tampermonkey](https://addons.mozilla.org/firefox/addon/tamerpermonkey/) |
| **Edge** | [Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd) |

### 2. Instale o script

**Opção A — Instalação com um clique:**
Abra o link abaixo e o gerenciador de UserScripts vai reconhecer e pedir para instalar:

> [Clique aqui](https://github.com/prof-ramos/nerdsticker-download/raw/main/nerdsticker-download.user.js)

**Opção B — Manual:**
Copie o arquivo `nerdsticker-download.user.js` para a pasta que seu gerenciador monitora.

### 3. Navegue até qualquer sticker

Vá para `https://nerdstickers.com.br/stickers/*` — os botões aparecem automaticamente abaixo do título do produto.

## 📄 Licença

MIT