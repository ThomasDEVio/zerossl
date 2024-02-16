import axios from "axios"
import { access_key } from "../constants/constants"

export default async function getExpiringSoonCertificates() {
	try {
		const response = await axios.get(`https://api.zerossl.com/certificates?access_key=${access_key}&certificate_status=expiring_soon`) // Replace with your API URL
		const apiCertificates = response.data.results // Assuming the API response structure
		return apiCertificates
	} catch (error) {
		console.error("Error fetching certificates:", error)
	}
}
