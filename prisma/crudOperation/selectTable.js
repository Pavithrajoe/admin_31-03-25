import prisma from '../index';

export async function getAllUsers() {
    try {
        const users = await prisma.users.findMany();
        return users; 
    } catch (error) {
        throw new Error(`Failed to fetch users: ${error.message}`); 
    }


}

export async function getAllProduct() {
    try {
        const Company_Products = await prisma.latest_from_company.findMany({
            where: {
                is_active: true
            },
            include: {
                createdBy: {  // ✅ Correct relation for created_by
                    select: { username: true }
                },
                updatedBy: {  // ✅ Correct relation for updated_by
                    select: { username: true }
                }
            },
            orderBy: {
                updated_at: 'desc'
            }
        });
    
        // ✅ Map the result to format the output correctly
        const products = Company_Products.map(product => ({
            id: product.id,
            created_by: product.createdBy?.username || null, // ✅ Handle null values
            updated_by: product.updatedBy?.username || null, // ✅ Handle null values
            content: product.content,
            image: product.image,
            gif: product.gif,
            created_at: product.created_at,
            updated_at: product.updated_at,
            is_active: product.is_active
        }));
    
        if (products.length === 0) throw new Error("There are no products");
        
        return { success: true, products };
    } catch (error) {
        throw new Error(`Failed to fetch the Product Details: ${error.message}`);
    }
    
}

// fetch product by id
export async function getPrdById(Product_id) {

    try {
        const Product = await prisma.latest_from_company.findUnique({
          where: { id:Number(Product_id) },
        });
        return Product;
      } catch (error) {
        throw new Error(`Error fetching Product : ${error.message}`);
      }
    
}

  
    export async function getEmail(){
         
          
    
        const smtpSettings = await prisma.smtp_settings.findFirst();
        if (!smtpSettings) throw new Error('SMTP settings not found');
        return smtpSettings;
    


    }


    export async function getBlogById(blogId) {
        return await prisma.blog.findUnique({
          where: { id: blogId },
          select: {
            id: true,
            blog_content: true,
         
            created_at: true,
            users: {
              select: { username: true },
            },
          },
        });
      }
    
      // Fetch multiple blogs (with pagination)
      export async function getAllBlogs(page, pageSize) {
        return await prisma.blog.findMany({
          select: {
            id: true,
            blog_content: true,
            active: true,
            created_at: true,
            users: {
              select: { username: true },
            },
          },
          skip: (page - 1) * pageSize,
          take: pageSize,
          orderBy: { created_at: 'desc' },
        });
      }
    
      export async function fetchSubscriber(){
       
        try {
            const AllSUbs=await prisma.subscriber_management.findMany();
            if (AllSUbs.length===0){
                throw new Error ("No subscriber found ")
            }
            console.log(AllSUbs);
            return AllSUbs;
        } catch (error) {
            throw Error(`There was error in ${error.message}`);
        }
    }
    


