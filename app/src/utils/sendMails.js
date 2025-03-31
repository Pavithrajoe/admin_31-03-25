import nodemailer from 'nodemailer';
export async function sendEmails(smtp,to,subject, html){
    const transporter=nodemailer.createTransport({
        host:smtp.smtp_host,
        port:smtp.smtp_port,
        secure: false,
        auth:{
            user:smtp.smtp_email,
            pass:smtp.smtp_password,
        },

    });
    console.log("The mail received is  "+ smtp.smtp_email);
    const mailOptions={
        from:smtp.smtp_email,
        to,
        subject,
        html,
    };
    const info=await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${to}:${info.messageId}`)
}