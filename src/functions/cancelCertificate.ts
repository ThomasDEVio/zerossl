import { access_key } from "../constants/constants";

export default async function revokeCertificate(id: string) {
    const url = `https://api.zerossl.com/certificates/${id}/cancel?access_key=${access_key}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(`Certificate canceled for ${id}`);
        return true;
    } catch (error) {
        console.error('Error canceling certificate:', error);
        return false;
    }
}