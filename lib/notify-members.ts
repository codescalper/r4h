import prisma from './prisma';
import { sendEmail } from './email';
import { BASE_URL } from './constants';

interface NotifyOptions {
  type: 'program' | 'post';
  title: string;
  excerpt: string;
  slug: string;
  /** Extra meta items shown in the email card, e.g. date or category */
  meta?: Array<{ label: string; value: string }>;
}

/**
 * Fan-out email notifications to all APPROVED members who have
 * emailNotifications enabled. Errors per-member are swallowed so one bad
 * address can't abort the whole batch.
 */
export async function notifyMembers(opts: NotifyOptions): Promise<void> {
  const { type, title, excerpt, slug, meta = [] } = opts;

  const members = await prisma.member.findMany({
    where: { status: 'APPROVED', emailNotifications: true },
    select: { firstName: true, email: true },
  });

  if (!members.length) return;

  const isProgram = type === 'program';
  const typeBadge  = isProgram ? 'New Program' : 'New Article';
  const introText  = isProgram
    ? 'A new program has just been added — check it out and mark your calendar!'
    : 'A new article has been published on the Run4Health blog. Take a look!';
  const ctaLabel   = isProgram ? 'View Program →' : 'Read Article →';
  const ctaLink    = `${BASE_URL}/${isProgram ? 'programs' : 'news'}/${slug}`;
  const dashboardLink = `${BASE_URL}/member/dashboard`;
  const supportEmail = process.env.EMAIL ?? 'support@run4health.in';

  const metaHtml = meta
    .filter((m) => m.value)
    .map((m) => `<span class="meta-item">${m.label}: ${m.value}</span>`)
    .join('');

  // Fire all sends concurrently; swallow individual failures
  await Promise.allSettled(
    members.map((m) =>
      sendEmail({
        to: m.email,
        subject: `${typeBadge}: ${title}`,
        template: 'notification',
        vars: {
          subject: `${typeBadge}: ${title}`,
          firstName: m.firstName,
          typeBadge,
          introText,
          title,
          excerpt: excerpt || 'Click below to read more.',
          metaHtml,
          ctaLabel,
          ctaLink,
          dashboardLink,
          supportEmail,
        },
      })
    )
  );
}
