import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
import User from '@/models/userModel';
export async function sendMail({email, emailType, userId} : {email: string, emailType: string, userId : string}) {
    try {
    const hashedToken = await bcryptjs.hash(userId.toString(), 10);
    
    if(emailType === 'VERIFY') {
        await User.findByIdAndUpdate(userId,{
            verifyEmailToken : hashedToken,
            verifyEmailDeadline : Date.now() + 3600000
        })
    } else if (emailType === 'RESETPASSWORD') {
        await User.findByIdAndUpdate(userId,{
            forgotPasswordToken : hashedToken,
            forgotPasswordDeadline : Date.now() + 3600000
        })
    }

        const transporter = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth:{
                user : process.env.MAILTRAP_USERID,
                pass: process.env.MAILTRAP_PASSWORD
            } 
        })
        
        const mailOptions = {
            from : 'ashudhokle100@gmail.com',
            to : email,
            subject: emailType === 'VERIFY' ? 'verify email' : 'reset password',
            html:`<p>Click <a href="${process.env.DOMAIN}/${emailType === 'VERIFY' ? 'verifyemail' : 'resetpassword'}?token=${hashedToken}">here</a> to ${emailType === "VERIFY" ? "verify your email" : "reset your password"}</p>`
        }
        const mailResponse = await transporter.sendMail(mailOptions);
          
        return mailResponse;
        
    } catch (error) {
        console.log(error);
    }
}