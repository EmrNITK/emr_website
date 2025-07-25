import mongoose from 'mongoose';

const SponsorSchema = new mongoose.Schema(
    {
    title : {
        type: String,
        required : true,
        unique: true,
    },
    sponsorlogo : {
        type: String,
        required : true,
    },
    description : {
        type:String,
        required:true,
    }
    },
    {
        timestamps: true,
    }
)

const Sponsor = mongoose.model('Sponsor', SponsorSchema);

export default Sponsor;