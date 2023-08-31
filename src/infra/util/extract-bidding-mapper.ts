import { ExtractBiddingApiResponse } from '../contracts/extract-bidding-api-response';
import { ExtractBiddingEntity } from '../../domain/entities';

export function extractBiddingMapper(
  apiResponse: ExtractBiddingApiResponse,
): ExtractBiddingEntity[] {
  return apiResponse.result.map((apiData) => ({
    codigoLicitacao: apiData.codigoLicitacao,
    identificacao: apiData.identificacao,
    numero: apiData.numero,
    resumo: apiData.resumo,
    codigoSituacaoEdital: apiData.codigoSituacaoEdital,
    status: apiData.status,
    dataHoraInicioLances: apiData.dataHoraInicioLances,
  }));
}
