import { access_key } from "../constants/constants";
import createCertificateBundle from "./createCertificateBundle";

export default async function validateCertificate(certificateId: string,privateKey: string) {
    const url = `https://api.zerossl.com/certificates/${certificateId}/challenges?access_key=${access_key}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `validation_method=HTTPS_CSR_HASH`
        });


        const data = await response.json();


        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        //check if the certificate is validated

        if(data.status === "pending_validation") {
            console.log('Certificate is pending validation', certificateId, data.common_name);
            //sleep 30 seconds
            await new Promise(resolve => setTimeout(resolve, 60000));
            return await createCertificateBundle(certificateId, data.common_name,privateKey)
        }

    } catch (error) {
        console.error('Error validating certificate:', error);
        return null;
    }
}