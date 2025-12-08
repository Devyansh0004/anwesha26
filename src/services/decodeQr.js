import SHA256 from "crypto-js/sha256";

// Read env properly in Next.js
const SECRET_KEY = process.env.NEXT_PUBLIC_SECRET_KEY_QR_HASHING;

// Generate secure QR payload
export const generateQrPayload = (user) => {
  if (!user?.anweshaId) return "";

  const userDataString = [
    user.anweshaId,
    user.firstName,
    user.lastName,
    user.email,
    user.contact || "",
    user.college || "",
    user.dob || "",
    user.gender || ""
  ].join("|");

  const hash = SHA256(userDataString + SECRET_KEY).toString();
  const base64Data = btoa(userDataString);

  return `${base64Data}|${hash}`;
};

// Verify QR payload
export const verifyQrPayload = (qrString) => {
  if (!qrString) return false;

  const parts = qrString.split("|");
  if (parts.length !== 2) return false;

  const [base64Data, receivedHash] = parts;
  const originalData = atob(base64Data);

  const recalculatedHash = SHA256(originalData + SECRET_KEY).toString();

  return receivedHash === recalculatedHash;
};
