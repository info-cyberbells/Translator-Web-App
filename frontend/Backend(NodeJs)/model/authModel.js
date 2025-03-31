
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    phone: { type: String },
    dateOfBirth: { type: Date },
    gender: { type: String },
    image: { type: String },
    jobTitle: { type: String },
    department: { type: String },
    employmentType: {type: String,
    enum: ['Full-Time', 'Part-Time', 'Contractor'],
    // default: 'Pending'
    },
    startDate: { type: Date },
    endDate: { type: Date },
    workLocation: { type: String,
        enum: ['Onsite', 'Remote', 'Hybrid'],
     }, // Onsite, Remote, Hybrid
    workEmail: { type: String },
    userRole: { type: String }, // Admin, Manager, Staff, etc.
    systemAccessLevel: { type: String },
    assignedTeams: { type: String },
    educationLevel: { type: String },
    certifications: { type: String },
    skills: { type: String },
    languagesSpoken: { type: String },
    employeeId: { type: String },
    salaryOrHourlyRate: { type: Number },
    payrollBankDetails: { type: String }, // Securely stored
    tfnAbn: { type: String },
    workVisaStatus: { type: String },
    emergencyContact: { type: String },
    linkedinProfile: { type: String },
    notesAndComments: { type: String },
    address: { type: String },
    country: { type: String },
    state: { type: String },
    city: { type: String },
    suburb: { type: String },
    pincode: { type: String },
    type: { type: String },
    status: { type: String },
    termAgreement: { type: Boolean },
    attendedBefore: { type: String },
    broughtBy: { type: String },
    faithLevel: { type: String },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    churchId: { type: mongoose.Schema.Types.ObjectId, ref: 'church' } // Reference to Church model
});

const User = mongoose.model('users', UserSchema, 'users');
export default User;
