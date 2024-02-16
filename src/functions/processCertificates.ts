import issueCertificate from "./issueCertificate"
import { certificates } from "../constants/constants"
import getCertificates from "./getExpiringSoonCertificates"

export default async function processCertificates() {
    const apiCertificates = await getCertificates()
    // Loop through each certificate from API
    for (const apiCert of apiCertificates) {
        // Find a matching certificate from your predefined list
        const match = certificates.find((c) => c.domain === apiCert.common_name)
  
        if (match) {
            // Call the issueCertificate function with the API certificate data
            await issueCertificate(apiCert)
        }
    }
}
  