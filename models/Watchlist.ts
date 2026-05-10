import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IWatchlist extends Document {
  userId: mongoose.Types.ObjectId;
  slug: string;
  title: string;
  createdAt: Date;
}

const WatchlistSchema: Schema = new Schema({
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
}, {
  timestamps: true,
});

// Ensure a user can only add a drama to their watchlist once
WatchlistSchema.index({ userId: 1, slug: 1 }, { unique: true });

export const Watchlist: Model<IWatchlist> = mongoose.models.Watchlist || mongoose.model<IWatchlist>('Watchlist', WatchlistSchema);
