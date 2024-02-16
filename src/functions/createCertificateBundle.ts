import { access_key, certificates } from "../constants/constants";
import fs from "fs";
import testAndReloadNginx from "./testAndReloadNginx";
import revokeSoonToExpire from "./revokeSoonToExpire";

export default async function createCertificateBundle(
  certificateId: string,
  commonName: string,
  privateKey: string
) {
  // api.zerossl.com/certificates/{id}/download
  // download the certificate and extract
  const certificateInfo = certificates.find((c) => c.domain === commonName);
  const sslPath = certificateInfo?.sslPath || "";
  //get the certificate
  const url = `https://api.zerossl.com/certificates/${certificateId}/download/return?access_key=${access_key}`;
  const response = await fetch(url);
  const certificateData = await response.json();
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const certificatePath = `${sslPath}/certificateBundle.crt`;
  const privateKeyPath = `${sslPath}/private.key`;
  const timeStamp = new Date().getTime();

  if (fs.existsSync(privateKeyPath)) {
    const backupPath = `${privateKeyPath}-${timeStamp}.backup`;
    fs.copyFileSync(privateKeyPath, backupPath);
    console.log(`Existing private key file backed up at: ${privateKeyPath}`);
  }
  fs.writeFileSync(privateKeyPath, privateKey, "utf8");
  console.log(`Private key saved to ${privateKeyPath}`);

  // Extract the certificate and CA bundle from the JSON object
  const certificate = certificateData[Object.keys(certificateData)[0]];
  const caBundle = certificateData[Object.keys(certificateData)[1]];

  const finalContent = `${certificate}${caBundle}`;

  if (fs.existsSync(certificatePath)) {
    const backupPath = `${certificatePath}-${timeStamp}.backup`;
    fs.copyFileSync(certificatePath, backupPath);
    console.log(`Existing file backed up at: ${backupPath}`);
  }

  // Write to the certificateBundle.crt file
  fs.writeFileSync(certificatePath, finalContent, "utf8");

  console.log(`Certificate bundle created at: ${certificatePath}`);

  if (await testAndReloadNginx()) {
    console.log("Nginx reloaded successfully");
    //delete the expiring soon certificate
    await revokeSoonToExpire(commonName)
  }
}
