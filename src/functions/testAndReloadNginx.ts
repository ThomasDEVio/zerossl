import { exec } from 'child_process';

function execShellCommand(cmd: string) {
    return new Promise((resolve, reject) => {
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.warn(error);
                reject(stderr);
            }
            resolve(stdout ? stdout : stderr);
        });
    });
}

export default async function testAndReloadNginx() {
    try {
        console.log('Testing NGINX configuration...');
        const testResult = await execShellCommand('nginx -t');
        console.log(testResult);

        console.log('Reloading NGINX configuration...');
        const reloadResult = await execShellCommand('nginx -s reload');
        console.log(reloadResult);

        console.log('NGINX configuration reloaded successfully.');
        return true;
    } catch (error) {
        console.error('Failed to reload NGINX:', error);
    }
}