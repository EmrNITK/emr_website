import asyncHandler from "../utils/asyncHandler.js";
import Event from "../models/Event.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import User from "../models/User.model.js";


export const createEvent = asyncHandler(async (req, res) => {
    const userId = req.userId;
    
    const user = await User.findById(userId);
    if(!user.isAdmin){
      return res
      .status(403)
      .json({ message: "You do not have permission to create an event" });
    }

    const {name , date , venue , numberOfMember , description , ruleBook, amount ,title ,link ,isLive} = req.body;

    const existedEvent = await Event.findOne({name: name});
    if(existedEvent){
        return res
        .status(400)
        .json({success: false, message: "Event already exists" });
    }

    if(!(name && date && venue && numberOfMember && description )){
        return res
        .status(400)
        .json({message:"All field are required"});
    }

    // if([name,date,venue,numberOfMember,description].some((field) => field?.trim() === "")){
    //       return res.
    //       status(400)
    //       .json({message:"All fields are required"})
    //   }

    // qr code and image upload
    const posterLocalPath = req.files?.poster[0]?.path;
    if(!posterLocalPath){
        return res
        .status(400)
        .json({message:"poster is required"})
    }

    let qrCodeLocalPath;
    if(req.files && Array.isArray(req.files.qrCode) && req.files.qrCode.length > 0){
        qrCodeLocalPath = req.files.qrCode[0].path
    }

    const cloudinaryPosterPath = await uploadOnCloudinary(posterLocalPath);
    const cloudinaryQrCodePath = await uploadOnCloudinary(qrCodeLocalPath);

    const event = await Event.create({
        name: name ,
        date: date ,
        venue: venue ,
        numberOfMember: numberOfMember ,
        description: description ,
        ruleBook: ruleBook ,
        poster: cloudinaryPosterPath?.url ,
        qrCode: cloudinaryQrCodePath?.url || "",
        amount: amount,
        title: title,
        link: link,
        isLive: isLive,
    })

    const registerEvent = await event.save();
    return res
    .status(201)
    .json(registerEvent)
})

export const getAllEvent = asyncHandler (async (req,res) => {
  
    const events = await Event.find({});

    if (events.length === 0) {
      return res
      .status(404)
      .json({ message: 'No events found' });
    }

    res
    .status(200)
    .json({message:"Event Found",events});
  })

export const getEventById = asyncHandler(async (req, res) => {
      const eventId = req.params.userId

      const event = await Event.findById(eventId)
      if (!event) {
        return res
        .status(404)
        .json({ message: 'Event not found' });
      }
      res
      .status(200)
      .json({message:"Event found" , event });
    });

export const updateEventById = async (req, res) => { 
    const eventId = req.params.eventId
    const userId = req.userId
    const user = await User.findById(userId)
    
    if(!user.isAdmin){
        return res
        .status(403)
        .json({message:"You do not have permission to update this event"})
    }

    const {name , date , venue , numberOfMember , description} = req.body

    const isPresent = await Event.findOne({ name: name });

    if(isPresent){
        return res
        .status(404)
        .json({message:"Event name already exists" })
    }

    const updatedEvent = await Event.updateMany(
        { _id: eventId }, // condition to find documents
        { 
          $set: {
            name: name,
            date: date,
            venue: venue,
            numberOfMember: numberOfMember,
            description: description
          }
        }
    )

    if (updatedEvent.modifiedCount > 0) {
        res
        .status(200)
        .json({message:"Event updated" , updatedEvent});
    };

    res
    .status(500)
    .json({message:"Unable to update"})
}

export const deleteEventById = async (req, res) => {
    const userId = req.userId
    const eventId = req.params.eventId

    const event = await Event.findById(eventId)
    if(!event){
        return res
        .status(404)
        .json({message:"Event not found"})
    }

    const user = await User.findById(userId)
   
    if(!user.isAdmin){
        return res
        .status(403)
        .json({message:"You do not have permission to delete this event"})
    }

    await Event.findByIdAndDelete(eventId);

    res
    .status(200)
    .json({message:"Event deleted successfully"})
}