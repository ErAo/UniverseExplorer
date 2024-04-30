import DB from "../../../../services/database";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

//POST METHOD

export async function POST(request) {
    try {
        //BASIC INFORMATION ABOUT SOLAR SYSTEM
        const { user_id, name, display_name, planets, stars } = await request.json();

        const { SolarSystem } = await DB();

        //CREATE PLANETS
        const processedPlanets = [];
        for (const planetData of planets) {
            const { name, display_name, radius, texture, distance, orbit_speed, rotation_speed, year, day, description, layers, moons, rings } = planetData;

            const createPlanet = {
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

            //CREATE LAYERS MOON RING
            for (const layerData of layers) {
                const createLayer = {
                    name: layerData.name,
                    display_name: layerData.display_name,
                    radius: layerData.radius,
                    opacity: layerData.opacity,
                    texture: layerData.texture,
                    rotation_speed: layerData.rotation_speed,
                    description: layerData.description
                };

                createPlanet.layers.push(createLayer);
            };

            for (const moonData of moons) {
                const createMoon = {
                    name: moonData.name,
                    display_name: moonData.display_name,
                    radius: moonData.radius,
                    distance: moonData.distance,
                    orbit_speed: moonData.orbit_speed,
                    rotation_speed: moonData.rotation_speed,
                    texture: moonData.texture,
                    year: moonData.year,
                    day: moonData.day,
                    description: moonData.description
                };

                createPlanet.moons.push(createMoon);
            };
            
            for (const ringData of rings) {
                const createRing = {
                    name: ringData.name,
                    display_name: ringData.display_name,
                    inside_radius: ringData.inside_radius,
                    outside_radius: ringData.outside_radius,
                    segments: ringData.segments,
                    description: ringData.description
                };

                createPlanet.rings.push(createRing);
            };

            processedPlanets.push(createPlanet);
        };
        
        //CREATE STAR
        const processedStars = [];
        for (const starData of stars){
            const { name, display_name, radius, texture, speed, description } = starData;

            const createStar = {
                name,
                display_name,
                radius,
                texture,
                speed,
                description
            };

            processedStars.push(createStar);
        };

        // CREATE SOLAR SYSTEM
        const createSolarSystem = new SolarSystem({ 
            user_id, 
            name, 
            display_name,
            planets: processedPlanets, 
            stars: processedStars
        });

        const savedSolarSystem = await createSolarSystem.save();

        return NextResponse.json({ message: "Solar System Created", data:savedSolarSystem }, { status: 201 });

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

//GET METHOD

export async function GET(request) {
    try {
        const { SolarSystem } = await DB();

        const user_id = request.nextUrl.searchParams.get("user_id");

        const solarSystemFound = await SolarSystem.find({ user_id });

        return NextResponse.json({ solarSystemFound });

    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            return NextResponse.json(
                {
                    message: error.message,
                },
                {
                    status:400,
                }
            );
        };
        return NextResponse.error();
    };
};

//DELETE METHOD
export async function DELETE(request) {
    try {
        const id = request.nextUrl.searchParams.get("id");

        const { SolarSystem } = await DB();

        await SolarSystem.findByIdAndDelete(id);

        return NextResponse.json({ message: "Solar System Deleted" }, { status: 200 } );

    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidatorError){
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