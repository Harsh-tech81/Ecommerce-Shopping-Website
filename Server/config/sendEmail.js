import sendEmail from "./emailService.js";

const sendEmailFun=async ({to,subject,text,html})=>{
    const result=await sendEmail(to,subject,text,html);
    if(result.success){
    return true;
    //  res.status(200).json({message:"Email sent successfully",error:false,success:true})
    }else{
    return false;
    // res.status(500).json({message:"Email not sent",error:true,success:false})
  }
};

export default sendEmailFun;
