import { z } from "zod";
import { Inserting_data } from "../tableQueries/insert_data";
import { getEmail } from "../../../prisma/crudOperation/selectTable";

const Email_validate=z.object({
    smtp_host:z.string().email(),
    smtp_port :z.number().min(3,"Enter atleast 3 character"),
    smtp_server : z.string().email(),
    smtp_name :z.string().min(8,"Name should be atleast 8 character"),
    smtp_email :z.string().email(),
    smtp_password :z.string().min(1,"Password required")
})

 export class EmailSettings{
     async sentMail(){
    const Emailer={
        smtp_host:"deepakxcode@gmail.com",
        smtp_port:567,
        smtp_server:"deepakzcode@gamil.com",
        smtp_name:"inklidox_technologies",
        smtp_email:"vigneshxcodefix@gmail.com",
        smtp_password:"vxcf1234"
    };

    

    await Inserting_data.SetEmail(Emailer);
     }

     async FetchMail() {
        //    const Validate_smtp=Email_validate.safeParse(data)
              
        //    if(!Validate_smtp){
        //     throw new Error('Missing required fields');
        //    }
           const result = await getEmail();

        return result;
        }

        catch(error){
            throw Error(`${error.message}`)
        }
    
 }




