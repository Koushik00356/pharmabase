const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

async function main() {
    try {
        console.log("🚀 Script started");

        const walletPath = path.join(__dirname, 'wallet');
        console.log("Wallet path:", walletPath);

        const wallet = await Wallets.newFileSystemWallet(walletPath);

        const credPath = "/home/koushik3226/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp";
        console.log("Cred path:", credPath);
        const certFiles = fs.readdirSync(path.join(credPath, 'signcerts'));
        const cert = fs.readFileSync(
            path.join(credPath, 'signcerts', certFiles[0])
        ).toString();

        const keyDir = path.join(credPath, 'keystore');
        const keyFiles = fs.readdirSync(keyDir);

        console.log("Key files:", keyFiles);

        const key = fs.readFileSync(
            path.join(keyDir, keyFiles[0])
        ).toString();

        const identity = {
            credentials: {
                certificate: cert,
                privateKey: key,
            },
            mspId: 'Org1MSP',
            type: 'X.509',
        };

        await wallet.put('Admin@org1.example.com', identity);

        console.log('✅ Admin identity added to wallet');
    } catch (error) {
        console.error("❌ ERROR:", error);
    }
}

main();