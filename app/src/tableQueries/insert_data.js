import pool from "../lib/db";

export class Inserting_data{
    static async addUser(user) {
        const { user_id, username, email, role, password } = user;
        try {
            // Get the role_id from the role name
            const roleQuery = `SELECT role_id FROM roles WHERE role_name = $1`;
            const roleResult = await pool.query(roleQuery, [role]);
    
            if (roleResult.rows.length === 0) {
                throw new Error(`Role "${role}" does not exist`);
            }
    
            const roleId = roleResult.rows[0].role_id;
    
            // Insert the user using role_id
            const query = `
                INSERT INTO users (user_id, username, email, role, password)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING *;
            `;
            const values = [user_id, username, email, roleId, password];
    
            const result = await pool.query(query, values);
            return result.rows[0];
        } catch (error) {
            throw new Error(`Error inserting user: ${error.message}`);
        }
    }
    
//    adding roles in roles table 
    static async addRoles() {
        try {
            // adding static roles 
            const roles = ['Superadmin','Admin', 'User']; 
            const query = `
            INSERT INTO roles ("role_name")
            VALUES ${roles.map((_, i) => `($${i + 1})`).join(', ')}
            ON CONFLICT ("role_name") DO NOTHING
            RETURNING *;
        `;
        
            const result = await pool.query(query, roles);
            console.log('Inserted roles:', result.rows);
            return result.rows;
        } catch (error) {
            // error throw when inputed role is not in the above roles
            throw new Error(`Error inserting roles: ${error.message}`);
        }
    }

    // adding new product from inklidox 

        static async addPrd(Product,User_id){
            try{
                const {content,image,gif}=Product; 
                const Insert_Prd=`INSERT INTO latest_from_company (created_by,content,image,gif)
                VALUES ($1,$2,$3,$4)
                RETURNING *;`;
                console.log("the user id is "+ User_id);
                const Prd_values=[User_id, content, image, gif];
                const Prd_result=await pool.query(Insert_Prd,Prd_values);
                console.log("THE INSERTED DATA:",Prd_result);
                 return Prd_result.rows;
            }catch(error){
                throw new Error(`Error uploading Product detail:${error.message}`);
            }
        }

        
        static async SetEmail(Emaildata){
                  console.log(Emaildata);
            try{
                const InserEmail = `INSERT INTO smtp_settings 
               (smtp_host, smtp_port, smtp_server, smtp_name, smtp_email, smtp_password) 
               VALUES ($1, $2, $3, $4, $5, $6) 
               RETURNING *;`;

                const { smtp_host, smtp_port, smtp_server, 
                    smtp_name, smtp_email, smtp_password } = Emaildata;

                const Set_smpt = await pool.query(InserEmail, [
                smtp_host, smtp_port, smtp_server, smtp_name, smtp_email, smtp_password
                                    ]);
               return Set_smpt.rows;

            }
        catch(error){
         throw new Error (`error in insering ${error.message}`);
        }
        }

       
     
}

