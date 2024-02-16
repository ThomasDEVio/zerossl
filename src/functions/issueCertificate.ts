import { APICertificate } from "../types";
import { access_key } from "../constants/constants";
import generateCSR from "./generateCSR";
import checkForDuplicate from "./checkForDuplicate";
import createValidationFile from "./createValidationFile";

export default async function issueCertificate(certData: APICertificate) {
  const common_name = certData.common_name;

  try {
    // Check for duplicate certificate using common name
    const hasDuplicate = await checkForDuplicate(common_name);
    if (hasDuplicate) {
      return false;
    }

    // Generate CSR
    const {csrPem,privateKeyPem} = await generateCSR(common_name, access_key);
    if (!csrPem) {
      console.error("Failed to generate CSR");
      return false;
    }

    // Issue the certificate
    console.log("Issuing certificate for", common_name);
    const response = await fetch(
      `https://api.zerossl.com/certificates?access_key=${access_key}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `certificate_csr=${encodeURIComponent(
          csrPem
        )}&certificate_domains=${common_name}&certificate_validity_days=90&replacement_for_certificate=${
          certData.id
        }`,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await createValidationFile(data,privateKeyPem)
  } catch (error) {
    console.error("Error issuing certificate:", error);
    console.log("Failed to issue certificate for", common_name)
    return null;
  }
}
