const twilio = require('twilio');

const TWILIO_SID = process.env.TWILIO_SID || process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN;
const TWILIO_WHATSAPP_NUMBER = process.env.TWILIO_WHATSAPP_NUMBER;
const ADMIN_WHATSAPP_NUMBER =
  process.env.ADMIN_WHATSAPP_NUMBER || process.env.TWILIO_TO_WHATSAPP_NUMBER;

const isConfigured = Boolean(
  TWILIO_SID &&
  TWILIO_AUTH_TOKEN &&
  TWILIO_WHATSAPP_NUMBER &&
  ADMIN_WHATSAPP_NUMBER
);
const client = isConfigured ? twilio(TWILIO_SID, TWILIO_AUTH_TOKEN) : null;

const toWhatsAppAddress = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return '';
  return raw.startsWith('whatsapp:') ? raw : `whatsapp:${raw}`;
};

const resolveOrderItemsText = async (order) => {
  const items = Array.isArray(order?.items) ? order.items : [];
  if (!items.length) {
    return 'N/A';
  }

  return items
    .map((item, index) => {
      const productName = item?.productId?.name || item?.name || 'Product';
      const quantity = item?.quantity || 1;
      return `${index + 1}. ${productName} x ${quantity}`;
    })
    .join('\n');
};

const sendWhatsAppMessage = async (order) => {
  if (!isConfigured || !client) {
    return;
  }

  const customerName = order?.customerName || 'N/A';
  const phone = order?.phone || 'N/A';
  const address = order?.address || 'N/A';
  const totalAmount = order?.totalAmount ?? 0;

  const from = toWhatsAppAddress(TWILIO_WHATSAPP_NUMBER);
  const to = toWhatsAppAddress(ADMIN_WHATSAPP_NUMBER);
  const productsText = await resolveOrderItemsText(order);
  const time = new Date().toLocaleString();
  const body = `New Order Received\n\nTime: ${time}\n\nName: ${customerName}\nPhone: ${phone}\nAddress: ${address}\n\nItems:\n${productsText}\n\nTotal: INR ${totalAmount}`;

  try {
    const response = await client.messages.create({
      body,
      from,
      to,
    });
    console.info(`Twilio message sent: SID=${response.sid}, Status=${response.status}`);
  } catch (error) {
    console.error(error?.code);
    console.error(error?.message || error);
    console.error(error?.response?.data);
  }
};

module.exports = {
  sendWhatsAppMessage,
};
