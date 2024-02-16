/* eslint-disable @typescript-eslint/no-explicit-any */
import fs from "fs";
import path from "path";
import validateCertificate from "./validateCertificate";
import { certificates } from "../constants/constants";

export default async function createValidationFile(data: any, privateKey: any) {
  // Find the matching certificate info based on the domain
  const certificateInfo = certificates.find(
    (c) => c.domain === data.common_name
  );

  if (!certificateInfo) {
    throw new Error(
      `No certificate information found for domain: ${data.common_name}`
    );
  }

  const pkiValidationPath = certificateInfo.pkiValidationPath;

  // Rest of the domainValidationInfo extraction remains the same
  const domainValidationInfo = data.validation.other_methods[data.common_name];
  if (!domainValidationInfo) {
    throw new Error("Validation information for the domain is not found");
  }

  const fileUrl = new URL(domainValidationInfo.file_validation_url_https);
  const filePath = fileUrl.pathname;
  const fileName = path.basename(filePath);
  const fileContents = domainValidationInfo.file_validation_content.join("\n");

  //delete other files from the directory
  fs.readdirSync(pkiValidationPath).forEach((file) => {
    if (file !== fileName) {
      fs.unlinkSync(path.join(pkiValidationPath, file));
    }
  });

  // Write the file
  fs.writeFileSync(path.join(pkiValidationPath, fileName), fileContents);

  // Continue with certificate validation
  return await validateCertificate(data.id,privateKey);
}
