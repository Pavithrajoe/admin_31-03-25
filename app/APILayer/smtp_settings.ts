export async function fetchEmailSettings(){
    try{
        const response=await fetch("/api/smtp_settings",{
            method:"GET",
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${sessionStorage.getItem("token")}`,
                
            },
        });
        const data=await response.json();
   
        if(!response.ok){
            throw new Error(data.message||"Failed to fetch email settngs");
            
        }
        return data.result;
    }catch(error:any){
        throw new Error(error.message || "Something went wrong");
    }
}