import { Injectable } from '@nestjs/common';
import fetch from 'node-fetch';

import { ExtractBiddingRepository } from '../../application/contracts';
import { ExtractBiddingEntity } from '../../domain/entities';
import { ExtractBiddingParams } from '../../domain/usecases';
import { extractBiddingMapper } from '../util';

Injectable();
export class ExtractBiddingApiRepository implements ExtractBiddingRepository {
  async extract(
    extractParams: ExtractBiddingParams,
  ): Promise<ExtractBiddingEntity[]> {
    const { url } = extractParams;

    try {
      const response = await fetch(url);
      const extractedBids = await response.json();
      return extractBiddingMapper(extractedBids);
    } catch (error) {
      console.log(error);
    }
  }
}
