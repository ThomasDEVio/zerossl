/* eslint-disable @typescript-eslint/no-explicit-any */
import { access_key } from "../constants/constants";
import cancelCertificate from "./cancelCertificate";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import validateCertificate from "./validateCertificate";

export default async function checkForDuplicate(commonName: string) {
    const baseUrl = 'https://api.zerossl.com/certificates';
    const url = new URL(baseUrl);
    url.searchParams.append('access_key', access_key);
    url.searchParams.append('search', commonName);

    try {
        const response = await fetch(url.toString());
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // Assuming the response contains an array of certificates
        const certificates = data.results; // Adjust this according to the actual response structure

        //check the certificates object for the commonName, there can be many cancelled certificates
        //only one issued & if there is a draft try to validate it
        //else return false

        const issuedCertificates = certificates.filter((cert: any) => cert.status === 'issued');
        if (issuedCertificates.length > 1) {
            console.log('Duplicate issued certificate found for', commonName);
            return true;
        }

        const draftCertificates = certificates.filter((cert: any) => cert.status === 'draft');
        if (draftCertificates.length > 0) {
            // console.log('Duplicate draft certificate found, trying to validate', draftCertificates[0].id, 'for', commonName);
            await cancelCertificate(draftCertificates[0].id);
            return false
        }

        return false;

    } catch (error) {
        console.error('Error checking for duplicate certificate:', error);
        return false;
    }
}

