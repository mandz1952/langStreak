import { toNano, Address, Cell, contractAddress } from 'ton-core';
import { TonClient, WalletContractV4 } from 'ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { mnemonicToWalletKey } from 'ton-crypto';
import * as fs from 'fs'; // Модуль для работы с файлами

async function run() {
  // 1. Инициализируем клиент для тестнета
  const endpoint = await getHttpEndpoint({ network: 'testnet' });
  const client = new TonClient({ endpoint });

  // 2. Готовим кошелек для развертывания
  // ⚠️ ВАЖНО: Вставьте сюда вашу секретную фразу от ТЕСТОВОГО кошелька
  const mnemonic = "virus spoil episode guard bronze bundle accident assist polar again wing saddle lyrics retreat depart afraid grow craft just recall entire motor shop skirt";
  const key = await mnemonicToWalletKey(mnemonic.split(" "));
  const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
  const walletContract = client.open(wallet);
  const sender = walletContract.sender(key.secretKey);

  // --- Развертывание NFT контракта ---
  console.log('🚀 Deploying NFT Collection contract...');

  // 3. Загружаем скомпилированный код контракта из файла
  const codeHexNFT = fs.readFileSync('./contracts/output_nft/nft.boc.hex', 'utf8');
  const codeCellNFT = Cell.fromBoc(Buffer.from(codeHexNFT, 'hex'))[0];

  // 4. Формируем начальные данные для NFT контракта
  // init(owner: Address, nftCode: Cell, metadata: Cell)
  // ⚠️ ЗАГЛУШКА! Вам нужно будет создать Cell с правильными данными.
  // Для начала можно оставить пустым, чтобы проверить процесс.
  const dataCellNFT = Cell.EMPTY; 

  // 5. Формируем StateInit
  const stateInitNFT = {
    code: codeCellNFT,
    data: dataCellNFT,
  };

  // 6. Получаем будущий адрес контракта
  const contractAddressNFT = contractAddress(0, stateInitNFT);
  console.log(`Future address of NFT contract: ${contractAddressNFT.toString()}`);

  // 7. Отправляем транзакцию развертывания
  await sender.send({
    to: contractAddressNFT,
    value: toNano('0.05'), // 0.05 TON на газ
    init: stateInitNFT,
  });
  console.log('✅ Deployment transaction sent for NFT contract!');

  // Вы можете добавить аналогичный код для staking контракта ниже
}

run().catch(console.error);
