import React, { useMemo } from "react";
import { copySceneJson, downloadSceneJson } from "../utils/sceneStorage";
import { DESIGN_PHYSICS_PRESETS } from "../scenes/designPhysicsPresets";
import { createPatchFromPreset } from "../utils/scenePatch";
import { planScenePatchFromIntent } from "../agent/sceneAgentPlanner";


function NumberControl({ label, value, onChange, min = -1000, max = 1000, step = 1 }) {
    return (
        <label className="scene-debug-control">
            <span>{label}</span>
            <input
                type="number"
                value={value ?? 0}
                min={min}
                max={max}
                step={step}
                onChange={(event) => onChange(Number(event.target.value))}
            />
        </label>
    );
}

function SceneDebugPanel({
                             scene,
                             selectedObjectId,
                             onSelectObject,
                             onUpdateObject,
                             onResetScene,
                             onApplyPatch,
                         }) {
    const editableObjects = useMemo(
        () =>
            scene.objects.filter((object) =>
                ["image-card", "ribbon-link", "info-card"].includes(object.type)
            ),
        [scene.objects]
    );


    const [intentText, setIntentText] = React.useState("");
    const [agentReasoning, setAgentReasoning] = React.useState("");


    const selectedObject = editableObjects.find((object) => object.id === selectedObjectId);

    if (!selectedObject) {
        return (
            <aside className="scene-debug-panel">
                <div className="scene-debug-head">
                    <span>Scene Editor</span>
                    <strong>{scene.id}</strong>
                </div>

                <label className="scene-debug-control">
                    <span>Objekt</span>
                    <select
                        value={selectedObjectId || ""}
                        onChange={(event) => onSelectObject(event.target.value)}
                    >
                        <option value="">Objekt auswählen</option>
                        {editableObjects.map((object) => (
                            <option key={object.id} value={object.id}>
                                {object.id}
                            </option>
                        ))}
                    </select>
                </label>
            </aside>
        );
    }


    const handleCopyScene = async () => {
        try {
            await copySceneJson(scene);
            window.alert("Scene JSON wurde kopiert.");
        } catch (error) {
            console.warn(error);
            window.alert("Scene JSON konnte nicht kopiert werden.");
        }
    };

    const handleDownloadScene = () => {
        downloadSceneJson(scene, `${scene.id}.json`);
    };

    const layout = selectedObject.layout || {};
    const animation = selectedObject.animation || {};

    const updateLayout = (key, value) => {
        onUpdateObject(selectedObject.id, {
            layout: {
                ...layout,
                [key]: value,
            },
        });
    };

    const updateAnimation = (key, value) => {
        onUpdateObject(selectedObject.id, {
            animation: {
                ...animation,
                [key]: value,
            },
        });
    };

    return (
        <aside className="scene-debug-panel">
            <div className="scene-debug-head">
                <span>Scene Editor</span>
                <strong>{scene.id}</strong>
            </div>
            <div className="scene-debug-group">
                <h4>Design Agent</h4>

                <label className="scene-debug-control">
                    <span>Intent</span>
                    <textarea
                        className="scene-debug-textarea"
                        value={intentText}
                        onChange={(event) => setIntentText(event.target.value)}
                        placeholder="z.B. Mach den Katalog seriöser, größer und wie auf der nächsten Seite versteckt."
                    />
                </label>

                <button
                    type="button"
                    className="scene-debug-agent-button"
                    onClick={() => {
                        const plan = planScenePatchFromIntent(intentText);
                        setAgentReasoning(plan.reasoning);
                        onApplyPatch(plan.patch);
                    }}
                >
                    Agent Patch anwenden
                </button>

                {agentReasoning && (
                    <p className="scene-debug-reasoning">
                        {agentReasoning}
                    </p>
                )}
            </div>
            <label className="scene-debug-control">
                <span>Objekt</span>
                <select
                    value={selectedObjectId}
                    onChange={(event) => onSelectObject(event.target.value)}
                >
                    {editableObjects.map((object) => (
                        <option key={object.id} value={object.id}>
                            {object.id}
                        </option>
                    ))}
                </select>
            </label>

            <div className="scene-debug-group">
                <h4>Layout</h4>

                <div className="scene-debug-grid">
                    <NumberControl label="Top" value={layout.top} onChange={(v) => updateLayout("top", v)}/>
                    <NumberControl label="Left" value={layout.left} onChange={(v) => updateLayout("left", v)}/>
                    <NumberControl label="Width" value={layout.width} onChange={(v) => updateLayout("width", v)}
                                   min={20} max={1200}/>
                    <NumberControl label="Height" value={layout.height} onChange={(v) => updateLayout("height", v)}
                                   min={20} max={1200}/>
                    <NumberControl label="Rotation" value={layout.rotation}
                                   onChange={(v) => updateLayout("rotation", v)} min={-45} max={45}/>
                    <NumberControl label="Z-Index" value={layout.zIndex} onChange={(v) => updateLayout("zIndex", v)}
                                   min={0} max={20}/>
                </div>
            </div>

            {selectedObject.type === "image-card" && (
                <div className="scene-debug-group">
                    <h4>Animation</h4>

                    <div className="scene-debug-grid">
                        <NumberControl label="Delay" value={animation.delay}
                                       onChange={(v) => updateAnimation("delay", v)} min={0} max={20} step={0.1}/>
                        <NumberControl label="Duration" value={animation.duration}
                                       onChange={(v) => updateAnimation("duration", v)} min={1} max={30} step={0.1}/>
                        <NumberControl label="Tilt A" value={animation.tiltA}
                                       onChange={(v) => updateAnimation("tiltA", v)} min={-45} max={45}/>
                        <NumberControl label="Tilt B" value={animation.tiltB}
                                       onChange={(v) => updateAnimation("tiltB", v)} min={-45} max={45}/>
                        <NumberControl label="Move Up" value={animation.moveUp}
                                       onChange={(v) => updateAnimation("moveUp", v)} min={-80} max={80}/>
                        <NumberControl label="Move Side" value={animation.moveSide}
                                       onChange={(v) => updateAnimation("moveSide", v)} min={-80} max={80}/>
                    </div>
                </div>
            )}

            <div className="scene-debug-actions scene-debug-actions--stack">
                <button type="button" onClick={handleCopyScene}>
                    Copy Scene JSON
                </button>

                <button type="button" onClick={handleDownloadScene}>
                    Download JSON
                </button>

                <button type="button" className="scene-debug-danger" onClick={onResetScene}>
                    Reset to Default
                </button>
            </div>

            <details className="scene-debug-json">
                <summary>Scene JSON</summary>
                <pre>{JSON.stringify(selectedObject, null, 2)}</pre>
            </details>
        </aside>
    );
}

export default SceneDebugPanel;