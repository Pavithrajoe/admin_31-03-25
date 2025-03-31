import pool from "../lib/db";


export class SelectData{
    static async User_Auth(user_log){
        const {email}=user_log;
        console.log("This is user_log mail " +  user_log);
           try{
            const Try_User=`SELECT * FROM users WHERE email=$1`;
            
            const UserResult=await pool.query(Try_User,[user_log]);
            console.log(UserResult);
             if(UserResult.rowCount === 0){
                throw new Error("User Not Found")
             }

             return UserResult.rows[0];
           }catch(error){
            throw new Error("You don't have the cart");
        }
          
        
    }
    static async  getSendmail(){
        const Emails=`SELECT smtp_host, smtp_port, smtp_email, smtp_password FROM smtp_settings LIMIT 1 `;
        const result=await pool.query(Emails);
        console.log("The mail is " + result.rows[0].smtp_email);
        return result.rows[0];
    }
    

    static async getReceivemail(){
        const User_Email=`SELECT email FROM users`;
        const result=await pool.query(User_Email);
        // console.log(result);
        return result.rows.map(row=>row.email);
    };

   
    
}