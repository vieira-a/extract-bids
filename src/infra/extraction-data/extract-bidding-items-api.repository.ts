import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

import { ExtractBiddingItemsRepository } from '../../application/contracts';
import { ExtractBiddingItemsEntity } from '../../domain/entities';
import { ExtractBiddingItemsParams } from '../../domain/usecases';
import { extractBiddingItemMapper } from '../util';

@Injectable()
export class ExtractBiddingItemsApiRepository
  implements ExtractBiddingItemsRepository
{
  async extractItems(
    extractParams: ExtractBiddingItemsParams,
  ): Promise<ExtractBiddingItemsEntity[]> {
    const { url, code } = extractParams;

    try {
      const response = await fetch(url);
      const extractedBidsItems = await response.json();

      const mappedItems = extractBiddingItemMapper(extractedBidsItems, code);
      return mappedItems;
    } catch (error) {
      return [];
    }
  }
}
