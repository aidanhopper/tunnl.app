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


/** 'InsertUpdateMessage' parameters type */
export interface IInsertUpdateMessageParams {
  content?: string | null | void;
}

/** 'InsertUpdateMessage' return type */
export interface IInsertUpdateMessageResult {
  content: string;
  id: string;
  timestamp: Date;
}

/** 'InsertUpdateMessage' query type */
export interface IInsertUpdateMessageQuery {
  params: IInsertUpdateMessageParams;
  result: IInsertUpdateMessageResult;
}

const insertUpdateMessageIR: any = {"usedParamSet":{"content":true},"params":[{"name":"content","required":false,"transform":{"type":"scalar"},"locs":[{"a":57,"b":64}]}],"statement":"INSERT INTO update_messages (\n    content\n) VALUES (\n    :content\n) RETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO update_messages (
 *     content
 * ) VALUES (
 *     :content
 * ) RETURNING *
 * ```
 */
export const insertUpdateMessage = new PreparedQuery<IInsertUpdateMessageParams,IInsertUpdateMessageResult>(insertUpdateMessageIR);


