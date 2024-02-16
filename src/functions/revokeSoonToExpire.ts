import { access_key } from "../constants/constants";
import revokeCertificate from "./revokeCertificate";

export default async function revokeSoonToExpire(commonName: string) {
    const baseUrl = 'https://api.zerossl.com/certificates';
    const url = new URL(baseUrl);
    url.searchParams.append('access_key', access_key);
    url.searchParams.append('search', commonName);
    url.searchParams.append('certificate_status', 'issued');

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        const certificates = data.results; // Assuming the response contains an array of certificates

        // Get today's date without time for comparison
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        for (const cert of certificates) {
            const createdDate = new Date(cert.created);
            createdDate.setHours(0, 0, 0, 0);

            // Check if the certificate wasn't issued today
            if (createdDate < today) {
                console.log(`Revoking certificate ${cert.common_name} with ID ${cert.id}`);
                await revokeCertificate(cert.id);
            }
        }
    } catch (error) {
        console.error('Error in revokeSoonToExpire:', error);
        return false;
    }
}


