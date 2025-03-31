import prisma from '../index';

export class Insert_data {
  async createBlog(userId, blogContent) {
    return await prisma.blog.create({
      data: {
        user_id: userId,
        blog_content: blogContent,
        active: true,
      },
    });
  }

  async Add_Subscriber_Email(Subscriber){
    return await prisma.subscriber_management.create({  
        data:{
            subscriber_email:Subscriber.email,
            company_id:Subscriber.company_id||null,
        }
    })
  }
}

export default new Insert_data();
