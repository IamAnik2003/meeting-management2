const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const conn = require("./db/db.connect");
const User = require("./db/User");
const mongoose = require("mongoose");

const app = express();
conn();
dotenv.config();

const port = process.env.PORT || 3050;
const secret = process.env.SECRET_KEY;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to get user by email
const getUserByEmail = async (email) => {
  return await User.findOne({ email }).select('_id firstname lastname');
};

// ============ AUTHENTICATION ROUTES ============
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.post("/api/register", async (req, res) => {
  const { firstname, lastname, email, password } = req.body;
  const userExist = await User.findOne({ email });
  if (userExist) {
    return res.status(400).json({ message: "User already exists" });
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstname,
    lastname,
    email,
    password: hashedPassword,
  });
  await newUser.save();
  res.status(201).json({ message: "User registered successfully" });
});

app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;
  const newuser = await User.findOne({ email });

  if (!newuser) {
    return res.status(404).json({ message: "User not found" });
  }

  const isMatch = await bcrypt.compare(password, newuser.password);
  if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const payload = {
    firstname: newuser.firstname,
    email: newuser.email,
    password: newuser.password,
    username: newuser.username,
  };
  const token = jwt.sign(payload, secret, { expiresIn: "1d" });

  res.status(200).json({
    token,
    fullname: newuser.firstname + " " + newuser.lastname,
    username: newuser.username,
    email: newuser.email,
    userID: newuser._id,
  });
});

app.patch("/api/updateprofile", async (req, res) => {
  const { email, firstname, lastname, password, newEmail } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }
    user.firstname = firstname;
    user.lastname = lastname;
    user.email = newEmail;
    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.post("/api/tell-us-yourname", async (req, res) => {
  try {
    const { email, username, category } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists. Please choose a different username.",
      });
    }

    const loggedUser = await User.findOne({ email });
    if (!loggedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    loggedUser.username = username;
    loggedUser.category = category;
    await loggedUser.save();

    res.status(200).json({ message: "Data saved successfully!" });
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).json({ message: "An error occurred while saving data." });
  }
});

// ============ EVENT MANAGEMENT ROUTES ============

// Create event with participant status tracking
app.post("/api/events", async (req, res) => {
  try {
    const { 
      userId,
      eventTopic,
      hostName,
      description,
      date,
      time,
      ampm,
      timezone,
      duration,
      bannerColor,
      meetingLink,  // Changed from 'link' to match frontend
      participants, // Now expecting array from frontend
      password,
      teamName,
      dateTime      // Added to accept ISO string from frontend
    } = req.body;

    // Validate required fields
    const requiredFields = {
      userId: "User ID",
      eventTopic: "Event topic",
      hostName: "Host name",
      dateTime: "Date and time",
      timezone: "Timezone",
      duration: "Duration",
      meetingLink: "Meeting link"
    };

    const missingFields = Object.entries(requiredFields)
      .filter(([field]) => !req.body[field])
      .map(([_, name]) => name);

    if (missingFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Verify user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Process participants - ensure host is included and marked
    const processedParticipants = participants.map(p => ({
      email: p.email,
      status: p.isHost ? 'host' : 'pending',
      userId: p.isHost ? userId : null
    }));

    // Create new event object
    const newEvent = {
      eventTopic,
      hostName,
      description: description || "",
      dateTime: new Date(dateTime), // Use ISO string from frontend
      timezone,
      duration: Number(duration),
      bannerColor: bannerColor || "#342B26",
      meetingLink,
      participants: processedParticipants,
      password: password || "",
      teamName: teamName || "Team A Meeting-1",
      createdBy: userId,
      status: 'active',
      createdAt: new Date()
    };

    // Add to user's events
    const result = await User.findByIdAndUpdate(
      userId,
      { $push: { events: newEvent } },
      { new: true }
    );

    // Get the newly added event (last one in array)
    const createdEvent = result.events[result.events.length - 1];

    res.status(201).json({ 
      message: "Event created successfully",
      event: createdEvent
    });

  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ 
      message: "Error creating event", 
      error: error.message 
    });
  }
});

