const nodemailer = require('nodemailer');

function createTransporter() {
  const service = process.env.EMAIL_SERVICE || 'gmail';

  if (service === 'gmail') {
    return nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });
  }

  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT || 587),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });
}

function formatDateTime(value) {
  if (!value) return 'не вказано';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('uk-UA', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

async function sendReminder(task) {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error('Email не налаштовано. Заповніть EMAIL_USER та EMAIL_PASS у файлі .env');
  }

  if (!task.reminderEmail) {
    throw new Error('Для задачі не вказано email для нагадування');
  }

  const transporter = createTransporter();
  const from = process.env.EMAIL_FROM || process.env.EMAIL_USER;
  const dueDate = formatDateTime(task.dueDate);

  await transporter.sendMail({
    from: `Task Manager Lab <${from}>`,
    to: task.reminderEmail,
    subject: `Нагадування про задачу: ${task.title}`,
    text: `Нагадування про задачу\n\nНазва: ${task.title}\nОпис: ${task.description || 'Без опису'}\nДедлайн: ${dueDate}\n\nЦей лист надіслано з лабораторної роботи Task Manager.`,
    html: `
      <h2>Нагадування про задачу</h2>
      <p><b>Назва:</b> ${task.title}</p>
      <p><b>Опис:</b> ${task.description || 'Без опису'}</p>
      <p><b>Дедлайн:</b> ${dueDate}</p>
      <hr />
      <p>Цей лист надіслано з лабораторної роботи Task Manager.</p>
    `
  });

  return { message: `Email-нагадування надіслано на ${task.reminderEmail}` };
}

module.exports = { sendReminder };
