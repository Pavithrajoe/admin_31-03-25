import jwt from "jsonwebtoken";
const SECRET_KEY=process.env.JWT_SECRET;
const EXPIRES_IN=process.env.JWT_EXPIRES_IN || '1h';


// GENERATE JWT TOKEN
export  const generateToken=(user)=>{

    console.log('This is user object!!'+user.User_id);

    return jwt.sign(
        {   id:user.id,
            user_id:user.user_id,
            username:user.username,
            email:user.email,
            role:user.role
        },
        SECRET_KEY,
        {expiresIn: EXPIRES_IN}

        
    )
}

// VERIFY JWT TOKEN
export const verifyToken=async(token)=>{
    try{
        return jwt.verify(token,SECRET_KEY);
        
            
    }
    catch(error){
        throw new Error('Invalide token  or erpired token');
    }
};