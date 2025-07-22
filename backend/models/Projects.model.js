import mongoose ,{Schema} from "mongoose";

const projectSchema = new Schema(
    {
        status: {
            type: String,
            enum: ["Not started", "In Progress", "Completed"],
            required: true
        },
        name : {
            type: String,
            required: true,
            unique: true,
        },
        gitHub : {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        techStack: {
            type: [String],
            required: true,
        },
        photo : {
            type: String
        }
    },
    {
        timestamps: true,
    }
)




const Project = mongoose.model("Project", projectSchema);
export default Project;