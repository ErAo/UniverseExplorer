import mongoose, {Schema} from "mongoose";

const layerSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, "name is required"],
            match: [/^[a-z_]+$/, "invalid name"]
        },
        display_name: {
            type: String,
            required: [true, "display name is required"],
            match: [/^[a-zA-Z\s\W]+$/, "invalid display name"]
        },
        radius: {
            type: Number,
            required: [true, "radius is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid radius"]
        },
        opacity: {
            type: Number,
            required: [true, "opacity is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid opacity"]
        },
        texture: {
            type: String,
            required: true,
        },
        rotation_speed: {
            type: Number,
            required: [true, "rotation_speed is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid rotation_speed"]
        },
        description: {
            type: String,
            required: [true, "description is required"],
            match: [/^[^\d]+$/, "invalid description"]
        }
    },
    {
        timestamps: true,
    }
);

const moonSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, "name is required"],
            match: [/^[a-z_]+$/, "invalid name"]
        },
        display_name: {
            type: String,
            required: [true, "display name is required"],
            match: [/^[a-zA-Z\s\W]+$/, "invalid display name"]
        },
        radius: {
            type: Number,
            required: [true, "radius is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid radius"]
        },
        distance: {
            type: Number,
            required: [true, "distance is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid distance"]
        },
        orbit_speed: {
            type: Number,
            required: [true, "orbit_speed is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid orbit_speed"]
        },
        rotation_speed: {
            type: Number,
            required: [true, "rotation_speed is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid rotation_speed"]
        },
        texture: {
            type: String,
            required: true,
        },
        year: {
            type: Number,
            required: [true, "year is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid year"]
        },
        day: {
            type: Number,
            required: [true, "day is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid day"]
        },
        description: {
            type: String,
            required: [true, "description is required"],
            match: [/^[^\d]+$/, "invalid description"]
        }
    },
    {
        timestamps: true,
    }
);

const ringSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, "name is required"],
            match: [/^[a-z_]+$/, "invalid name"]
        },
        display_name: {
            type: String,
            required: [true, "display name is required"],
            match: [/^[a-zA-Z\s\W]+$/, "invalid display name"]
        },
        inside_radius: {
            type: Number,
            required: [true, "inside_radius is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid inside_radius"]
        },
        outside_radius: {
            type: Number,
            required: [true, "outside_radius is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid outside_radius"]
        },
        segments: {
            type: Number,
            required: [true, "segments is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid segments"]
        },
        description: {
            type: String,
            required: [true, "description is required"],
            match: [/^[^\d]+$/, "invalid description"]
        }
    },
    {
        timestamps: true,
    }
);

const planetSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, "name is required"],
            match: [/^[a-z_]+$/, "invalid name"]
        },
        display_name: {
            type: String,
            required: [true, "display name is required"],
            match: [/^[a-zA-Z\s\W]+$/, "invalid display name"]
        },
        radius: {
            type: Number,
            required: [true, "radius is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid radius"]
        },
        texture: {
            type: String,
            required: true,
        }, 
        distance:{
            type: Number,
            required: [true, "center distance is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid center distance"]
        },
        orbit_speed: {
            type: Number,
            required: [true, "orbit_speed is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid orbit_speed"]
        },
        rotation_speed: {
            type: Number,
            required: [true, "rotation_speed is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid rotation_speed"]
        },
        year: {
            type: Number,
            required: [true, "year is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid year"]
        },
        day: {
            type: Number,
            required: [true, "day is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid day"]
        },
        description: {
            type: String,
            required: [true, "description is required"],
            match: [/^[^\d]+$/, "invalid description"]
        },
        layers: [layerSchema],
        moons: [moonSchema],
        rings: [ringSchema]
    },
    {
        timestamps: true,
    }
);

const starSchema = new Schema(
    {
        name: {
            type: String,
            unique: true,
            required: [true, "name is required"],
            match: [/^[a-z_]+$/, "invalid name"]
        },
        display_name: {
            type: String,
            required: [true, "display name is required"],
            match: [/^[a-zA-Z\s\W]+$/, "invalid display name"]
        },
        radius: {
            type: Number,
            required: [true, "radius is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid radius"]
        },
        texture: {
            type: String,
            required: true,
        },
        speed: {
            type: Number,
            required: [true, "speed is required"],
            match: [/^[0-9]+(?:\.[0-9]+)?$/, "invalid speed"]
        },
        description: {
            type: String,
            required: [true, "description is required"],
            match: [/^[^\d]+$/, "invalid description"]
        }
    },
    {
        timestamps: true,
    }
);

const solarSystemSchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: {
            type: String,
            unique: true,
            required: [true, "name is required"],
            match: [/^[a-z_]+$/, "invalid name"]
        },
        display_name: {
            type: String,
            required: [true, "display name is required"],
            match: [/^[a-zA-Z\s\W]+$/, "invalid display name"]
        },
        planets: [planetSchema],
        stars: [starSchema]
    },
    {
        timestamps: true,
    }
);

const SolarSystem = mongoose.models.SolarSystem || mongoose.model("SolarSystem", solarSystemSchema);

export default SolarSystem;