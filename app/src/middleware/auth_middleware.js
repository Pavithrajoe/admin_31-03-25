import jwt from 'jsonwebtoken';

// verify the header is provided 
export const verifyToken=async(req)=>{
    console.log('Headers data are :', req.headers); // Log headers for debugging

    const authHeader=req.headers.get('authorization');
   
     if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new Error('Authorization header is missing or invalid');
  }
    const token=authHeader.split(" ")[1];
    console.log(token);
// verify the token is provided 
    if(!token) throw new Error("token not provided");
    try{
      
        const decoded =jwt.verify(token, process.env.JWT_SECRET);
        req.user=decoded;
        console.log(decoded)
        return decoded;
    }catch(error){
        throw new Error("Invalid token");
        
    }
    

};

// verify the role is allowed for the access 
   export  const Role_auth=async(req)=>{
    const decode=await verifyToken(req);
    console.log("entered token is", decode);
    const req_role=decode.role;
    if(req_role!== 1 && req_role!==2){
        throw new Error(`Access isn't provided for ${req_role} role!`);
    }
    return decode;

   };

 