app.get("/api/users/:userId/bookingevents", async (req, res) => {
  try {
    const userId = req.params.userId;
    
    // Get user data
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // 1. Get hosted events (events where user is the host)
    const hostedEvents = await User.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      { $unwind: "$events" },
      {
        $lookup: {
          from: "users",
          localField: "events.participants.userId",
          foreignField: "_id",
          as: "participantDetails"
        }
      },
      {
        $addFields: {
          "events.participants": {
            $map: {
              input: "$events.participants",
              as: "participant",
              in: {
                $mergeObjects: [
                  "$$participant",
                  {
                    userDetails: {
                      $arrayElemAt: [
                        "$participantDetails",
                        {
                          $indexOfArray: [
                            "$participantDetails._id",
                            "$$participant.userId"
                          ]
                        }
                      ]
                    }
                  }
                ]
              }
            }
          }
        }
      },
      { $replaceRoot: { newRoot: "$events" } }
    ]);

    // 2. Get participant events (events where user is a participant but not host)
    const allParticipantEvents = await User.aggregate([
      { $match: { "events.participants.email": user.email } },
      { $unwind: "$events" },
      {
        $match: {
          "events.createdBy": { $ne: new mongoose.Types.ObjectId(userId) },
          "events.participants": {
            $elemMatch: {
              $or: [
                { userId: new mongoose.Types.ObjectId(userId) },
                { email: user.email }
              ]
            }
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "events.createdBy",
          foreignField: "_id",
          as: "hostDetails"
        }
      },
      {
        $addFields: {
          "events.hostDetails": { $arrayElemAt: ["$hostDetails", 0] },
          "events.participationStatus": {
            $let: {
              vars: {
                participant: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$events.participants",
                        as: "p",
                        cond: {
                          $or: [
                            { $eq: ["$$p.userId", new mongoose.Types.ObjectId(userId)] },
                            { $eq: ["$$p.email", user.email] }
                          ]
                        }
                      }
                    },
                    0
                  ]
                }
              },
              in: "$$participant.status"
            }
          }
        }
      },
      { $replaceRoot: { newRoot: "$events" } }
    ]);

    // 3. Update user's participantEvents array (only with new events)
  // 3. Update user's participantEvents array (only with new events)
