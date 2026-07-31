import React from "react";
import { Link } from "react-router-dom";
import {
    buildInfoCardStyle,
    buildRibbonStyle,
    buildSceneObjectStyle,
} from "../utils/sceneStyle";

function SceneLink({ to, className, style, ariaLabel, children }) {
    if (to) {
        return (
            <Link to={to} className={className} style={style} aria-label={ariaLabel}>
                {children}
            </Link>
        );
    }

    return (
        <div className={className} style={style}>
            {children}
        </div>
    );
}

function CatalogStackScene({ scene }) {
    return (
        <div className="catalog-scene" data-scene-id={scene.id}>
            {scene.objects.map((object) => {
                if (object.type === "image-card") {
                    return (
                        <SceneLink
                            key={object.id}
                            to={object.linkTo}
                            className={`catalog-scene-object ${object.className || ""}`}
                            style={buildSceneObjectStyle(object)}
                            ariaLabel={object.label}
                        >
                            <img src={object.src} alt={object.alt} />
                            <span className="catalog-object-glow" aria-hidden="true" />
                        </SceneLink>
                    );
                }

                if (object.type === "ribbon-link") {
                    return (
                        <Link
                            key={object.id}
                            to={object.linkTo}
                            className={object.className}
                            style={buildRibbonStyle(object)}
                        >
                            {object.text}
                        </Link>
                    );
                }

                if (object.type === "info-card") {
                    return (
                        <div
                            key={object.id}
                            className={object.className}
                            style={buildInfoCardStyle(object)}
                            aria-hidden="true"
                        >
                            <img className="catalog-info-logo" src={object.logo} alt="" />
                            <div className="catalog-info-text">
                                <span>{object.eyebrow}</span>
                                <strong>{object.title}</strong>
                            </div>
                        </div>
                    );
                }

                return null;
            })}
        </div>
    );
}

export default CatalogStackScene;