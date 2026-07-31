import React, { useMemo } from "react";

const ICON_PATHS = {
    roof: [
        { d: "M8 24L24 11l16 13" },
        { d: "M13 22h22" },
        { d: "M16 22l-2 12h20l-2-12" },
    ],
    facade: [
        { d: "M10 9h28v30H10z" },
        { d: "M18 9v30" },
        { d: "M26 9v30" },
        { d: "M34 9v30" },
    ],
    wallFix: [
        { d: "M12 10v28" },
        { d: "M20 14l12 20" },
        { d: "M30 14l8 10" },
    ],
    sheet: [
        { d: "M9 30h24l6-8H15z" },
        { d: "M13 18h16" },
    ],
    shield: [
        { d: "M24 9c7 3 11 4 11 4v8c0 8-5 13-11 18-6-5-11-10-11-18v-8s4-1 11-4z" },
        { d: "M18 24l4 4 8-9" },
    ],
    anchorBolt: [
        { d: "M8 24h32v10H8z" },
        { d: "M14 24v-8l8-5 8 5v8" },
    ],
    hollowWall: [
        { d: "M12 10v28" },
        { d: "M19 16v16" },
        { d: "M19 16l12 8-12 8" },
    ],
    frameFix: [
        { d: "M9 10h30v28H9z" },
        { d: "M17 18l14 14" },
        { d: "M31 18L17 32" },
    ],
    lightFix: [
        { d: "M24 14a6 6 0 1 1 0 12a6 6 0 1 1 0-12" },
        { d: "M24 26v8" },
        { d: "M19 34h10" },
    ],
    cableFix: [
        { d: "M10 24c0-6 4-10 10-10s10 4 10 10" },
        { d: "M13 24h22" },
        { d: "M24 24v10" },
    ],
    fence: [
        { d: "M11 38V14l4-4 4 4v24" },
        { d: "M21 38V14l4-4 4 4v24" },
        { d: "M9 22h30" },
        { d: "M9 30h30" },
    ],
    pergola: [
        { d: "M10 18h28" },
        { d: "M14 18v18" },
        { d: "M34 18v18" },
        { d: "M16 12h16" },
        { d: "M14 12v6M20 12v6M28 12v6M34 12v6" },
    ],
    paving: [
        { d: "M9 30l7-6 7 6 7-6 9 6" },
        { d: "M9 36h30" },
        { d: "M16 24v6" },
        { d: "M30 24v6" },
    ],
    outdoorWood: [
        { d: "M10 12h28v24H10z" },
        { d: "M15 18c3-2 5-2 8 0s5 2 10 0" },
        { d: "M15 26c3-2 5-2 8 0s5 2 10 0" },
    ],
    edging: [
        { d: "M8 30c8-6 24-6 32 0" },
        { d: "M10 34h28" },
        { d: "M16 20v10" },
        { d: "M24 18v12" },
        { d: "M32 20v10" },
    ],
    deckBoard: [
        { d: "M9 14h30v6H9z" },
        { d: "M9 28h30v6H9z" },
        { d: "M16 20v8" },
        { d: "M24 20v8" },
        { d: "M32 20v8" },
    ],
    spacer: [
        { d: "M11 11h8v26h-8z" },
        { d: "M29 11h8v26h-8z" },
        { d: "M19 24h10" },
    ],
    subframe: [
        { d: "M10 34h28" },
        { d: "M14 14v20" },
        { d: "M24 14v20" },
        { d: "M34 14v20" },
        { d: "M10 20h28" },
    ],
    clipFix: [
        { d: "M16 14h16v8H16z" },
        { d: "M20 22v12" },
        { d: "M28 22v12" },
        { d: "M14 34h20" },
    ],
    pedestal: [
        { d: "M14 14h20" },
        { d: "M18 14v8h12v-8" },
        { d: "M14 34h20" },
        { d: "M24 22v12" },
    ],
    nail: [
        { d: "M24 9v24" },
        { d: "M20 13h8" },
        { d: "M24 33l-4 6h8z" },
    ],
    pin: [
        { d: "M16 12l16 16" },
        { d: "M28 10l10 10" },
        { d: "M16 28l-6 10" },
    ],
    signPin: [
        { d: "M14 12h20v14H14z" },
        { d: "M24 26v10" },
        { d: "M18 36h12" },
    ],
    trim: [
        { d: "M12 30h24" },
        { d: "M18 16h12" },
        { d: "M24 16v14" },
    ],
    lightFasten: [
        { d: "M24 13a5 5 0 1 1 0 10a5 5 0 1 1 0-10" },
        { d: "M24 23v12" },
        { d: "M20 35h8" },
    ],
    bolt: [
        { d: "M16 18h16" },
        { d: "M14 18l-4 6 4 6h18l4-6-4-6z" },
        { d: "M20 18v12M24 18v12M28 18v12" },
    ],
    nut: [
        { d: "M18 12h12l6 12-6 12H18l-6-12z" },
        { d: "M24 19a5 5 0 1 1 0 10a5 5 0 1 1 0-10" },
    ],
    washer: [
        { d: "M24 12a12 12 0 1 1 0 24a12 12 0 1 1 0-24" },
        { d: "M24 19a5 5 0 1 1 0 10a5 5 0 1 1 0-10" },
    ],
    thread: [
        { d: "M11 24h26" },
        { d: "M15 18l4 6-4 6" },
        { d: "M23 18l4 6-4 6" },
        { d: "M31 18l4 6-4 6" },
    ],
    standardPart: [
        { d: "M11 11h26v26H11z" },
        { d: "M18 18h12" },
        { d: "M18 24h12" },
        { d: "M18 30h12" },
    ],
    cabinet: [
        { d: "M12 10h24v28H12z" },
        { d: "M24 10v28" },
        { d: "M20 24h1" },
        { d: "M28 24h1" },
    ],
    woodPanel: [
        { d: "M10 12h28v24H10z" },
        { d: "M15 18c3-2 5-2 8 0s5 2 10 0" },
        { d: "M15 26c3-2 5-2 8 0s5 2 10 0" },
    ],
    hinge: [
        { d: "M12 14h8v20h-8z" },
        { d: "M28 14h8v20h-8z" },
        { d: "M20 24h8" },
    ],
    shelf: [
        { d: "M12 16v20" },
        { d: "M36 16v20" },
        { d: "M12 20h24" },
        { d: "M12 30h24" },
    ],
    woodJoin: [
        { d: "M10 18h18v10H10z" },
        { d: "M20 24h18v10H20z" },
        { d: "M20 18v16" },
    ],
    bit: [
        { d: "M24 9v22" },
        { d: "M20 13l4-4 4 4" },
        { d: "M20 31l4 8 4-8" },
    ],
    drill: [
        { d: "M10 24h18l10-6v12l-10-6" },
        { d: "M18 24v10" },
    ],
    countersink: [
        { d: "M24 10v10" },
        { d: "M16 20l8 10 8-10" },
        { d: "M20 30h8" },
    ],
    socket: [
        { d: "M16 10h16v28H16z" },
        { d: "M20 16h8" },
        { d: "M20 24h8" },
        { d: "M20 32h8" },
    ],
    saw: [
        { d: "M10 18h20l8 12H18z" },
        { d: "M18 30l-2 4" },
        { d: "M24 30l-2 4" },
        { d: "M30 30l-2 4" },
    ],
    drywall: [
        { d: "M11 10h26v28H11z" },
        { d: "M17 16h14" },
        { d: "M17 24h14" },
        { d: "M17 32h8" },
    ],
    profile: [
        { d: "M12 12h24v6H18v12h18v6H12z" },
    ],
    hanger: [
        { d: "M24 10v12" },
        { d: "M16 22h16" },
        { d: "M18 22v14" },
        { d: "M30 22v14" },
    ],
    joint: [
        { d: "M10 16h12v16H10z" },
        { d: "M26 16h12v16H26z" },
        { d: "M24 14v20" },
    ],
    acoustic: [
        { d: "M12 10v28" },
        { d: "M22 14c4 2 4 18 0 20" },
        { d: "M28 12c6 3 6 21 0 24" },
        { d: "M34 10c8 4 8 24 0 28" },
    ],
};

export default function AnimatedLineIcon({ type, replayKey }) {
    const paths = useMemo(() => ICON_PATHS[type] || [], [type]);

    return (
        <svg
            viewBox="0 0 48 48"
            width="30"
            height="30"
            fill="none"
            className="animated-line-icon"
            aria-hidden="true"
        >
            {paths.map((path, index) => (
                <path
                    key={`${replayKey}-${type}-${index}`}
                    d={path.d}
                    className="animated-line-icon-path"
                    style={{
                        animationDelay: `${index * 0.11}s`,
                    }}
                />
            ))}
        </svg>
    );
}