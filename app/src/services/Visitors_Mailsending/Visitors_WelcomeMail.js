import { SelectData } from "../../tableQueries/selectdata";
import { sendEmails } from "../../utils/sendMails";


export const  Blogs_welcome=  async (Subs_mail,Subject,Content)=>{
    try {
     const Mailer_result = await SelectData.getSendmail();
     if (!Mailer_result) throw new Error("SMTP settings not found");
       
     const Mail_Result=await sendEmails(Mailer_result,Subs_mail,Subject,Content);
     console.log("Email successfully send", Subs_mail);
     return `Emails sent to ${Subs_mail} users`;
      } catch(error) {
        throw new Error (`There was an error in sending mail${error.message}`);
        
    }
}
   