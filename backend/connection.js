const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');

let contractInstance;

async function connect() {
  if (contractInstance) {
    return { contract: contractInstance };
  }

  const ccpPath = "/home/koushik3226/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/connection-org1.json";
  const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));

  const walletPath = path.join(__dirname, 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  const gateway = new Gateway();
  await gateway.connect(ccp, {
    wallet,
    identity: 'Admin@org1.example.com',
    discovery: { enabled: false }
  });

  const network = await gateway.getNetwork('mychannel');
  contractInstance = network.getContract('medicine');

  return { contract: contractInstance };
}

module.exports = connect;