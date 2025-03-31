import { z } from 'zod';
import EditData from '../../../prisma/crudOperation/editTable';
import insertData from '../../../prisma/crudOperation/insertTable';
import { getAllBlogs as fetchAllBlogs, getBlogById as fetchBlogById } from '../../../prisma/crudOperation/selectTable';

const blogContentSchema = z.array(
  z.object({
    type: z.enum(['Heading', 'Paragraph', 'Video', 'Image'],),
    text: z.string().optional(),
    language: z.string().optional(),
    content: z.string().optional(),
  })
);

class BlogService {
  // Create a new blog
  async createBlog(userId, blogContent) {
    if (!userId) throw new Error('User ID is required!');

    // Validate blog content using zod
    try {
      blogContentSchema.parse(blogContent);
    } catch (error) {
      throw new Error(`Invalid blog content: ${error.message}`);
    }

    return await insertData.createBlog(userId, blogContent);
  }

  // Fetch a single blog by ID
  async getBlogById(blogId) {
    if (!blogId) throw new Error('Blog ID is required!');

    const blog = await fetchBlogById(blogId);
    if (!blog) throw new Error('Blog not found!');

    return {
      id: blog.id,
      blog_content: blog.blog_content,
      active: blog.active,
      created_at: blog.created_at,
      created_by: blog.users.username,
    };
  }

  // Fetch all blogs (with pagination)
  async getAllBlogs(page = 1, pageSize = 10) {
    const blogs = await fetchAllBlogs(page, pageSize);
    return blogs.map((blog) => ({
      id: blog.id,
      blog_content: blog.blog_content,
      active: blog.active,
      created_at: blog.created_at,
      created_by: blog.users.username,
    }));
  }

  // Update a blog
  async updateBlog(blogId, blogContent, active) {
    if (!blogId) throw new Error('Blog ID is required!');
    if (active === undefined) throw new Error('Active status is required!');

    // Validate blog content using zod
    try {
      blogContentSchema.parse(blogContent);
    } catch (error) {
      throw new Error(`Invalid blog content: ${error.message}`);
    }

    return await EditData.updateBlog(blogId, blogContent, active);
  }
}

export default new BlogService();
