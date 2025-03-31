
import { Role_auth } from "../../middleware/auth_middleware";
import Subscriber_Handling  from "../../services/subscriber";
import { Blogs_welcome } from "../../services/Visitors_Mailsending/Visitors_WelcomeMail";


export async function POST(req){
    try {
        const body= await req.json();
        console.log(body.email);
        const Subscriber_email=await Subscriber_Handling.Add_Subscriber(body);
        const Email_Subject= "Welcome to our Blogs!";
        const Email_Content="<p>Get in touch for the tech update </p>";
        await Blogs_welcome(body.email,Email_Subject,Email_Content);
        return new Response(
            JSON.stringify({success:true,message:"You have successfully subscribed to the newsletter",Subscriber_email}),
            {status:200, headers:{'Content-Type':'application/json'}}
           );
        
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: error.message
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" }
            }
        );
        
    }
}


export async function GET(req){
  
    try {
        const { role } = await Role_auth(req);
    
        // Allow only numeric roles 1 (admin) and 2 (super admin)
        if (role !== 1 && role !== 2) {
          return new Response(
            JSON.stringify({ success: false, message: "Access denied" }),
            {
              status: 403,
              headers: { "Content-Type": "application/json" },
            }
          );
        }
        const Subs_Emails=await Subscriber_Handling.Get_subscriber(req);
        console.log(Subs_Emails);
        const response=new Response(JSON.stringify({success:true,message:"All subscriber are fetched successfully!",Subs_Emails}),{
            status:201,headers:{"Content-Type":"application/json"}
        });
        return response;
    } catch (error) {
        return new Response(JSON.stringify({success:false,message:error.message}),{
            status:500,headers:{"Content-Type":"application/json"}
        })
    }
}


  

