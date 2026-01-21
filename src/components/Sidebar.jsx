import React from 'react';
import partsData from '../data/parts.json';

const Sidebar = ({ onSelectPart, selectedParts, onTakeScreenshot }) => {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h1>AR-15 BUILDER</h1>
                <p>3D Airsoft Configurator</p>
            </div>

            <div className="sidebar-sections">
                {Object.entries(partsData.categories).map(([key, category]) => (
                    <div key={key} className="category-section">
                        <h3>{category.name}</h3>
                        <div className="parts-grid">
                            {category.parts.map(part => (
                                <div
                                    key={part.id}
                                    className={`part-card ${selectedParts[key]?.id === part.id ? 'active' : ''}`}
                                    onClick={() => onSelectPart(key, part)}
                                >
                                    <div className="part-name">{part.name}</div>
                                    <div className="part-desc">{part.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="sidebar-footer">
                <button className="btn-screenshot" onClick={onTakeScreenshot}>TAKE SCREENSHOT</button>
            </div>
        </div>
    );
};

export default Sidebar;
