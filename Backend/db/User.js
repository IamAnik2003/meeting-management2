const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
    participantEvents: [ParticipantEventSchema] // Events where user is participant
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

module.exports = mongoose.model("User", UserSchema);