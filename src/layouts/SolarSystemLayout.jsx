'use client';

import React, { useState, useEffect } from 'react';
import SolarSystem from '../components/SolarSystem';
import systemSolar from '../mocks/solar_system.json';
import EditMenu from '../components/EditMenu';
import * as Icon from 'react-feather';
import { useSession } from "next-auth/react";
import { set } from 'mongoose';

export default function SolarSystemLayout({ model }) {
    const [solarSystemDB, setSolarSystemDB] = useState({});
    const [isPreview, setIsPreview] = useState(false);
    const [threeConfig, setThreeConfig] = useState(null);
    const { data: session } = useSession();

    const renderCanvas = (getConfig) => {
        setThreeConfig(getConfig())
    }

    const saveSystem = (e) => {
        fetch(`http://localhost:3000/api/solarSytstem/${solarSystemDB._id}`, {
            method: 'PUT',
            header: {
                'Content-type': 'application/json',
            },
            body: JSON.stringify({ ...solarSystemDB })
        })
            .then(res => res.json())
            .then(data => {
                setSolarSystemDB({ ...solarSystemDB, ...data })
            })
            .catch(err => {
                console.log(err.message)
                //throw new Error(err.message || "Error to save")
            });
    }

    const handleSystemChange = (newSystem) => {
        setSolarSystemDB({ ...solarSystemDB, ...newSystem.formData });
    }

    const openModal = () => {
        if (threeConfig) threeConfig.setLocalSolarSystem({ ...solarSystemDB });
        setIsPreview(true);
    }

    const closeModal = () => {
        threeConfig.setThreeScene(false);
        setIsPreview(false);
    }

    useEffect(() => {
        if (solarSystemDB._id || !model) return;
        fetch(`http://localhost:3000/api/solarSytstem/${model}`, {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => {
                setSolarSystemDB(data)
            })
            .catch(err => {
                console.log(err.message)
            });
    }, [])

    return (
        <>
            <EditMenu openModal={openModal} isPreview={isPreview} formData={solarSystemDB} handleChange={handleSystemChange} saveSystem={saveSystem} schema={systemSolar} />
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
