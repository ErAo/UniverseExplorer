'use client';

import React, { useState } from 'react';
import SolarSystem from '../components/SolarSystem';
import systemSolar from '../mocks/solar_system.json';
import EditMenu from '../components/EditMenu';
import * as Icon from 'react-feather';

export default function SolarSystemLayout() {
    const [solarSystemDB, setSolarSystemDB] = useState(systemSolar);
    const [isPreview, setIsPreview] = useState(false);
    const [threeConfig, setThreeConfig] = useState(null);

    const renderCanvas = (getConfig) => {
        setThreeConfig(getConfig())
    }

    const saveSystem = () => {
        if (threeConfig) {
            threeConfig.setThreeScene(false);
            threeConfig.setLocalSolarSystem({ ...solarSystemDB });
        }
    }

    const handleSystemChange = (newSystem) => {
        setSolarSystemDB(newSystem.formData);
    }

    const openModal = () => {
        if (threeConfig) threeConfig.setLocalSolarSystem({ ...solarSystemDB });
        setIsPreview(true);
    }

    const closeModal = () => {
        threeConfig.setThreeScene(false);
        setIsPreview(false);
    }

    return (
        <>
            <EditMenu openModal={openModal} isPreview={isPreview} handleChange={handleSystemChange} saveSystem={saveSystem} schema={systemSolar} />
            {isPreview && (
                <div className="modal">
                    <div className="modal__content">
                        <button onClick={closeModal} className='modal__close'>
                            <Icon.X />
                        </button>
                        <SolarSystem cta={renderCanvas} solarSystemDB={solarSystemDB} />
                    </div>
                </div>
            )}
        </>
    );
}
