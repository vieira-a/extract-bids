import { ExtractBiddingItemsApiResponse } from '../contracts';
import { ExtractBiddingItemsEntity } from '../../domain/entities';

export function extractBiddingItemMapper(
  apiResponse: ExtractBiddingItemsApiResponse,
  biddingCode: string,
): ExtractBiddingItemsEntity[] {
  if (apiResponse.isLote && apiResponse.lotes && apiResponse.lotes.result) {
    const lotes = apiResponse.lotes.result;
    if (lotes.length > 0 && lotes[0].itens) {
      const loteItens = lotes[0].itens.map((apiData) => ({
        codigoLicitacao: biddingCode,
        codigo: apiData.codigo,
        descricao: apiData.descricao,
        participacao: apiData.participacao,
        quantidade: apiData.quantidade,
        valorReferencia: apiData.valorReferencia,
      }));

      console.log('Itens do Lote (isLote=true):', loteItens);

      return loteItens;
    }
  } else if (apiResponse.itens && apiResponse.itens.result) {
    const normalItems = apiResponse.itens.result.map((apiData) => ({
      codigoLicitacao: biddingCode,
      codigo: apiData.codigo,
      descricao: apiData.descricao,
      participacao: apiData.participacao,
      quantidade: apiData.quantidade,
      valorReferencia: apiData.valorReferencia,
    }));

    console.log('Itens Normais (isLote=false):', normalItems);

    return normalItems;
  }
}
