import { NextRequest } from 'next/server';
import fs from 'fs';
import path from 'path';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { EMAIL } from '@/lib/constants';
import { rateLimit, getClientIp, rateLimitExceeded } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function saveDir(subdir: string): string {
  const dir = path.join(process.cwd(), 'public', 'uploads', subdir);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  return dir;
}

async function saveFile(file: File, subdir: string): Promise<string> {
  const ext = path.extname(file.name || '.bin');
  const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;
  const dir = saveDir(subdir);
  const dest = path.join(dir, filename);
  const buffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(dest, buffer);
  return `/uploads/${subdir}/${filename}`;
}

function str(fd: FormData, key: string): string {
  return (fd.get(key) as string | null) ?? '';
}

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const rl = rateLimit(`register:${ip}`, { limit: 3, windowMs: 60 * 60 * 1000 });
  if (!rl.success) return rateLimitExceeded(rl.resetAt);

  try {
    const fd = await request.formData();

    const email = str(fd, 'email');
    const firstName = str(fd, 'firstName');
    const lastName = str(fd, 'lastName');
    const phone = str(fd, 'phone');
    const gender = str(fd, 'gender');
    const city = str(fd, 'city');

    if (!email || !firstName || !lastName || !phone || !gender || !city) {
      return Response.json({ error: 'Required fields are missing.' }, { status: 400 });
    }

    const existing = await prisma.member.findUnique({ where: { email } });
    if (existing) {
      return Response.json({ error: 'An account with this email already exists.' }, { status: 409 });
    }

    // Handle profile photo
    let profilePhotoPath: string | null = null;
    const photoFile = fd.get('profilePhoto');
    if (photoFile instanceof File && photoFile.size > 0) {
      profilePhotoPath = await saveFile(photoFile, 'profiles');
    }

    // Handle medical report
    let medicalReportPath: string | null = null;
    const reportFile = fd.get('medicalReport');
    if (reportFile instanceof File && reportFile.size > 0) {
      medicalReportPath = await saveFile(reportFile, 'medical-reports');
    }

    const age = str(fd, 'age');
    const dateOfBirth = str(fd, 'dateOfBirth');
    const emergencyContact = str(fd, 'emergencyContact');
    const height = str(fd, 'height');
    const weight = str(fd, 'weight');
    const thighSize = str(fd, 'thighSize');
    const waistSize = str(fd, 'waistSize');
    const sleepHours = str(fd, 'sleepHours');
    const fitnessLevel = str(fd, 'fitnessLevel') || 'BEGINNER';
    const medicalConditions = str(fd, 'medicalConditions');

    const member = await prisma.member.create({
      data: {
        email,
        firstName,
        lastName,
        phone,
        gender: gender as 'MALE' | 'FEMALE' | 'OTHER',
        city,
        emergencyContact: emergencyContact || null,
        age: age ? parseInt(age) : null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        height: height ? parseFloat(height) : null,
        weight: weight ? parseFloat(weight) : null,
        thighSize: thighSize ? parseFloat(thighSize) : null,
        waistSize: waistSize ? parseFloat(waistSize) : null,
        sleepHours: sleepHours ? parseFloat(sleepHours) : null,
        fitnessLevel: fitnessLevel as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED',
        medicalConditions: medicalConditions || null,
        profilePhotoPath,
        medicalReportPath,
        status: 'PENDING',
      },
    });

    // Send confirmation email
    await sendEmail({
      to: member.email,
      subject: 'We received your Run4Health application!',
      template: 'registration-confirmation',
      vars: {
        firstName: member.firstName,
        email: member.email,
        supportEmail: EMAIL,
      },
    }).catch(() => {}); // don't fail registration if email fails

    return Response.json({
      success: true,
      message: 'Registration submitted! Check your email for confirmation.',
    });
  } catch (err) {
    console.error('Registration error:', err);
    return Response.json({ error: 'Something went wrong. Please try again.' }, { status: 500 });
  }
}
