/** Types generated for queries found in "src/db/sql/users.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'InsertUser' parameters type */
export interface IInsertUserParams {
  email?: string | null | void;
}

/** 'InsertUser' return type */
export type IInsertUserResult = void;

/** 'InsertUser' query type */
export interface IInsertUserQuery {
  params: IInsertUserParams;
  result: IInsertUserResult;
}

const insertUserIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":45,"b":50}]}],"statement":"INSERT INTO users (\n    email\n) VALUES (\n    :email\n)"};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO users (
 *     email
 * ) VALUES (
 *     :email
 * )
 * ```
 */
export const insertUser = new PreparedQuery<IInsertUserParams,IInsertUserResult>(insertUserIR);


/** 'UpdateUserLogin' parameters type */
export interface IUpdateUserLoginParams {
  email?: string | null | void;
}

/** 'UpdateUserLogin' return type */
export type IUpdateUserLoginResult = void;

/** 'UpdateUserLogin' query type */
export interface IUpdateUserLoginQuery {
  params: IUpdateUserLoginParams;
  result: IUpdateUserLoginResult;
}

const updateUserLoginIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":50,"b":55}]}],"statement":"UPDATE users\nSET last_login = NOW()\nWHERE email = :email"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE users
 * SET last_login = NOW()
 * WHERE email = :email
 * ```
 */
export const updateUserLogin = new PreparedQuery<IUpdateUserLoginParams,IUpdateUserLoginResult>(updateUserLoginIR);


/** 'GetUserByEmail' parameters type */
export interface IGetUserByEmailParams {
  email?: string | null | void;
}

/** 'GetUserByEmail' return type */
export interface IGetUserByEmailResult {
  email: string;
  id: string;
  last_login: Date | null;
  roles: string;
}

/** 'GetUserByEmail' query type */
export interface IGetUserByEmailQuery {
  params: IGetUserByEmailParams;
  result: IGetUserByEmailResult;
}

const getUserByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":34,"b":39}]}],"statement":"SELECT *\nFROM users\nWHERE email = :email\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM users
 * WHERE email = :email
 * LIMIT 1
 * ```
 */
export const getUserByEmail = new PreparedQuery<IGetUserByEmailParams,IGetUserByEmailResult>(getUserByEmailIR);


