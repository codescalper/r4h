import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';
import { EMAIL, PASSWORD } from './constants';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: { user: EMAIL, pass: PASSWORD },
});

function loadTemplate(templateName: string, vars: Record<string, string>): string {
  const templatePath = path.join(process.cwd(), 'emails', `${templateName}.html`);
  let html = fs.readFileSync(templatePath, 'utf-8');
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{${key}}}`, value);
  }
  return html;
}

export async function sendEmail({
  to,
  subject,
  template,
  vars = {},
}: {
  to: string;
  subject: string;
  template: string;
  vars?: Record<string, string>;
}) {
  const html = loadTemplate(template, vars);
  await transporter.sendMail({
    from: `"Run4Health" <${EMAIL}>`,
    to,
    subject,
    html,
  });
}
