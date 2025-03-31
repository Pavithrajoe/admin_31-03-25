import { z } from "zod";
import formidable from "formidable";
import fs from "fs";
import path from "path";
import { Readable } from "stream"; 
import { Inserting_data } from "../tableQueries/insert_data";

const MAX_IMG_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_IMG_TYPE = ["image/jpg", "image/jpeg", "image/png", "image/webp"];
const MAX_GIF_SIZE = 20 * 1024 * 1024; // 20MB
const GIF_TYPE = ["image/gif"];

const Prd_Data = z.object({
  content: z.string().min(1, "Product content required"),
  image: z.string().nullable().optional(),
  gif: z.string().nullable().optional(),
});

export class Upload_Prd {
  async parseFormData(req) {
    const contentType = req.headers.get('content-type');
    if (!contentType || !contentType.includes('multipart/form-data')) {
      throw new Error("Invalid content type");
    }

    const form = formidable({ multiples: true, keepExtensions: true });

    // ✅ Convert request to readable stream
    const stream = Readable.from(await req.arrayBuffer());

    return new Promise((resolve, reject) => {
      form.parse(stream, (err, fields, files) => {
        if (err) {
          console.error("Formidable error:", err);
          return reject(err);
        }
        resolve({ fields, files });
      });
    });
  }

  async addProduct(req, user_id) {
    try {
      console.log("Processing addProduct...");

      const { fields = {}, files = {} } = (await this.parseFormData(req)) || {};
      console.log("Fields:", fields);
      console.log("Files:", files);

      let imagePath = null;
      let gifPath = null;

      // ✅ Handle image upload
      const images = files.image ? (Array.isArray(files.image) ? files.image : [files.image]) : [];
      for (const image of images) {
        if (ACCEPTED_IMG_TYPE.includes(image.mimetype) && image.size <= MAX_IMG_SIZE) {
          const newFileName = `${Date.now()}-${image.originalFilename.replace(/\s+/g, "-")}`;
          const newPath = path.join(process.cwd(), "/public/uploads", newFileName);

          fs.renameSync(image.filepath, newPath);
          imagePath = `/public/uploads/${newFileName}`;
          break; // Save only the first valid image
        } else {
          throw new Error("Invalid image format or size");
        }
      }

      // ✅ Handle GIF upload
      const gifs = files.gif ? (Array.isArray(files.gif) ? files.gif : [files.gif]) : [];
      for (const gif of gifs) {
        if (GIF_TYPE.includes(gif.mimetype) && gif.size <= MAX_GIF_SIZE) {
          const newFileName = `${Date.now()}-${gif.originalFilename.replace(/\s+/g, "-")}`;
          const newPath = path.join(process.cwd(), "/public/uploads", newFileName);

          fs.renameSync(gif.filepath, newPath);
          gifPath = `/public/uploads/${newFileName}`;
          break; // Save only the first valid GIF
        } else {
          throw new Error("Invalid GIF format or size");
        }
      }

      // ✅ Prepare product data
      const productData = {
        content: fields.content || "", // ✅ Direct extraction instead of array[0]
        image: imagePath,
        gif: gifPath,
      };

      // ✅ Validate with Zod
      const validatedData = Prd_Data.parse(productData);

      // ✅ Save to database
      const PrdData = new Inserting_data();
      const insertedPrd = await PrdData.addPrd(user_id, validatedData);
      console.log("Saving to DB:", validatedData);

      return insertedPrd;
    } catch (error) {
      console.log(`Failed to add product: ${error.message}`);
      throw new Error(`Failed to add product: ${error.message}`);
    }
  }



  async getAll_PrdDetails() {
    try {
      console.log("Fetching all products...");
      const Prd_Info = await getAllProduct();
      console.dir(Prd_Info);
      return Prd_Info;
    } catch (error) {
      throw new Error(`Error fetching products: ${error.message}`);
    }
  }

  async getPrdById(Prd_id) {
    console.log("Fetching product by ID:", Prd_id);
    if (!Prd_id) throw new Error("Product ID is required!");

    const Product = await getPrdById(Prd_id);
    if (!Product) throw new Error("Product not found!");

    return Product;
  }

  async update_Product(prdId, content, image, gif, is_active, updateUserId) {
    try {
      console.log("Updating product:", prdId);

      if (!prdId) throw new Error("Product ID is required!");
      if (!content) throw new Error("Product content must be provided!");
      if (!image) throw new Error("Image is required!");
      if (!gif) throw new Error("GIF is required!");
      if (is_active === undefined) throw new Error("Active status is required!");
      if (!updateUserId) throw new Error("User ID is required for update!");

      return await EditData.updateProduct(prdId, content, image, gif, is_active, updateUserId);
    } catch (error) {
      throw new Error(`Failed to update product: ${error.message}`);
    }
  }
}