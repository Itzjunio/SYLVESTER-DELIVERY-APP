import nodemailer from 'nodemailer'

const transport = nodemailer.createTransport({
    service: "Gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
})

export async function sendMail(to: string, subject: string, html: string){

    return transport.sendMail({
        from: `"App" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
}