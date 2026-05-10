import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IReminder extends Document {
  userId: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  time: string;
  channel: string;
  image?: string;
  createdAt: Date;
}

const ReminderSchema: Schema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
}, {
  timestamps: true,
});

ReminderSchema.index({ userId: 1, slug: 1 }, { unique: true });

export const Reminder: Model<IReminder> = mongoose.models.Reminder || mongoose.model<IReminder>('Reminder', ReminderSchema);
