export type ExtractBiddingEntity = {
  codigoLicitacao: string;
  identificacao: string;
  numero: string;
  resumo: string;
  codigoSituacaoEdital: number;
  status: number;
  dataHoraInicioLances: string;
};

export type BiddingItems = {
  codigoLicitacao: string;
  quantidade: number;
  valorReferencia: number;
  descricao: string;
  participacao: number;
  codigo: number;
};
