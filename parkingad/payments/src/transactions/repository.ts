import * as fs from 'node:fs/promises';
import { generateRandomId } from 'parkingad-helpers/generateRandomId';
import { mysql } from 'parkingad-helpers/mysql';
import { channel } from 'parkingad-helpers/rabbitmq';
import { redisRO, redisWO } from 'parkingad-helpers/redis';
import type {
  CreateTransactionRequest,
  CreateTransactionResponse,
  Transaction,
  SendEmailRequest,
} from 'parkingad-helpers/types';

const createTransaction = async ({
  callbacks,
  transaction: { amount, currency, email, firstName, item, lastName },
}: CreateTransactionRequest): Promise<CreateTransactionResponse> => {
  const id = generateRandomId();

  await mysql.execute(
    'INSERT INTO transactions VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [id, firstName, lastName, email, amount, currency, item, false],
  );

  await redisWO.set(id, JSON.stringify(callbacks));

  return {
    redirect: `${process.env.PARKINGAD_PAYMENTS_HOST}/transactions/${id}/payment`,
  };
};

const completeTransaction = async (id: Transaction['id']) => {
  const cache = (await redisRO.get(id)) as string;
  const callbacks = JSON.parse(cache) as CreateTransactionRequest['callbacks'];
  try {
    await mysql.execute(
      'UPDATE transactions SET completed = true WHERE id = ?',
      [id],
    );
    return callbacks.success;
  } catch {
    return callbacks.cancel;
  }
};

const getTransactionById = async (id: Transaction['id']) => {
  const [rows] = await mysql.query(
    'SELECT * FROM transactions WHERE id = ? LIMIT 1',
    [id],
  );

  if (!Array.isArray(rows)) {
    throw new TypeError('RESULTSET_NOT_AN_ARRAY');
  }

  if (rows.length === 0) {
    throw new Error('TRANSACTION_NOT_FOUND');
  }

  return rows[0] as Transaction;
};

const prepareTemplate = async ({
  id,
  firstName,
  lastName,
  email,
  amount,
  currency,
  item,
}: Transaction) => {
  const template = await fs.readFile('src/transactions/templates/[id].html');
  const html = template
    .toString()
    .replaceAll('__id__', id)
    .replaceAll('__firstName__', firstName)
    .replaceAll('__lastName__', lastName)
    .replaceAll('__email__', email)
    .replaceAll('__amount__', amount.toString())
    .replaceAll('__currency__', currency)
    .replaceAll('__item__', item);
  return html;
};

const sendTransactionReceipt = async (id: string) => {
  const transaction = await getTransactionById(id);

  const sendEmailRequest: SendEmailRequest = {
    subject: `Receipt ${transaction.id}`,
    text: [
      'Thank you for your purchase!',
      'Here is your receipt:',
      '',
      `Name: ${transaction.firstName} ${transaction.lastName}`,
      `Booked parking: ${transaction.item}`,
      `Price: ${transaction.amount}${transaction.currency}`,
    ].join('\n'),
    to: transaction.email,
  };

  await channel.assertExchange('sendEmail', 'direct', {
    durable: false,
  });

  channel.publish(
    'sendEmail',
    '',
    Buffer.from(JSON.stringify(sendEmailRequest)),
  );
};

export {
  createTransaction,
  completeTransaction,
  getTransactionById,
  prepareTemplate,
  sendTransactionReceipt,
};
