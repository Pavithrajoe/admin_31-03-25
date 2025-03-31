
import { sendEmailToUsers } from "../../services/mailSettings";

export async function POST(req){
        
         try {
            const body=await req.json();
            const subject=body.subject||" This is test mail";
            const html=body.html||"<h1>This test body content</h1>";
            const message=await sendEmailToUsers(subject,html);

           return new Response(
            JSON.stringify({success:true,message}),
            {status:200, headers:{'Content-Type':'application/json'}}
           );
         } catch (error) {
            console.log('Error sending emails:', error.message);
            return new Response(
                JSON.stringify({success:false,error:error.message}),
                   {status:400,headers:{'Content-Type':'application/json'}} 
                );
            
         }
}