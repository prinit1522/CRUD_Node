import mongoose from "mongoose";
import bcrypt from "bcrypt";
import crypto from "crypto";

const usersSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      mobile: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
      role: {
        type: String,
        default: "user",
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
      address: {
        type: String,
      },
      refreshToken: {
        type: String,
      },
      passwordChangedAt: Date,
      passwordResetToken: String,
      passwordResetExpires: Date,
    },
    { timestamps: true }
)

usersSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        next();
    }

    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});

usersSchema.methods.isPasswordMatched = async function (enteredPassword:string) {
    return await bcrypt.compare(enteredPassword, this.password)
}

usersSchema.methods.createPasswordResetToken = async function() {
    const resetToken = crypto.randomBytes(32).toString("hex");
    this.passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    this.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    return resetToken; 
}

const UsersProfile= mongoose.model('UsersProfile',usersSchema)
export default UsersProfile



