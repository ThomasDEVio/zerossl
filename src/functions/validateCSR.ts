
export async function validateCSR(
  csrPem: string,
  access_key: string
): Promise<boolean> {
  try {
    const response = await fetch(`https://api.zerossl.com/validation/csr?access_key=${access_key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        csr: csrPem,
        access_key: access_key,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      return data.valid;
    } else {
      // Log the error response from the server
      console.error("CSR validation failed with status:", response.status);
      const errorResponse = await response.json();
      console.error("Error details:", errorResponse);
      return false;
    }
  } catch (error) {
    console.error("Error in CSR validation:", error);
    return false;
  }
}
