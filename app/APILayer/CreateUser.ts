

export const CreateUser=async  (data:any)=>{
    const token = sessionStorage.getItem('token'); //  Get from sessionStorage
   console.log('token is ',token);
    const response = await fetch('/api/signup',{
        method:'POST',
        headers:{'Content-Type':'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body:JSON.stringify(data),
        credentials:'include',  
    })
    console.log(data);
    const result= await  response.json();
    if(!response.ok) throw new Error(result.message);
    return result;

}


// Fetch all users
export const getUsers = async () => {
  const token = sessionStorage.getItem('token'); 
  console.log("token received is ",token);
  const url = `/api/signup`;
      
  const response = await fetch(url, {
    method: "GET",
    
      headers:{'Content-Type':'application/json',
        'Authorization': `Bearer ${token}`,
      
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.response;
};

// Fetch user by ID
export const getUserById = async (userId: number) => {
  const token = sessionStorage.getItem('token');
  console.log("token is by the user id ", token)
  const url = `/api/signup?id=${userId}`;
   
  const response = await fetch(url, {
    method: "GET",
    headers: {
      'Content-Type':'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.message);
  return result.response;
};

// Update user details
export const updateUser = async (userId: number, userData: any) => {
  const url = `/api/signup?id=${userId}`;
  const token =sessionStorage.getItem('token');
  console.log("the user id is",userId);
  console.log("token is by Eidt the user id ", token)
  const response = await fetch(url, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(userData),
  });

  const result = await response.json();
  console.log(result);
  if (!response.ok) throw new Error(result.message);
  return result;
};
