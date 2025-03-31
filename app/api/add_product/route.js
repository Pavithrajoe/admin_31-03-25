import { NextResponse } from "next/server";
import formidable from "formidable";
import { Upload_Prd } from "../../src/services/product_upload";
import { Readable } from "stream";

export const config = {
  api: {
    bodyParser: false, // Disable bodyParser for file uploads
  },
};

// Helper function to extract user ID from JWT token
function extractUserIdFromToken(token) {
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString());
    return payload.user_id;
  } catch (err) {
    console.error("Invalid token:", err);
    return null;
  }
}

// ✅ Utility function to convert Next.js request to a readable stream
function toNodeReadable(req) {
  const readable = new Readable();
  readable._read = () => {}; // _read is required but can be empty
  req.body
    .pipeThrough(new TransformStream())
    .getReader()
    .read()
    .then(({ value, done }) => {
      if (!done) {
        readable.push(value);
      } else {
        readable.push(null);
      }
    });
  return readable;
}

export async function POST(req) {
  try {
    const token = req.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Authorization token required" },
        { status: 401 }
      );
    }

    const user_id = extractUserIdFromToken(token);
    if (!user_id) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // ✅ Convert Next.js request to readable stream
    const mockReq = toNodeReadable(req);

    const form = formidable({ multiples: true });

    // ✅ Use the mock request for parsing
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(mockReq, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    console.log("Fields:", fields);
    console.log("Files:", files);

    const uploader = new Upload_Prd();
    const result = await uploader.addProduct({ fields, files, user_id });

    return NextResponse.json(
      { success: true, data: result },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to add product" },
      { status: 400 }
    );
  }
}


export async function GET(req) {
  try {
    const { role } = await Role_auth(req);
    
    // Allow only admin (1) and super admin (2)
    if (role !== 1 && role !== 2) {
      return Response.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const Prd_id = searchParams.get('id');
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 10;

    const Fetching_Prd = new Upload_Prd();
    let response;

    if (Prd_id) {
      response = await Fetching_Prd.getPrdById(Prd_id);
    } else {
      response = await Fetching_Prd.getAll_PrdDetails(page, pageSize);
    }

    return Response.json(
      { success: true, products: response },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in GET:", error);
    return Response.json(
      { success: false, message: error.message || "Failed to fetch products" },
      { status: 400 }
    );
  }
}

export async function PUT(req) {
  try {
    const { role } = await Role_auth(req);
    
    if (role !== 1 && role !== 2) {
      return Response.json(
        { success: false, message: "Access denied" },
        { status: 403 }
      );
    }

    const token = req.headers.get('authorization')?.split(' ')[1];
    const user_id = extractUserIdFromToken(token);
    
    if (!user_id) {
      return Response.json(
        { success: false, message: "Invalid user ID" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const Product_Id = searchParams.get('id');
    
    const uploader = new Upload_Prd();
    const { fields, files } = await uploader.parseFormData(req);

    const updateData = {
      id: Number(Product_Id),
      content: fields.content?.[0],
      image: files.image?.[0],
      gif: files.gif?.[0],
      is_active: fields.is_active?.[0] === 'true',
      user_id: user_id
    };

    const updatedProduct = await uploader.update_Product(
      updateData.id,
      updateData.content,
      updateData.image,
      updateData.gif,
      updateData.is_active,
      updateData.user_id
    );

    return Response.json(
      { success: true, product: updatedProduct },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error in PUT:", error);
    return Response.json(
      { success: false, message: error.message || "Failed to update product" },
      { status: 400 }
    );
  }
}