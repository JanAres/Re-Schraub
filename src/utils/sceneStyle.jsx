export function px(value) {
    if (typeof value === "number") return `${value}px`;
    return value;
}

export function deg(value) {
    if (typeof value === "number") return `${value}deg`;
    return value;
}

export function buildSceneObjectStyle(object) {
    const layout = object.layout || {};
    const animation = object.animation || {};
    const glow = object.glow || {};

    return {
        top: px(layout.top),
        left: px(layout.left),
        width: px(layout.width),
        height: px(layout.height),
        zIndex: layout.zIndex,

        "--rest-rot": deg(layout.rotation ?? 0),
        "--tilt-a": deg(animation.tiltA ?? (layout.rotation ?? 0)),
        "--tilt-b": deg(animation.tiltB ?? (layout.rotation ?? 0)),
        "--move-up": px(animation.moveUp ?? 0),
        "--move-side": px(animation.moveSide ?? 0),
        "--animation-delay": `${animation.delay ?? 0}s`,
        "--animation-duration": `${animation.duration ?? 8.8}s`,

        "--glow-color": glow.color || "rgba(112, 215, 255, 0.92)",
        "--glow-soft": glow.soft || "rgba(104, 210, 255, 0.32)",
        "--glow-strong": glow.strong || "rgba(190, 244, 255, 0.72)",
    };
}

export function buildRibbonStyle(object) {
    const layout = object.layout || {};

    return {
        top: px(layout.top),
        left: px(layout.left),
        minWidth: px(layout.minWidth),
        zIndex: layout.zIndex,
        transform: `rotate(${deg(layout.rotation ?? 0)})`,
    };
}

export function buildInfoCardStyle(object) {
    const layout = object.layout || {};

    return {
        top: px(layout.top),
        left: px(layout.left),
        width: px(layout.width),
        minHeight: px(layout.minHeight),
        zIndex: layout.zIndex,
        transform: `rotate(${deg(layout.rotation ?? 0)})`,
    };
}