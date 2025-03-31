
import { Role_auth } from "../../src/middleware/auth_middleware";
import { EmailSettings } from "../../src/services/smtp_settings";


export async function POST(req) {
    try {
        const body = await req.json();
        const SetMail = new EmailSettings();
        const Email = await SetMail.sentMail(body);

        const response = new Response(
            JSON.stringify({ success: true, Email }),
            {
                status: 201,
                headers: { "Content-Type": "application/json" }
            }
        );

        response.headers.set(
            "Set-Cookie",
            `HttpOnly; Path=/; Max-Age=3600; Secure; SameSite=Strict`
        );

        return response;
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: error.message
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}
//  Fixed GET method to use the correct function
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
        const gettingMail = new EmailSettings();
        const result = await gettingMail.FetchMail();
      console.log("The smtp data are ", result);
        return new Response(
            JSON.stringify({
                success: true,
                result
            }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" }
            }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({
                success: false,
                message: error.message
            }),
            {
                status: 400,
                headers: { "Content-Type": "application/json" }
            }
        );
    }
}