if (allParticipantEvents.length > 0) {
  const newParticipantEvents = allParticipantEvents.filter(event => 
    !user.participantEvents.some(pe => pe._id.equals(event._id))
  ).map(event => ({
    ...event,
    participationStatus: event.participationStatus
  }));

  if (newParticipantEvents.length > 0) {
    await User.updateOne(
      { _id: userId },
      { $addToSet: { participantEvents: { $each: newParticipantEvents } } }
    );
  }
}
    // 4. Get the updated participantEvents from the user document
    const updatedUser = await User.findById(userId);
    console.log(updatedUser.participantEvents)
    
    res.status(200).json({
      hostedEvents,
      participantEvents: updatedUser.participantEvents
    });

  } catch (error) {
    console.error("Error getting booking events:", error);
    res.status(500).json({ 
      message: "Error getting booking events",
      error: error.message 
    });
  }
});
// Get all events with optional filtering (maintains backward compatibility)
app.get("/api/users/:userId/events", async (req, res) => {
  try {
    const { status } = req.query;
    const now = new Date();
    const userId = req.params.userId;

    // Original behavior when no status filter is provided
    if (!status) {
      const user = await User.findById(userId).select("events");
      if (!user) return res.status(404).json({ message: "User not found" });
      return res.status(200).json(user.events);
    }

    // New filtering behavior when status is specified
    let eventsFilter = {};
    
    switch (status) {
      case 'upcoming':
        eventsFilter = {
          'dateTime': { $gt: now },
          'status': 'active',
          'participants': {
            $elemMatch: {
              $or: [
                { userId: new mongoose.Types.ObjectId(userId), status: 'accepted' },
                { userId:new mongoose.Types.ObjectId(userId), status: 'host' }
              ]
            }
          }
        };
        break;
      
      case 'pending':
        eventsFilter = {
          'dateTime': { $gt: now },
          'participants': {
            $elemMatch: {
              userId: new mongoose.Types.ObjectId(userId),
              status: 'pending'
            }
          }
        };
        break;
      
      case 'canceled':
        eventsFilter = {
          $or: [
            { 'status': 'canceled' },
            { 
              'participants': {
                $elemMatch: {
                  userId:new mongoose.Types.ObjectId(userId),
                  status: 'rejected'
                }
              }
            }
          ]
        };
        break;
      
      case 'past':
        eventsFilter = { 'dateTime': { $lt: now } };
        break;
      
      default:
        return res.status(400).json({ message: "Invalid status filter" });
    }

    const user = await User.findOne(
      { _id: userId },
      { events: { $elemMatch: eventsFilter } }
    ).populate({
      path: 'events',
      populate: [
        { path: 'createdBy', select: 'firstname lastname email' },
        { path: 'participants.userId', select: 'firstname lastname email' }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user.events || []);
  } catch (error) {
    console.error("Error getting events:", error);
    res.status(500).json({ message: "Error getting events" });
  }
});

// Update event
app.put("/api/events/:eventId", async (req, res) => {
  try {
    const { userId, ...updateData } = req.body;
    
    if (updateData.dateTime) {
      updateData.dateTime = new Date(updateData.dateTime);
    }

    // Get the existing event first to preserve createdBy
    const user = await User.findOne({ _id: userId, "events._id": req.params.eventId });
    if (!user) {
      return res.status(404).json({ message: "User or event not found" });
    }

    const existingEvent = user.events.id(req.params.eventId);
    if (!existingEvent) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Preserve the createdBy field from the existing event
    updateData.createdBy = existingEvent.createdBy || userId;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "events._id": req.params.eventId },
      { $set: { "events.$": { ...existingEvent.toObject(), ...updateData } }},
      { new: true }
    );

    res.status(200).json({ 
      message: "Event updated successfully",
      event: updatedUser.events.id(req.params.eventId)
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ message: "Error updating event" });
  }
});
// Update event status (active/inactive)
app.patch("/api/events/:eventId/status", async (req, res) => {
  try {
    const { userId, isActive } = req.body;
    const eventId = req.params.eventId;

    // Validate input
    if (!userId || typeof isActive !== 'boolean') {
      return res.status(400).json({ message: "Invalid request data" });
    }

    // Find and update the event
    const result = await User.findOneAndUpdate(
      { 
        _id: userId,
        "events._id": eventId 
      },
      { 
        $set: { 
          "events.$.isActive": isActive 
        } 
      },
      { new: true }
    );

    if (!result) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Find the updated event to return
    const updatedEvent = result.events.find(e => e._id.toString() === eventId);
    
    res.status(200).json({ 
      message: "Event status updated successfully",
      event: updatedEvent
    });
  } catch (error) {
    console.error("Error updating event status:", error);
    res.status(500).json({ 
      message: "Error updating event status",
      error: error.message 
    });
  }
});

// Delete event
app.delete("/api/events/:eventId", async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await User.updateOne(
      { _id: userId },
      { $pull: { events: { _id: req.params.eventId } } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({ message: "Error deleting event" });
  }
});

app.patch('/api/users/:userId/participant-events/:eventId', async (req, res) => {
  try {
    const { userId, eventId } = req.params;
    const { participationStatus } = req.body;

    // Update in participant's events array
    await User.updateOne(
      { 
        _id: userId,
        "participantEvents._id": eventId 
      },
      { 
        $set: { 
          "participantEvents.$.participationStatus": participationStatus 
        } 
      }
    );

    // Also update in host's events participants array
    await User.updateOne(
      { 
        "events._id": eventId,
        "events.participants.email": req.user.email 
      },
      { 
        $set: { 
          "events.$.participants.$.status": participationStatus 
        } 
      }
    );

    // Return updated participant events
    const user = await User.findById(userId);
    res.status(200).json(user.participantEvents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET user by email
app.get('/api/users/by-email', async (req, res) => {
  try {
    const { email } = req.query;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email }).select('firstname lastname');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      fullName: `${user.firstname} ${user.lastname || ''}`.trim(),
      firstname: user.firstname,
      lastname: user.lastname || ''
    });
  } catch (error) {
    console.error('Error finding user by email:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// In your user routes file
app.patch('/api/users/:userId/categorized-events',async (req, res) => {
  console.log("hit")
  try {
    const { upcoming, pending, canceled, past } = await  req.body;
    
    const userId = req.params.userId;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          upcoming,
          pending,
          canceled,
          past
        }
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
