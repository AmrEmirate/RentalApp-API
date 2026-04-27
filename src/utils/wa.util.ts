export const sendWaNotification = async (message: string, recipientId?: string) => {
  // TODO: Integrasi WhatsApp API (contoh: Twilio, Wablas, Fonnte)
  console.log(`[WA Notification to ${recipientId || "Admin"}]: ${message}`);
  // return await fetch("...");
};
