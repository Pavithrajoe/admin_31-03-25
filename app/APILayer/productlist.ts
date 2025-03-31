import { errorToJSON } from "next/dist/server/render";

const BASE_URL = "/api/add_product"; // Adjust based on your API route

// Fetch all products
export const getAllProducts = async () => {
    const token = sessionStorage.getItem('token'); 

    try{
      const res = await fetch(`${BASE_URL}`,
        {
            method: "GET",
         
            headers:{'Content-Type':'application/json',
                'Authorization': `Bearer ${token}`,
          }
        }
      );
      if (!res.ok) throw new Error(`Failed to fetch products`);
      return res.json();
    }catch(error:any){   
      throw new Error(`Upload correct data ${error.message}`)
    }
  
};

// Fetch product by ID
export const getProductById = async (id: number) => {
    const token=sessionStorage.getItem('token');
  const res = await fetch(`${BASE_URL}?id=${id}`,
    {
        method: "GET",
     
        headers:{'Content-Type':'application/json',
            'Authorization': `Bearer ${token}`,
      }
    }
  );
  if (!res.ok) throw new Error("Failed to fetch product");
  return res.json();
};


// Helper function to handle errors
const handleResponse = async (res: Response) => {
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Request failed");
  }
  return res.json();
};

export const createProduct = async (data: FormData) => {
  try {
    const token = sessionStorage.getItem('token');
    if (!token) throw new Error("Authentication required");

    const res = await fetch(BASE_URL, {
      method: "POST",
      body: data,
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    return handleResponse(res);
  } catch (error: any) {
    throw new Error(`Failed to create product: ${error.message}`);
  }
};

// Similar improvements for other methods (getAllProducts, getProductById, updateProduct)
  
  



// Update product
export const updateProduct = async (id: number, data: FormData) => {
    const token=sessionStorage.getItem('token');
  const res = await fetch(`${BASE_URL}?id=${id}`, {
    method: "PUT",
    body: data,
    headers:{'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`,}
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
};
