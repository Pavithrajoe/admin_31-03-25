"use client";

import { fetchEmailSettings } from "@/app/APILayer/smtp_settings";
import { useEffect, useState } from "react";

// Type definition for SMTP settings
type EmailData = {
  smtp_host: string;
  smtp_port: number;
  smtp_server: string;
  smtp_name: string;
  smtp_email: string;
  smtp_password: string;
};

export default function SmptSettings() {
  // State to hold email settings and error
  const [email_Data, setEmailData] = useState<EmailData | null>(null);
  const [error, setError] = useState<string | null>(null);
    
  useEffect(() => {
    async function loadData() {
      try {
        const data: EmailData = await fetchEmailSettings(); // Assuming it returns a single object
        setEmailData(data);
  
      } catch (err: any) {
        setError(err.message);
      }
    }
    loadData();
  }, []);

  return (
    <div>
      <h1 className="text-center font-bold text-2xl">SMTP Details:</h1>
      
      {/* Display error if any */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Render SMTP details if data is available */}
      {email_Data ? (
       <div className="overflow-x-auto">
       <table className="min-w-full border-collapse border border-gray-300 bg-white shadow-md rounded-lg">
         <thead>
           <tr className="bg-gray-200 text-black">
             <th className="p-3 border text-black border-gray-300 text-center font-semibold">SMTP Host</th>
             <th className="p-3 border text-black border-gray-300 text-center font-semibold">SMTP Port</th>
             <th className="p-3 border text-black border-gray-300 text-center font-semibold">SMTP Server</th>
             <th className="p-3 border text-black border-gray-300 text-center font-semibold">SMTP Name</th>
             <th className="p-3 border text-black border-gray-300 text-center font-semibold">SMTP Email</th>
             <th className="p-3 border text-black border-gray-300 text-center font-semibold">SMTP Password</th>
           </tr>
         </thead>
         <tbody>
           <tr className="hover:bg-gray-100 transition">
             <td className="p-3 border text-black border-gray-300 text-center">{email_Data.smtp_host}</td>
             <td className="p-3 border text-black border-gray-300 text-center">{email_Data.smtp_port}</td>
             <td className="p-3 border text-black border-gray-300 text-center">{email_Data.smtp_server}</td>
             <td className="p-3 border text-black border-gray-300 text-center">{email_Data.smtp_name}</td>
             <td className="p-3 border text-black border-gray-300 text-center">{email_Data.smtp_email}</td>
             <td className="p-3 border text-black border-gray-300 text-center">{email_Data.smtp_password}</td>
           </tr>
         </tbody>
       </table>
     </div>
   ) : (
     <h1 className="text-lg font-medium text-gray-500">Loading SMTP settings...</h1>
   )}
    </div>
  );
}
