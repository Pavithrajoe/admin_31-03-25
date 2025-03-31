import { logedUser } from "../../src/services/login";

export async function POST(req){
           
    try{
    const getLoginUser= await req.json();
    console.log("Login user email " , getLoginUser.email);

      const ValidateUser=new logedUser();
      const {User,jwtToken}=await ValidateUser.Checkuser(getLoginUser);
      console.dir(jwtToken, {depth : null});
      console.log(User);
      const response= new Response(JSON.stringify({success:true,User,jwtToken}),{
        status:201,headers:{"content-Type":"Application/json"}
      });
      response.headers.set(
        "Set-Cookie",
        `token=${jwtToken}; HTTPOnly; Path=/; Max-Age=3600;Secure; SameSite=Strict`

      );
      return response;
    }
    catch(Error){
        return new Response(JSON.stringify({
            success:false,message:Error.message
        }),{
            status:400,
            headers:{"Content-Type":"Application/json"},
        })
    }
}