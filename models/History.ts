import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IHistory extends Document {
  userId: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  episode: string;
  progress: number; // 0 to 100
  image?: string;
  lastWatched: Date;
}

const HistorySchema: Schema = new Schema({
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
  episode: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    default: 0,
  },
  image: {
    type: String,
  },
  watchDurationMinutes: {
    type: Number,
    default: 0,
  },
  lastWatched: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

// Update lastWatched if same user/slug/episode exists
HistorySchema.index({ userId: 1, slug: 1, episode: 1 }, { unique: true });

export const History: Model<IHistory> = mongoose.models.History || mongoose.model<IHistory>('History', HistorySchema);
