import forge from 'node-forge';
import { validateCSR } from './validateCSR';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function generateCSR(commonName: string, access_key: string): Promise<any | null> {
    // Generate a keypair
    const keys = forge.pki.rsa.generateKeyPair(2048);

    // Create a certification request (CSR)
    const csr = forge.pki.createCertificationRequest();
    csr.publicKey = keys.publicKey;

    // Set the subject of the CSR
    csr.setSubject([{ name: 'commonName', value: commonName }]);

    // Sign the CSR using the private key
    csr.sign(keys.privateKey);

    // Convert the CSR to PEM format
    const csrPem = forge.pki.certificationRequestToPem(csr);
    const privateKeyPem = forge.pki.privateKeyToPem(keys.privateKey);

    // Validate the CSR before returning it
    const isValid = await validateCSR(csrPem, access_key);
    if (isValid) {
        return { csrPem, privateKeyPem };
    } else {
        console.error('CSR validation failed');
        return null;
    }
}