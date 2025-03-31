import mongoose from 'mongoose';

const jesusClickSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'users',
    
    },
    sermonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'sermon',

    },
    jesusClicked: {
      type: String,
   
    },
    count: {
        type: Number,
        default: 0, // ✅ Start with 0
      },
  },
  { timestamps: true }
);

const JesusClick = mongoose.model('JesusClick', jesusClickSchema);

export default JesusClick;
