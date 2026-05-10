import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IDramaView extends Document {
  slug: string;
  views: number;
}

const DramaViewSchema: Schema = new Schema({
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  views: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

export const DramaView: Model<IDramaView> = mongoose.models.DramaView || mongoose.model<IDramaView>('DramaView', DramaViewSchema);
