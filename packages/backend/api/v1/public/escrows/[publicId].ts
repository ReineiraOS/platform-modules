import { GetPublicEscrowUseCase } from '../../../../src/application/use-case/escrow/get-public-escrow.use-case.js';
import { container } from '../../../../src/infrastructure/container.js';
import { createGetHandler } from '../../../../src/interface/handler-factory.js';
import { withCors } from '../../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../../src/interface/response.js';

const useCase = new GetPublicEscrowUseCase(container.escrowRepo);

const handler = createGetHandler({
  operationName: 'GetPublicEscrow',
  execute: async (req) => {
    const publicId = req.query.publicId as string;
    const result = await useCase.execute(publicId);
    return Response.ok(result);
  },
});

export default withCors(handler);
