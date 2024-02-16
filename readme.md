<!-- - use api.zerossl.com/certificates?access_key=d381b2f56b6927ba8a2f52ec5f4dd35c& -->
<!-- - for all expired or expiring soon certificates -->
<!-- - issue a new certificate for that domain -->
 
<!-- - use api.zerossl.com/certificates/4cf8a21ca181533e44283d6b3a9e3ce1/challenges?access_key=d381b2f56b6927ba8a2f52ec5f4dd35c
     with   validation_method = HTTPS_CSR_HASH -->
<!-- - after the certificate is issued, download it -->
<!-- - upload it to the server /etc/ssl/, unzip it -->
<!-- - delete the old certificate -->
<!-- cat certificate.crt ca_bundle.crt >> certificateBundle.crt -->
<!-- - nginx -t && nginx -s reload -->

This is a node.js tool written in typescript that checks for expiring certificates and issues new ones using the ZeroSSL API. It also downloads and uploads the new certificates to the server and reloads the nginx server.

