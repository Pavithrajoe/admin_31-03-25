import { z } from "zod";
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../utils/jwt';
import { Inserting_data } from "../tableQueries/insert_data";
import { getAllUsers } from "../../../prisma/crudOperation/selectTable";
import EditData from '../../../prisma/crudOperation/editTable';

//  Define the schema with consistent property names
const validUser = z.object({
 
  user_id: z.string()
    .regex(/^[a-zA-Z0-9]+$/)
    .max(10, "Maximum letter length is 10"),
  username: z.string().min(5, "Username must be at least 5 characters"),
  role: z.enum(['Admin', 'Superadmin', 'User']),
  email: z.string().email("Invalid email format"),
  password: z.string().min(7, "Password must contain at least 7 characters").optional(),
  company_id: z.string().nullable().optional(),
  is_active: z.boolean().optional()
});

export class HandleUser {
  //  Create User
  async addUser(user) {
    const userData = validUser.safeParse(user);
    if (!userData.success) {
      throw new Error(userData.error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`).join(', '));
    }

    // Hash password
    const hashedPwd = await bcrypt.hash(user.password, 10);
    user.password = hashedPwd;

    //  Insert roles after table creation
    await Inserting_data.addRoles();
    console.log('Roles inserted successfully');

    //  Insert user into DB
    const newUser = await Inserting_data.addUser(user);

    //  Generate token and verify it
    try {
      const token = generateToken(newUser);
      const verifyJwtToken = verifyToken(token);
      if (!verifyJwtToken) {
        throw new Error(`Authentication failed`);
      }
      return { user: newUser, token };
    } catch (error) {
      throw new Error(`Token generation failed: ${error.message}`);
    }
  }

  //  Get all users
  async getUsers() {
    try {
      const allUsers = await getAllUsers();
      allUsers.forEach(user=>{
        switch(user.role){
          case 1:
            user.role="Admin"
            break;
            case 2: 
            user.role="Superadmin"
            break;
            case 3:
              user.role="User"
              break;
              default:
              user.role=undefined;
        }
      });
      

      return allUsers;
    } catch (error) {
      throw new Error(`Error fetching data: ${error.message}`);
    }
  }
//   get a user by the userid
async getUser_ById(userData){
    try {
         console.log("the user id received in service class is ", userData)
        const exist_User = await EditData.getUserById(userData);
        switch(exist_User.role){
         case 1:
          exist_User.role='Admin';
          break;
          case 2:
            exist_User.role='Superadmin';
            break;
            case 3:
              exist_User.role='User';
              default:
                exist_User.role=undefined;
        }
        if(!exist_User){
            throw new Error(`can't find user ${exist_User}`);
        }
        return exist_User;
    } catch (error) {
        throw new Error("User not exist");
    }
}

  // ✅ Update user
  async updateUser(userData) {
   
    const parsedUserData = validUser.safeParse(userData);
    console.log("the data send to update: ",parsedUserData.role);
    if (!parsedUserData.success) {
      throw new Error(parsedUserData.error.issues.map(issue => `${issue.path.join('.')} - ${issue.message}`).join(', '));
    }

    // ✅ Hash password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // ✅ Fetch existing user
    const existingUser = await EditData.getUserById(Number(userData.id));
    if (!existingUser) {
      throw new Error(`User with ID ${userData.id} not found`);
    }

    // ✅ Update user using repository
    const updatedUser = await EditData.updateUser(userData);
    return updatedUser;
  }
}
