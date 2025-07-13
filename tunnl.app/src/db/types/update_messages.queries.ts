/** Types generated for queries found in "src/db/sql/update_messages.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetLatestUpdateMessage' parameters type */
export type IGetLatestUpdateMessageParams = void;

/** 'GetLatestUpdateMessage' return type */
export interface IGetLatestUpdateMessageResult {
  content: string;
  id: string;
  timestamp: Date;
}

/** 'GetLatestUpdateMessage' query type */
export interface IGetLatestUpdateMessageQuery {
  params: IGetLatestUpdateMessageParams;
  result: IGetLatestUpdateMessageResult;
}

const getLatestUpdateMessageIR: any = {"usedParamSet":{},"params":[],"statement":"SELECT *\nFROM update_messages\nORDER BY timestamp DESC\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM update_messages
 * ORDER BY timestamp DESC
 * LIMIT 1
 * ```
 */
export const getLatestUpdateMessage = new PreparedQuery<IGetLatestUpdateMessageParams,IGetLatestUpdateMessageResult>(getLatestUpdateMessageIR);


