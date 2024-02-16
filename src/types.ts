/* eslint-disable @typescript-eslint/no-explicit-any */
export type APICertificate = {
    id: string;
    type: string;
    common_name: string;
    additional_domains: string;
    created: string;
    expires: string;
    status: string;
    validation_type: string;
    validation_emails: string;
    replacement_for: string;
    fingerprint_sha1: string;
    brand_validation: null | string; // Assuming it can be null or string
    validation: any; // Replace 'any' with a more specific type if you know the structure of the validation object
};
