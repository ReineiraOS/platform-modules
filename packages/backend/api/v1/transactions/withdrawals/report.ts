import { z } from 'zod';
import { ReportWithdrawalTransactionDtoSchema } from '../../../../src/application/dto/transaction/report-transaction.dto.js';
import { ReportWithdrawalTransactionUseCase } from '../../../../src/application/use-case/transaction/report-withdrawal-transaction.use-case.js';
import { container } from '../../../../src/infrastructure/container.js';
import { createHandler } from '../../../../src/interface/handler-factory.js';
import { withAuth } from '../../../../src/interface/middleware/with-auth.js';
import { withCors } from '../../../../src/interface/middleware/with-cors.js';
import { Response } from '../../../../src/interface/response.js';

const useCase = new ReportWithdrawalTransactionUseCase(container.withdrawalRepo);

const RouteSchema = ReportWithdrawalTransactionDtoSchema.extend({
  withdrawal_public_id: z.string().min(1),
});

const handler = createHandler({
  operationName: 'ReportWithdrawalTransaction',
  schema: RouteSchema,
  execute: async (dto, _req, authPayload) => {
    const { withdrawal_public_id, ...reportDto } = dto;
    const result = await useCase.execute(reportDto, authPayload!.userId, withdrawal_public_id);
    return Response.ok(result);
  },
});

export default withCors(withAuth(handler));
