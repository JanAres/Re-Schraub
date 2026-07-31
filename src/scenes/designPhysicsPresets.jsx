export const DESIGN_PHYSICS_PRESETS = {
    hiddenNextPage: {
        id: "hiddenNextPage",
        label: "Hidden Next Page",
        description:
            "Creates curiosity by making objects feel like they continue beyond the visible page.",
        intent: {
            emotion: "curiosity",
            metaphor: "world_continues_beyond_frame",
            motionEnergy: "low",
            trustLevel: "medium_high",
        },
        patches: {
            "catalog-left": {
                layout: {
                    top: 48,
                    left: -145,
                    width: 430,
                    height: 575,
                    rotation: -8,
                },
                animation: {
                    delay: 0,
                    duration: 9.2,
                    tiltA: -5,
                    tiltB: -10,
                    moveUp: -8,
                    moveSide: 5,
                },
            },
            "catalog-right": {
                layout: {
                    top: 310,
                    left: 195,
                    width: 425,
                    height: 560,
                    rotation: 7,
                },
                animation: {
                    delay: 1.1,
                    duration: 9.2,
                    tiltA: 10,
                    tiltB: 4,
                    moveUp: -7,
                    moveSide: -4,
                },
            },
            "next-page-ribbon": {
                layout: {
                    top: 292,
                    left: 155,
                    minWidth: 300,
                    rotation: -2,
                },
                text: "Auf der nächsten Seite",
            },
        },
    },

    premiumCalm: {
        id: "premiumCalm",
        label: "Premium Calm",
        description:
            "More serious and premium. Less playful motion, stronger structure, softer glow.",
        intent: {
            emotion: "trust",
            metaphor: "premium_reveal",
            motionEnergy: "very_low",
            trustLevel: "high",
        },
        patches: {
            "catalog-left": {
                layout: {
                    top: 58,
                    left: -120,
                    width: 405,
                    height: 545,
                    rotation: -5,
                },
                animation: {
                    delay: 0,
                    duration: 13,
                    tiltA: -3,
                    tiltB: -6,
                    moveUp: -4,
                    moveSide: 2,
                },
                glow: {
                    color: "rgba(125, 211, 252, 0.62)",
                    soft: "rgba(90, 180, 230, 0.20)",
                    strong: "rgba(190, 244, 255, 0.45)",
                },
            },
            "catalog-right": {
                layout: {
                    top: 325,
                    left: 190,
                    width: 400,
                    height: 530,
                    rotation: 4,
                },
                animation: {
                    delay: 1.4,
                    duration: 13,
                    tiltA: 6,
                    tiltB: 2,
                    moveUp: -4,
                    moveSide: -2,
                },
                glow: {
                    color: "rgba(125, 211, 252, 0.62)",
                    soft: "rgba(90, 180, 230, 0.20)",
                    strong: "rgba(190, 244, 255, 0.45)",
                },
            },
            "next-page-ribbon": {
                text: "Katalog entdecken",
            },
        },
    },

    playfulDiscovery: {
        id: "playfulDiscovery",
        label: "Playful Discovery",
        description:
            "More lively, noticeable and playful. Useful when the visual should attract attention.",
        intent: {
            emotion: "playful_curiosity",
            metaphor: "hidden_object_peek",
            motionEnergy: "medium",
            trustLevel: "medium",
        },
        patches: {
            "catalog-left": {
                layout: {
                    top: 38,
                    left: -160,
                    width: 440,
                    height: 585,
                    rotation: -10,
                },
                animation: {
                    delay: 0,
                    duration: 7.6,
                    tiltA: -4,
                    tiltB: -13,
                    moveUp: -12,
                    moveSide: 8,
                },
            },
            "catalog-right": {
                layout: {
                    top: 300,
                    left: 210,
                    width: 440,
                    height: 575,
                    rotation: 9,
                },
                animation: {
                    delay: 0.85,
                    duration: 7.6,
                    tiltA: 13,
                    tiltB: 5,
                    moveUp: -10,
                    moveSide: -7,
                },
            },
            "next-page-ribbon": {
                layout: {
                    top: 285,
                    left: 160,
                    minWidth: 315,
                    rotation: -3,
                },
                text: "Psst… auf der nächsten Seite",
            },
        },
    },
};