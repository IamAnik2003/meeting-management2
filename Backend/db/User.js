const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Availability Timing Schema
const TimingSchema = new Schema({
  from: { type: String, required: true }, // Format: "HH:MM" (e.g., "09:00")
  to: { type: String, required: true }    // Format: "HH:MM" (e.g., "17:00")
}, { _id: false });

// Day Availability Schema
const DayAvailabilitySchema = new Schema({
  day: { 
    type: String, 
    required: true,
    enum: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  },
  available: { type: Boolean, default: false },
  timings: [TimingSchema]
}, { _id: false });

// Participant Schema
const ParticipantSchema = new Schema({
  email: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'host'],
    default: 'pending'
  }
}, { _id: false });

// Base Event Schema (common fields)
const BaseEventSchema = new Schema({
  eventTopic: { type: String, required: true },
  hostName: { type: String, required: true },
  description: { type: String },
  dateTime: { type: Date, required: true },
  timezone: { type: String, required: true },
  duration: { type: Number, required: true },
  bannerColor: { type: String, default: "#342B26" },
  meetingLink: { type: String, required: true },
  participants: [ParticipantSchema],
  password: { type: String },
  isActive: { type: Boolean, default: true },
  teamName: { type: String },
  createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, { _id: true });

// Event Schema (for events where user is host/creator)
const EventSchema = BaseEventSchema;

// Participant Event Schema (for events where user is participant)
const ParticipantEventSchema = BaseEventSchema.clone();
ParticipantEventSchema.add({
  participationStatus: {
    type: String,
    enum: ['pending', 'accepted', 'rejected']
  },
  // You can add more participant-specific fields here if needed
});

// User Schema
const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String },
    email: { 
      type: String, 
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: { type: String, required: true },
    username: { type: String, unique: true, sparse: true },
    profileImage: { type: String },
    bio: { type: String },
    category: { type: String },
    events: [EventSchema], // Events where user is host
    participantEvents: [ParticipantEventSchema], // Events where user is participant
    // New availability fields
    availability: {
      timezone: { 
        type: String, 
        default: "Indian Time Standard" 
      },
      weeklyHours: [DayAvailabilitySchema],
      lastUpdated: { type: Date }
    }
  },
  { 
    timestamps: true,
    toJSON: { 
      transform: function(doc, ret) {
        delete ret.password;
        delete ret.__v;
        return ret;
      }
    } 
  }
);

// Indexes
UserSchema.index({ 'events.dateTime': 1 });
UserSchema.index({ 'participantEvents.dateTime': 1 });
UserSchema.index({ 'events.participants.email': 1 });
UserSchema.index({ 'participantEvents.participants.email': 1 });
UserSchema.index({ 'availability.weeklyHours.day': 1 });

module.exports = mongoose.model("User", UserSchema);