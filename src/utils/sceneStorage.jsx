const SCENE_STORAGE_PREFIX = "symbiotic-scene:";

export function getSceneStorageKey(sceneId) {
    return `${SCENE_STORAGE_PREFIX}${sceneId}`;
}

export function loadStoredScene(sceneId) {
    try {
        const raw = window.localStorage.getItem(getSceneStorageKey(sceneId));

        if (!raw) {
            return null;
        }

        return JSON.parse(raw);
    } catch (error) {
        console.warn("Could not load stored scene:", error);
        return null;
    }
}

export function saveStoredScene(scene) {
    try {
        window.localStorage.setItem(getSceneStorageKey(scene.id), JSON.stringify(scene));
        return true;
    } catch (error) {
        console.warn("Could not save scene:", error);
        return false;
    }
}

export function removeStoredScene(sceneId) {
    try {
        window.localStorage.removeItem(getSceneStorageKey(sceneId));
        return true;
    } catch (error) {
        console.warn("Could not remove stored scene:", error);
        return false;
    }
}

export function downloadSceneJson(scene, fileName = `${scene.id}.json`) {
    const json = JSON.stringify(scene, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
}

export async function copySceneJson(scene) {
    const json = JSON.stringify(scene, null, 2);

    if (!navigator.clipboard) {
        throw new Error("Clipboard API is not available.");
    }

    await navigator.clipboard.writeText(json);
}