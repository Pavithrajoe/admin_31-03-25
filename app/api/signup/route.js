import { Role_auth } from "../../src/middleware/auth_middleware";
import { HandleUser } from "../../src/services/signup";


export async function POST(req){
      
    try{
        const body=await req.json();
        await Role_auth(req);
           
         const ProcessUser=new HandleUser();
         const {user,token}=await ProcessUser.addUser(body);

           

         const response= new Response(JSON.stringify({success:true,user,token}),{
            status:201,headers:{"content-Type":"Application/json"}
         });
         const isProduction = process.env.NODE_ENV === 'production';
         response.headers.set(
          "Set-Cookie",
          `token=${token}; HttpOnly; Path=/; Max-Age=3600; ${isProduction ? 'Secure;' : ''} SameSite=Lax`
        );  
         

         return response;


    }
    catch(Error){
        return new Response(JSON.stringify({success:false,message:Error.message}), {status:400,
            headers:{"Content-Type":"Application/json"},
        })
    }

}

export async function GET(req) {
  try {
    const AllUsers_data = new HandleUser();
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
     const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id');
        const page = parseInt(searchParams.get('page')) || 1;
        const pageSize = parseInt(searchParams.get('pageSize')) || 10;
          console.log("userId is", userId)
        let response;
    
        if (userId) {
          // Fetch a single blog
          response = await AllUsers_data.getUser_ById(parseInt(userId));
          console.log("the user is passsed to service class is", userId);
        } else {
          // Fetch all blogs
          response = await AllUsers_data.getUsers(page, pageSize);
        }
    
        return new Response(
          JSON.stringify({ success: true, response }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          })
      } catch (error) {
        return new Response(
          JSON.stringify({ success: false, message: error.message }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    
         
}

export async function PUT(req) {
  try {
    const { role } = await Role_auth(req);

    // ✅ Allow only admin (1) and super admin (2)
    if (role !== 1 && role !== 2) {
      return new Response(
        JSON.stringify({ success: false, message: 'Access denied' }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

   
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('id');
   
      console.log("userId in put method  is", userId);

      const Conver2Number=Number(userId)
      console.log(typeof(Conver2Number));
    const body = await req.json();
    const { user_id, username, email, password, role: userRole, company_id, is_active } = body;
    
    const userData = {
      id:Conver2Number,
      user_id,
      username,
      email,
      password,
      role: userRole,
      company_id,
      is_active,
    };
    console.log("the body", userData )
    const getuserById = new HandleUser();
 
    // ✅ Call Service Layer
    const updatedUser = await getuserById.updateUser(userData);

    return new Response(
      JSON.stringify({ success: true, user: updatedUser }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('PUT Error:', error);
    return new Response(
      JSON.stringify({ success: false, message: error.message }),
      {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
