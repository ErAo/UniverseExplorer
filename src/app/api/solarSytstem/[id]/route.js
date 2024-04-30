import { NextResponse } from "next/server";
import DB from "../../../../../services/database";
import mongoose from "mongoose";

//GET METHOD BY ID
export async function GET(request, { params }) {
    try {
        const { id } = params;
        
        const { SolarSystem } = await DB();
        
        const solarSystemFound = await SolarSystem.findOne({ _id: id });
       
        return NextResponse.json({ solarSystemFound }, { status:200 });

    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                {
                    message: error.message,
                },
                {
                    status: 400,
                }
            );
        };
        return NextResponse.error();
    };
};


//PUT METHOD BY ID
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        
        const { put_name: name, put_display_name: display_name,  put_planets: planets, put_stars: stars} = await request.json();
        
        const { SolarSystem } = await DB();

        //UPDATE PLANETS
        const putProcessedPlanets = [];
        for (const planetData of planets) {
            const { put_name: name, put_display_name: display_name, put_radius: radius, put_texture: texture, put_distance: distance, put_orbit_speed: orbit_speed, put_rotation_speed: rotation_speed, put_year: year, put_day: day, put_description: description, put_layers: layers, put_moons: moons, put_rings: rings } = planetData;

            const putPlanet = {
                name, 
                display_name,
                radius,
                texture,
                distance,
                orbit_speed,
                rotation_speed,
                year,
                day, 
                description,
                layers: [], 
                moons: [],
                rings: []
            };

            // PUT LAYERS
            for (const layerData of layers) {
                const { put_name: name, put_display_name: display_name, put_radius: radius, putOpacity: opacity, put_texture:texture, put_rotation_speed: rotation_speed, put_description: description } = layerData;
                const putLayer = {
                    name,
                    display_name,
                    radius,
                    opacity,
                    texture,
                    rotation_speed,
                    description
                };

                putPlanet.layers.push(putLayer);
            };

            // PUT MOONS
            for (const moonData of moons) {
                const { put_name:name,  put_display_name: display_name, put_radius:radius, put_distance: distance, put_orbit_speed: orbit_speed, put_rotation_speed: rotation_speed, put_texture:texture,  put_year: year, put_day: day, put_description: description } = moonData;
                const putMoon = {
                    name,
                    display_name,
                    radius,
                    distance,
                    orbit_speed,
                    rotation_speed,
                    texture,
                    year,
                    day,
                    description
                };

                putPlanet.moons.push(putMoon);
            };
            //PUT RINGS
            for (const ringData of rings) {
                const { put_name:name,  put_display_name: display_name, put_inside_radius:inside_radius, put_outside_radius: outside_radius, put_segments:segments, put_description: description } = ringData;
                const putRing = {
                    name,
                    display_name,
                    inside_radius,
                    outside_radius,
                    segments,
                    description
                };
                
                putPlanet.rings.push(putRing);
            };

            putProcessedPlanets.push(putPlanet);
        };

        //UPDATE STARS 
        const putProcessedStars = [];
        for (const starData of stars){
            const { put_name: name, put_display_name: display_name, put_radius: radius, put_texture: texture, put_speed: speed, put_description: description } = starData;

            const putStar = {
                name,
                display_name,
                radius,
                texture,
                speed,
                description
            };

            putProcessedStars.push(putStar);
        };

        //UPDATE SOLAR SYSTEM 
        const putSolarSystem = await SolarSystem.findByIdAndUpdate(id, {
            name,
            display_name,
            planets: putProcessedPlanets,
            stars: putProcessedStars
        }, { new: true });

        return NextResponse.json({ message: "Solar System Updated", data: putSolarSystem }, { status:200 })

    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError){
            return NextResponse.json(
                {
                    message: error.message,
                },
                {
                    status: 400
                }
            );
        };
        return NextResponse.error();
    };
};