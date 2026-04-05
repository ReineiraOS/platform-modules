import { VerifyWalletDtoSchema } from '../../../../src/application/dto/auth/verify-wallet.dto.js';
import { VerifyWalletUseCase } from '../../../../src/application/use-case/auth/verify-wallet.use-case.js';
import { container } from '../../../../src/infrastructure/container.js';
import { createHandler } from '../../../../src/interface/handler-factory.js';
import { withCors } from '../../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../../src/interface/response.js';

const useCase = new VerifyWalletUseCase(
  container.siweVerifier,
  container.nonceService,
  container.userRepo,
  container.sessionRepo,
  container.jwtService,
);

const handler = createHandler({
  operationName: 'VerifyWallet',
  schema: VerifyWalletDtoSchema,
  execute: async (dto) => {
    const result = await useCase.execute(dto);
    return Response.ok(result);
  },
});

export default withCors(handler);
