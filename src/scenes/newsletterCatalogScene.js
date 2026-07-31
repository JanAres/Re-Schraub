export function createNewsletterCatalogScene({ katalogPreview, produktPreview, logo }) {
    return {
        id: "newsletter-catalog-discovery",
        route: "/katalog",

        intent: {
            emotion: "curiosity",
            metaphor: "hidden_next_page",
            style: "technical_premium",
            motion: "rare_staggered_peek",
            designPhysics: {
                structure: "clean_form_right",
                expressiveLayer: "hidden_catalog_stack_left",
                motionEnergy: "low_but_noticeable",
                trustAnchor: "stable_newsletter_form",
                curiosityTrigger: "partly_cut_off_next_page",
            },
        },

        objects: [
            {
                id: "catalog-left",
                type: "image-card",
                src: katalogPreview,
                alt: "RE-Schraub Katalog",
                linkTo: "/katalog",
                label: "Zum Katalog",
                className: "catalog-object catalog-object--left",

                layout: {
                    top: 48,
                    left: -118,
                    width: 410,
                    height: 550,
                    zIndex: 2,
                    rotation: -8,
                },

                animation: {
                    type: "peek-glow",
                    duration: 8.8,
                    delay: 0,
                    tiltA: -5,
                    tiltB: -10,
                    moveUp: -8,
                    moveSide: 5,
                },

                glow: {
                    color: "rgba(112, 215, 255, 0.92)",
                    soft: "rgba(104, 210, 255, 0.32)",
                    strong: "rgba(190, 244, 255, 0.72)",
                },
            },

            {
                id: "catalog-right",
                type: "image-card",
                src: produktPreview,
                alt: "RE-Schraub Katalog Vorschau",
                linkTo: "/katalog",
                label: "Katalog entdecken",
                className: "catalog-object catalog-object--right",

                layout: {
                    top: 305,
                    left: 185,
                    width: 400,
                    height: 530,
                    zIndex: 3,
                    rotation: 7,
                },

                animation: {
                    type: "peek-glow",
                    duration: 8.8,
                    delay: 1.08,
                    tiltA: 10,
                    tiltB: 4,
                    moveUp: -7,
                    moveSide: -4,
                },

                glow: {
                    color: "rgba(112, 215, 255, 0.92)",
                    soft: "rgba(104, 210, 255, 0.32)",
                    strong: "rgba(190, 244, 255, 0.72)",
                },
            },

            {
                id: "next-page-ribbon",
                type: "ribbon-link",
                text: "Auf der nächsten Seite",
                linkTo: "/katalog",
                className: "catalog-ribbon",

                layout: {
                    top: 292,
                    left: 148,
                    minWidth: 285,
                    zIndex: 6,
                    rotation: -2,
                },
            },

            {
                id: "newsletter-info-card",
                type: "info-card",
                logo,
                eyebrow: "Der Newsletter",
                title: "Alles bereit auf einen Blick nach einem Klick",
                className: "catalog-info-card",

                layout: {
                    top: 590,
                    left: 48,
                    width: 355,
                    minHeight: 145,
                    zIndex: 5,
                    rotation: -5,
                },
            },
        ],
    };
}