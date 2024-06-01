import { NextResponse } from "next/server";
import DB from "../../../../../services/database";
import mongoose from "mongoose";

//GET METHOD BY ID
export async function GET(request, { params }) {
    try {
        const { id } = params;

        const { SolarSystem } = await DB();

        const solarSystemFound = await SolarSystem.findOne({ _id: id });

        return NextResponse.json(solarSystemFound, { status: 200 });

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

        const { name, display_name, planets, stars } = await request.json();

        const { SolarSystem } = await DB();

        //UPDATE PLANETS
        const putProcessedPlanets = [];
        for (const planetData of planets) {
            const { name, display_name, radius, texture, distance, orbit_speed, rotation_speed, year, day, description, layers, moons, rings } = planetData;

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
                const { name, display_name, radius, opacity, texture, rotation_speed, description } = layerData;
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
                const { name, display_name, radius, distance, orbit_speed, rotation_speed, texture, year, day, description } = moonData;
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
                const { name, display_name, inside_radius, outside_radius, segments, description } = ringData;
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
        for (const starData of stars) {
            const { name, display_name, radius, texture, put_speed: speed, description } = starData;

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

        return NextResponse.json({ message: "Solar System Updated", data: putSolarSystem }, { status: 200 })

    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
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