import nodemailer from 'nodemailer'
import { env } from '@/config/environment.js'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: env.EMAIL_USER,
    pass: env.EMAIL_PASS
  }
})

export const sendEmail = async ({ to, subject, html }) => {
  return await transporter.sendMail({
    from: `"Coffee Shop" <${env.EMAIL_USER}>`,
    to,
    subject,
    html
  })
}