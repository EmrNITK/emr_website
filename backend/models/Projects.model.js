import mongoose ,{Schema} from "mongoose";

const ProjectSchema = new Schema(
    {
        Status: {
            type: String,
            enum: ["Not started", "In Progress", "Completed"],
            default: "Not started",
        },
        Name : {
            type: String,
            required: true,
        },
        GitHub : {
            type: String,
            required: true,
        },
        Description: {
            type: String,
            required: true,
        },
        techStack: {
            type: [String],
            required: true,
        },
        photo : {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true,
    }
)




const Project = mongoose.model("Project", ProjectSchema);
export default Project;