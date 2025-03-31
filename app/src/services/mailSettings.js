import { SelectData } from "../tableQueries/selectdata";
import { sendEmails } from "../utils/sendMails";

export const sendEmailToUsers = async (subject, html) => {
    try {
        //  Fetch SMTP settings from the database
        const Mailer_result = await SelectData.getSendmail();
        if (!Mailer_result) throw new Error("SMTP settings not found");

       console.dir(Mailer_result, {depth:null});
        //  Fetch user emails from the database
        const Umail_result = await SelectData.getReceivemail();

        // console.log("The user emails sent to service are:", Umail_result);

        //  Check if there are any emails to send
        if (Umail_result.length === 0) throw new Error("No emails to send");

        // Send emails
        for (const email of Umail_result) {
            try {
                await sendEmails(Mailer_result, email, subject, html);
                console.log(`Email sent to: ${email}`);
            } catch (error) {
                console.log(`Failed to send email to ${email}: ${error.message}`);
               
            }
        }

        return `Emails sent to ${Umail_result.length} users`;
    } catch (error) {
        console.error("Error in sendEmailToUsers:", error.message);
        throw new Error(error.message);
    }
};
