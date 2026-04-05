import { ReportEscrowTransactionDtoSchema } from '../../../../src/application/dto/transaction/report-transaction.dto.js';
import { ReportEscrowTransactionUseCase } from '../../../../src/application/use-case/transaction/report-escrow-transaction.use-case.js';
import { container } from '../../../../src/infrastructure/container.js';
import { createHandler } from '../../../../src/interface/handler-factory.js';
import { withAuth } from '../../../../src/interface/middleware/with-auth.js';
import { withCors } from '../../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../../src/interface/response.js';

const useCase = new ReportEscrowTransactionUseCase(container.escrowRepo, container.escrowEventRepo);

const handler = createHandler({
  operationName: 'ReportEscrowTransaction',
  schema: ReportEscrowTransactionDtoSchema,
  execute: async (dto, _req, authPayload) => {
    const result = await useCase.execute(dto, authPayload!.userId);
    return Response.ok(result);
  },
});

export default withCors(withAuth(handler));
