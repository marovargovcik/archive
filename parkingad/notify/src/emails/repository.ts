import sendgrid from '@sendgrid/mail';
import type { SendEmailRequest } from 'parkingad-helpers/types';

const sendEmail = async ({ subject, text, to }: SendEmailRequest) => {
  await sendgrid.send({
    from: 'vargovcik.marek@gmail.com',
    replyTo: 'vargovcik.marek@gmail.com',
    subject,
    text,
    to,
  });
};

export { sendEmail };
