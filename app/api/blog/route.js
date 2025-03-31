import { NextResponse } from 'next/server';
import BlogService from '../../src/services/blog';
import { Role_auth } from '../../src/middleware/auth_middleware';



// POST: Create a new blog
export async function POST(req) {
  try {
    const body = await req.json();
    await Role_auth(req);
    const { user_id, blog_content } = body;
      console.log(req.user.id);
    const newBlog = await BlogService.createBlog(req.user.id, blog_content);

    return NextResponse.json(
      { message: 'Blog created successfully!', blog: newBlog},
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// GET: Fetch a single blog or all blogs
export async function GET(req) {
  try {
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
    const blogId = searchParams.get('id');
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 10;

    let response;

    if (blogId) {
      // Fetch a single blog
      response = await BlogService.getBlogById(parseInt(blogId));
    } else {
      // Fetch all blogs
      response = await BlogService.getAllBlogs(page, pageSize);
    }

    return NextResponse.json(
      { message: 'Blog fetched successfully!', blog: response },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}

// PUT: Update a blog
export async function PUT(req) {
  try {
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
    const blogId = searchParams.get('id');
    const body = await req.json();
    const { id=Number(blogId), blog_content, active } = body;

    const updatedBlog = await BlogService.updateBlog(id, blog_content, active);

    return NextResponse.json(
      { message: 'Blog updated successfully!', blog: updatedBlog },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
}
