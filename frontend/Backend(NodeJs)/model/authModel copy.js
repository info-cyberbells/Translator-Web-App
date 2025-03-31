import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({

    firstName: { type: String},
    lastName: { type: String},
    email: { type: String, unique: true },
    password: { type: String},
    address: { type: String, },
    country: { type: String,  },
    phone: { type: String,  },
    pincode: { type: String,  },
    state: { type: String,  },
    city: { type: String,  },
    suburb: { type: String,  },
    type: { type: String,  },
    image: { type: String,  },
    status: { type: String,  },
    termAgreement: { type: Boolean,  },
    attendedBefore: { type: String,  },
    broughtBy: { type: String,  },
    faithLevel: { type: String,  },
    // resetPasswordToken: String,
    // resetPasswordExpires: Date,

    created_at: { type: Date, default: Date.now },              // Timestamp for user creation
    updated_at: { type: Date, default: Date.now },  
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'church' } // Reference to Church model
});

const User = mongoose.model('users', UserSchema, 'users');
export default User;
