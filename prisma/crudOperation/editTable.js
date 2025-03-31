import prisma from '../index';
const localTime = new Date(new Date().getTime() + 5.5 * 60 * 60 * 1000).toISOString();

class EditData {
  async updateBlog(blogId, blogContent, active) {
    return await prisma.blog.update({
      where: { id: blogId },
      data: {
        blog_content: blogContent,
        active: active,
        updated_at: localTime,
      },
    });
  }

  async updateProduct(prdId,content,image, gif, is_active,update_UserId) {
    return await prisma.latest_from_company.update({
      where: { id: prdId },
      data: {
        content: content,
        image: image,
        gif:gif,
        is_active:is_active,
        updated_at: localTime,
        recently_updated_by : update_UserId
      },
    });
  }
  async  updateUser(userData) {
    try {
      let roleId = undefined;
  
      // ✅ Get role_id from the roles table using Prisma
      if (userData.role) {
        const role = await prisma.roles.findUnique({
          where: { role_name: userData.role },
        });
  
        if (!role) {
          throw new Error(`Role "${userData.role}" does not exist`);
        }
  
        roleId = role.role_id; // ✅ Use role_id from the database
        console.log(roleId);
      }
  
      // ✅ Update user using Prisma
      const updatedUser = await prisma.users.update({
        where: {
          id: userData.id,
        },
        data: {
          user_id: userData.user_id,
          username: userData.username,
          email: userData.email,
          password: userData.password,
          role: roleId,
          company_id: userData.company_id ?? null,
          is_active: userData.is_active ?? true,
          updated_at: new Date(),
        },
      });
  
      return updatedUser;
    } catch (error) {
      throw new Error(`Error updating user: ${error.message}`);
    }
  }
  
  
  
  
   
  

async getUserById(id) {
  try {
    const user = await prisma.users.findUnique({
      where: { id:Number(id) },
    });
    return user;
  } catch (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
}


}



export default new EditData(); //  Create an instance
