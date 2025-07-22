import mongoose ,{Schema} from "mongoose";

const projectSchema = new Schema(
    {
        Status: {
            type: String,
            enum: ["Not started", "In Progress", "Completed"],
            required: true
        },
        Name : {
            type: String,
            required: true,
            unique: true,
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
            type: String
        }
    },
    {
        timestamps: true,
    }
)




const Project = mongoose.model("Project", projectSchema);
export default Project;