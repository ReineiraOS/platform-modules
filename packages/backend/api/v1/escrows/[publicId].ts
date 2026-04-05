import { GetEscrowByIdUseCase } from '../../../src/application/use-case/escrow/get-escrow-by-id.use-case.js';
import { container } from '../../../src/infrastructure/container.js';
import { createGetHandler } from '../../../src/interface/handler-factory.js';
import { withAuth } from '../../../src/interface/middleware/with-auth.js';
import { withCors } from '../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../src/interface/response.js';

const useCase = new GetEscrowByIdUseCase(container.escrowRepo);

const handler = createGetHandler({
  operationName: 'GetEscrowById',
  execute: async (req) => {
    const publicId = req.query.publicId as string;
    const result = await useCase.execute(publicId);
    return Response.ok(result);
  },
});

export default withCors(withAuth(handler));
