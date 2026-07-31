import React from "react";

const baseProps = {
    viewBox: "0 0 48 48",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    width: 30,
    height: 30,
    "aria-hidden": true,
};

export default function CategoryLineIcon({ type }) {
    switch (type) {
        case "roof":
            return (
                <svg {...baseProps}>
                    <path d="M8 24L24 11l16 13" />
                    <path d="M13 22h22" />
                    <path d="M16 22l-2 12h20l-2-12" />
                </svg>
            );

        case "facadePanel":
            return (
                <svg {...baseProps}>
                    <rect x="10" y="9" width="28" height="30" rx="2" />
                    <path d="M18 9v30M26 9v30M34 9v30" />
                </svg>
            );

        case "flashing":
            return (
                <svg {...baseProps}>
                    <path d="M9 30h24l6-8H15z" />
                    <path d="M13 18h16" />
                </svg>
            );

        case "wallSeal":
            return (
                <svg {...baseProps}>
                    <path d="M10 10v28" />
                    <path d="M18 14l12 20" />
                    <path d="M30 14l8 10" />
                </svg>
            );

        case "weatherShield":
            return (
                <svg {...baseProps}>
                    <path d="M24 9c7 3 11 4 11 4v8c0 8-5 13-11 18-6-5-11-10-11-18v-8s4-1 11-4z" />
                    <path d="M18 24l4 4 8-9" />
                </svg>
            );

        case "wallPlug":
            return (
                <svg {...baseProps}>
                    <path d="M12 26l12-12" />
                    <path d="M16 30l12-12" />
                    <path d="M26 14l8 8" />
                </svg>
            );

        case "frameFix":
            return (
                <svg {...baseProps}>
                    <rect x="9" y="10" width="30" height="28" rx="2" />
                    <path d="M17 18l14 14" />
                    <path d="M31 18L17 32" />
                </svg>
            );

        case "concreteFix":
            return (
                <svg {...baseProps}>
                    <rect x="8" y="24" width="32" height="10" rx="1.5" />
                    <path d="M14 24v-8l8-5 8 5v8" />
                </svg>
            );

        case "hollowWall":
            return (
                <svg {...baseProps}>
                    <path d="M12 10v28" />
                    <path d="M19 16v16" />
                    <path d="M19 16l12 8-12 8" />
                </svg>
            );

        case "cableMount":
            return (
                <svg {...baseProps}>
                    <path d="M10 24c0-6 4-10 10-10s10 4 10 10" />
                    <path d="M13 24h22" />
                    <path d="M24 24v10" />
                </svg>
            );

        case "fence":
            return (
                <svg {...baseProps}>
                    <path d="M11 38V14l4-4 4 4v24" />
                    <path d="M21 38V14l4-4 4 4v24" />
                    <path d="M9 22h30M9 30h30" />
                </svg>
            );

        case "edging":
            return (
                <svg {...baseProps}>
                    <path d="M8 30c8-6 24-6 32 0" />
                    <path d="M10 34h28" />
                    <path d="M16 20v10M24 18v12M32 20v10" />
                </svg>
            );

        case "pergola":
            return (
                <svg {...baseProps}>
                    <path d="M10 18h28" />
                    <path d="M14 18v18M34 18v18" />
                    <path d="M16 12h16" />
                    <path d="M14 12v6M20 12v6M28 12v6M34 12v6" />
                </svg>
            );

        case "paving":
            return (
                <svg {...baseProps}>
                    <path d="M9 30l7-6 7 6 7-6 9 6" />
                    <path d="M9 36h30" />
                    <path d="M16 24v6M30 24v6" />
                </svg>
            );

        case "retainingWall":
            return (
                <svg {...baseProps}>
                    <path d="M10 36h28" />
                    <path d="M12 36V16h10v20" />
                    <path d="M22 24h14" />
                    <path d="M26 19h8" />
                </svg>
            );

        case "deckBoard":
            return (
                <svg {...baseProps}>
                    <rect x="9" y="14" width="30" height="6" rx="2" />
                    <rect x="9" y="28" width="30" height="6" rx="2" />
                    <path d="M16 20v8M24 20v8M32 20v8" />
                </svg>
            );

        case "spacer":
            return (
                <svg {...baseProps}>
                    <rect x="11" y="11" width="8" height="26" rx="2" />
                    <rect x="29" y="11" width="8" height="26" rx="2" />
                    <path d="M19 24h10" />
                </svg>
            );

        case "subframe":
            return (
                <svg {...baseProps}>
                    <path d="M10 34h28" />
                    <path d="M14 14v20M24 14v20M34 14v20" />
                    <path d="M10 20h28" />
                </svg>
            );

        case "pedestal":
            return (
                <svg {...baseProps}>
                    <path d="M14 14h20" />
                    <path d="M18 14v8h12v-8" />
                    <path d="M14 34h20" />
                    <path d="M24 22v12" />
                </svg>
            );

        case "clipFix":
            return (
                <svg {...baseProps}>
                    <path d="M16 14h16v8H16z" />
                    <path d="M20 22v12M28 22v12" />
                    <path d="M14 34h20" />
                </svg>
            );

        case "brad":
            return (
                <svg {...baseProps}>
                    <path d="M24 9v24" />
                    <path d="M20 13h8" />
                    <path d="M24 33l-4 6h8z" />
                </svg>
            );

        case "pinFasten":
            return (
                <svg {...baseProps}>
                    <path d="M16 12l16 16" />
                    <path d="M28 10l10 10" />
                    <path d="M16 28l-6 10" />
                </svg>
            );

        case "fabricFix":
            return (
                <svg {...baseProps}>
                    <path d="M10 14c3-2 5-2 8 0s5 2 8 0 5-2 8 0 5 2 4 6-3 4-6 4-5-2-8 0-5 2-8 0-5-2-8 0-5 2-4-6 3-4 6-4z" />
                </svg>
            );

        case "signFix":
            return (
                <svg {...baseProps}>
                    <path d="M14 12h20v14H14z" />
                    <path d="M24 26v10" />
                    <path d="M18 36h12" />
                </svg>
            );

        case "trimFix":
            return (
                <svg {...baseProps}>
                    <path d="M12 30h24" />
                    <path d="M18 16h12" />
                    <path d="M24 16v14" />
                </svg>
            );

        case "bolt":
            return (
                <svg {...baseProps}>
                    <path d="M16 18h16" />
                    <path d="M14 18l-4 6 4 6h18l4-6-4-6z" />
                    <path d="M20 18v12M24 18v12M28 18v12" />
                </svg>
            );

        case "nut":
            return (
                <svg {...baseProps}>
                    <path d="M18 12h12l6 12-6 12H18l-6-12z" />
                    <circle cx="24" cy="24" r="5" />
                </svg>
            );

        case "washer":
            return (
                <svg {...baseProps}>
                    <circle cx="24" cy="24" r="12" />
                    <circle cx="24" cy="24" r="5" />
                </svg>
            );

        case "thread":
            return (
                <svg {...baseProps}>
                    <path d="M11 24h26" />
                    <path d="M15 18l4 6-4 6" />
                    <path d="M23 18l4 6-4 6" />
                    <path d="M31 18l4 6-4 6" />
                </svg>
            );

        case "standardPart":
            return (
                <svg {...baseProps}>
                    <rect x="11" y="11" width="26" height="26" rx="4" />
                    <path d="M18 18h12M18 24h12M18 30h12" />
                </svg>
            );

        case "cabinet":
            return (
                <svg {...baseProps}>
                    <rect x="12" y="10" width="24" height="28" rx="2" />
                    <path d="M24 10v28" />
                    <path d="M20 24h1M28 24h1" />
                </svg>
            );

        case "woodPanel":
            return (
                <svg {...baseProps}>
                    <rect x="10" y="12" width="28" height="24" rx="2" />
                    <path d="M15 18c3-2 5-2 8 0s5 2 10 0" />
                    <path d="M15 26c3-2 5-2 8 0s5 2 10 0" />
                </svg>
            );

        case "hingeFix":
            return (
                <svg {...baseProps}>
                    <rect x="12" y="14" width="8" height="20" rx="2" />
                    <rect x="28" y="14" width="8" height="20" rx="2" />
                    <path d="M20 24h8" />
                </svg>
            );

        case "shelfBuild":
            return (
                <svg {...baseProps}>
                    <path d="M12 16v20M36 16v20" />
                    <path d="M12 20h24M12 30h24" />
                </svg>
            );

        case "woodJoin":
            return (
                <svg {...baseProps}>
                    <path d="M10 18h18v10H10z" />
                    <path d="M20 24h18v10H20z" />
                    <path d="M20 18v16" />
                </svg>
            );

        case "bit":
            return (
                <svg {...baseProps}>
                    <path d="M24 9v22" />
                    <path d="M20 13l4-4 4 4" />
                    <path d="M20 31l4 8 4-8" />
                </svg>
            );

        case "drill":
            return (
                <svg {...baseProps}>
                    <path d="M10 24h18l10-6v12l-10-6" />
                    <path d="M18 24v10" />
                </svg>
            );

        case "countersink":
            return (
                <svg {...baseProps}>
                    <path d="M24 10v10" />
                    <path d="M16 20l8 10 8-10" />
                    <path d="M20 30h8" />
                </svg>
            );

        case "socket":
            return (
                <svg {...baseProps}>
                    <rect x="16" y="10" width="16" height="28" rx="3" />
                    <path d="M20 16h8M20 24h8M20 32h8" />
                </svg>
            );

        case "saw":
            return (
                <svg {...baseProps}>
                    <path d="M10 18h20l8 12H18z" />
                    <path d="M18 30l-2 4M24 30l-2 4M30 30l-2 4" />
                </svg>
            );

        case "drywallPanel":
            return (
                <svg {...baseProps}>
                    <rect x="11" y="10" width="26" height="28" rx="2" />
                    <path d="M17 16h14M17 24h14M17 32h8" />
                </svg>
            );

        case "metalProfile":
            return (
                <svg {...baseProps}>
                    <path d="M12 12h24v6H18v12h18v6H12z" />
                </svg>
            );

        case "hanger":
            return (
                <svg {...baseProps}>
                    <path d="M24 10v12" />
                    <path d="M16 22h16" />
                    <path d="M18 22v14M30 22v14" />
                </svg>
            );

        case "joint":
            return (
                <svg {...baseProps}>
                    <path d="M10 16h12v16H10z" />
                    <path d="M26 16h12v16H26z" />
                    <path d="M24 14v20" />
                </svg>
            );

        case "acousticWall":
            return (
                <svg {...baseProps}>
                    <path d="M12 10v28" />
                    <path d="M22 14c4 2 4 18 0 20" />
                    <path d="M28 12c6 3 6 21 0 24" />
                    <path d="M34 10c8 4 8 24 0 28" />
                </svg>
            );

        default:
            return (
                <svg {...baseProps}>
                    <circle cx="24" cy="24" r="12" />
                </svg>
            );
    }
}