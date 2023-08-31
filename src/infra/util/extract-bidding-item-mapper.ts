import { ExtractBiddingItemsApiResponse } from '../contracts/extract-bidding-api-response';
import { BiddingItems } from '../../domain/entities';

export function extractBiddingItemMapper(
  apiResponse: ExtractBiddingItemsApiResponse,
  biddingCode: string,
): BiddingItems[] {
  return apiResponse.itens.result.map((apiData) => ({
    codigoLicitacao: biddingCode,
    codigo: apiData.codigo,
    descricao: apiData.descricao,
    participacao: apiData.participacao,
    quantidade: apiData.quantidade,
    valorReferencia: apiData.valorReferencia,
  }));
}
