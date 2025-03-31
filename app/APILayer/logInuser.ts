export const handleLogin = async (Email:any,Password:any) => {
    const res = await fetch('/api/loginuser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email, Password })
    });
  
    if (res.ok) {
      const { jwtToken } = await res.json();
  
      //  Store token in sessionStorage
      sessionStorage.setItem('token', jwtToken);
  
      console.log('Token stored in sessionStorage');
    }
    else{
        throw new Error("Login failed");
    }
  };
 