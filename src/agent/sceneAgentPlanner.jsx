import { DESIGN_PHYSICS_PRESETS } from "../scenes/designPhysicsPresets";
import { createPatchFromPreset } from "../utils/scenePatch";

function normalizeText(text) {
    return String(text || "").toLowerCase();
}

export function planScenePatchFromIntent(intentText) {
    const text = normalizeText(intentText);

    if (
        text.includes("premium") ||
        text.includes("seriös") ||
        text.includes("ruhig") ||
        text.includes("vertrauen")
    ) {
        return {
            reasoning:
                "The user intent points to a calmer, more trustworthy and premium composition.",
            presetId: "premiumCalm",
            patch: createPatchFromPreset(DESIGN_PHYSICS_PRESETS.premiumCalm),
        };
    }

    if (
        text.includes("spielerisch") ||
        text.includes("wackel") ||
        text.includes("ostern") ||
        text.includes("neugierig") ||
        text.includes("versteckt")
    ) {
        return {
            reasoning:
                "The user intent points to hidden discovery, playful motion and curiosity.",
            presetId: "playfulDiscovery",
            patch: createPatchFromPreset(DESIGN_PHYSICS_PRESETS.playfulDiscovery),
        };
    }

    if (
        text.includes("nächste seite") ||
        text.includes("abgeschnitten") ||
        text.includes("links") ||
        text.includes("außerhalb")
    ) {
        return {
            reasoning:
                "The user intent points to the hidden-next-page metaphor where objects continue beyond the viewport.",
            presetId: "hiddenNextPage",
            patch: createPatchFromPreset(DESIGN_PHYSICS_PRESETS.hiddenNextPage),
        };
    }

    return {
        reasoning:
            "No strong specific intent was detected. Falling back to the hidden-next-page discovery composition.",
        presetId: "hiddenNextPage",
        patch: createPatchFromPreset(DESIGN_PHYSICS_PRESETS.hiddenNextPage),
    };
}