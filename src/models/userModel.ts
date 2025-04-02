import mongoose from 'mongoose'

export interface IUser{
    username: string,
    email: string,
    password: string, 
    isVerified:boolean,
    isAdmin: boolean,
    verifyEmailToken?: string,
    verifyEmailDeadline?: Date,
    forgotPasswordToken?: string,
    forgotPasswordDeadline?: Date,
    invoices : [{type: mongoose.Schema.Types.ObjectId, ref:'Invoice'}]
}

const userSchema = new mongoose.Schema({
    username : {
        type:String,
        required: [true, 'Provide Username'],
        unique: true,
    },
    email : {
        type:String,
        required: [true, 'Provide Email'],
        unique: true,
    },
    password:{
        type: String, 
        required: [true, 'Provide Passord'],
    },
    isVerified:{
       type: Boolean,
       default:false
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    verifyEmailToken: String,
    verifyEmailDeadline: Date,
    forgotPasswordToken: String,
    forgotPasswordDeadline: Date,
    invoices : [{type: mongoose.Schema.Types.ObjectId, ref:'Invoice'}]
},{timestamps:true});

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;