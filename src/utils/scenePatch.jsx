function mergeObjectPatch(object, patch) {
    return {
        ...object,
        ...patch,
        layout: patch.layout
            ? {
                ...(object.layout || {}),
                ...patch.layout,
            }
            : object.layout,
        animation: patch.animation
            ? {
                ...(object.animation || {}),
                ...patch.animation,
            }
            : object.animation,
        glow: patch.glow
            ? {
                ...(object.glow || {}),
                ...patch.glow,
            }
            : object.glow,
    };
}

export function applyScenePatch(scene, patch) {
    if (!patch) return scene;

    const objectPatches = patch.objects || patch.patches || {};

    return {
        ...scene,
        intent: patch.intent
            ? {
                ...(scene.intent || {}),
                ...patch.intent,
            }
            : scene.intent,
        objects: scene.objects.map((object) => {
            const objectPatch = objectPatches[object.id];

            if (!objectPatch) {
                return object;
            }

            return mergeObjectPatch(object, objectPatch);
        }),
    };
}

export function createPatchFromPreset(preset) {
    return {
        id: `patch:${preset.id}`,
        source: "design-physics-preset",
        intent: preset.intent,
        objects: preset.patches,
    };
}