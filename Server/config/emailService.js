
import nodemailer from 'nodemailer';

// Configure the SMTP transporter
const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com", 
    port:465, //secure
    secure:true, // true for only 465, false for other ports
    auth:{
        user:process.env.EMAIL,   // your SMTP username
        pass:process.env.EMAIL_PASS, // your SMTP password
    },
});
// Function to send email
async function sendEmail(to,subject,text,html) {
    try{
        const info=await transporter.sendMail({
            from:process.env.EMAIL,
            to,
            subject,
            text,
            html,
        });
        return {success:true,messageId:info.messageId};
    }catch(error){
        console.error('Error sending email:',error);
        return {success:false,error:error.message};
    }
}


export default sendEmail;

