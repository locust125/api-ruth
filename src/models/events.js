import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export const eventsSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        dateTime: {
            type: Date,
            required: true
        },
        statusAssist:{
            type:Number,
            default:0
        },
        description: {
            type: String
        },
        guests: [{ type: String }],
        price: {
            type: Number,
            required: true
        },
        location: {
            type: {
                type: String, // 'Point'
                enum: ['Point'], // 'location.type' must be 'Point'
                required: true
            },
            coordinates: {
                type: [Number],
                required: true
            }
        },
        // eventos que se tienen activos, inactivos, cancelados, y que ya concluyeron
        status: {
            type: String,
            enum: ["active", "inactive", "canceled", "completed"],
            default: "active"
        },
    },
    {
        versionKey: false,
        timestamps: true,
    }
);

eventsSchema.index({ location: "2dsphere" });
eventsSchema.plugin(mongoosePaginate);

export default model("Eventos", eventsSchema);



// {
//     "name": "Como ganar en dolares",
//     "date_time": "2024-08-15T18:00:00Z",
//     "description": "Aprende a ganar en dolares hoy mismo",
//     "guests": ["Develoteca"],
//     "cost": 600,
//     "location": {
//       "type": "Point",
//       "coordinates": [-77.0369, 38.9072]
//     }
//   }
  