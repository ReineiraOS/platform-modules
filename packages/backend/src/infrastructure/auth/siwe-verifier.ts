import { SiweMessage } from 'siwe';
import { createPublicClient, http } from 'viem';
import { arbitrumSepolia } from 'viem/chains';
import { getEnv } from '../../core/config.js';
import { getLogger } from '../../core/logger.js';

const logger = getLogger('SiweVerifier');

export class SiweVerifier {
  async verify(message: string, signature: string): Promise<{ address: string; valid: boolean }> {
    try {
      const siweMessage = new SiweMessage(message);
      const address = siweMessage.address as `0x${string}`;

      logger.info({ address, nonce: siweMessage.nonce }, 'Verifying SIWE signature');

      const rpcUrl = getEnv().RPC_URL || undefined;
      if (!rpcUrl) {
        logger.warn('RPC_URL not set, ERC-6492 verification will fail for smart accounts');
      }

      const publicClient = createPublicClient({
        chain: arbitrumSepolia,
        transport: http(rpcUrl),
      });

      const valid = await publicClient.verifyMessage({
        address,
        message,
        signature: signature as `0x${string}`,
      });

      logger.info({ address, valid }, 'SIWE verification result');
      return { address: siweMessage.address, valid };
    } catch (error) {
      logger.error({ error: error instanceof Error ? error.message : error }, 'SIWE verification failed');
      return { address: '', valid: false };
    }
  }
}
