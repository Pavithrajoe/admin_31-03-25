import { SelectData } from "../tableQueries/selectdata";
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from "../utils/jwt";


export class logedUser{
     async Checkuser(login_User){

        console.log("This is db check ", login_User.Email);
          
            
            const Is_User= await SelectData.User_Auth(login_User.Email);
            console.log("The login user",login_User);

                       

            if(!Is_User)
                {
                 throw Error(`message.Error, User not found !!`);
                }

                const comparepwt=await bcrypt.compare(login_User.Password,Is_User.password);
           if(!comparepwt){
            throw Error("Invalid password");
           }
           if(Is_User.is_active===false)
           {
            throw Error("User is not active");
           }
        console.log("This is user name from Is_user contant " ,Is_User.User_id);
           const jwtToken=generateToken(Is_User);

        const Verify_Login_Token= await verifyToken(jwtToken);
         if(!Verify_Login_Token){
            throw new Error(`Authentication failed: ${error.message}`);
         }
             return {User:Is_User,jwtToken};
    }

  
}



