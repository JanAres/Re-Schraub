import * as XLSX from "xlsx";
import articlesFile from "./articles.xlsx?url";

function normalizeHeader(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ")
        .replace(/[_-]+/g, " ")
        .replace(/\./g, "");
}

function normalizeText(value) {
    return String(value ?? "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function mapArticleRow(row, index) {
    const normalized = {};

    Object.entries(row).forEach(([key, value]) => {
        normalized[normalizeHeader(key)] = value;
    });

    const articleName =
        normalized["artikelbez"] ??
        normalized["artikelbezeichnung"] ??
        "";

    const eanCode =
        normalized["ean code"] ??
        normalized["ean"] ??
        "";

    const brutoVk =
        normalized["brutto vk"] ?? "";

    const nettoEk =
        normalized["netto ek"] ?? "";

    const rabatt =
        normalized["rabatt"] ?? "";

    const priceUnit =
        normalized["preiseinh"] ?? "";

    const nettoGe =
        normalized["netto ge"] ?? "";

    const id = String(eanCode || index + 1).trim();

    return {
        uid: `article-${index}-${id}`,
        id,
        articleName: String(articleName || "").trim(),
        priceUnit: String(priceUnit || "").trim(),
        brutoVk: String(brutoVk || "").trim(),
        rabatt: String(rabatt || "").trim(),
        nettoEk: String(nettoEk || "").trim(),
        eanCode: String(eanCode || "").trim(),
        nettoGe: String(nettoGe || "").trim(),
        raw: row,
    };
}

async function loadWorkbookRows(file) {
    const response = await fetch(file);
    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const firstSheet = workbook.SheetNames[0];
    const sheet = workbook.Sheets[firstSheet];
    return XLSX.utils.sheet_to_json(sheet, { defval: "" });
}

export async function loadCatalogExcelData() {
    const rows = await loadWorkbookRows(articlesFile);

    const articles = rows
        .map(mapArticleRow)
        .filter((item) => item.articleName || item.eanCode);

    return { articles };
}

export function detectArticlesInText(text, articles) {
    const source = normalizeText(text);
    if (!source) return [];

    const found = [];
    const seen = new Set();

    for (const article of articles) {
        const candidates = [
            article.articleName,
            article.eanCode,
            article.id,
        ]
            .map(normalizeText)
            .filter(Boolean);

        const matched = candidates.some((candidate) => source.includes(candidate));
        if (!matched) continue;

        const key = article.uid || article.id;
        if (seen.has(key)) continue;

        seen.add(key);
        found.push(article);
    }

    return found;
}

export function searchArticles(query, articles, limit = 20) {
    const q = normalizeText(query);
    if (!q) return [];

    const scored = [];

    for (const article of articles) {
        const name = normalizeText(article.articleName);
        const ean = normalizeText(article.eanCode);
        const id = normalizeText(article.id);

        let score = 0;

        if (name === q) score += 100;
        if (ean === q) score += 120;
        if (id === q) score += 110;

        if (name.startsWith(q)) score += 40;
        if (ean.startsWith(q)) score += 60;
        if (id.startsWith(q)) score += 55;

        if (name.includes(q)) score += 20;
        if (ean.includes(q)) score += 30;
        if (id.includes(q)) score += 25;

        if (score > 0) {
            scored.push({ article, score });
        }
    }

    return scored
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((entry) => entry.article);
}