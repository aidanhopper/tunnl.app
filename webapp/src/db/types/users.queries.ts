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


/** 'SelectUserByEmail' parameters type */
export interface ISelectUserByEmailParams {
  email?: string | null | void;
}

/** 'SelectUserByEmail' return type */
export interface ISelectUserByEmailResult {
  email: string;
  id: string;
  last_login: Date;
  roles: string;
}

/** 'SelectUserByEmail' query type */
export interface ISelectUserByEmailQuery {
  params: ISelectUserByEmailParams;
  result: ISelectUserByEmailResult;
}

const selectUserByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":34,"b":39}]}],"statement":"SELECT *\nFROM users\nWHERE email = :email\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM users
 * WHERE email = :email
 * LIMIT 1
 * ```
 */
export const selectUserByEmail = new PreparedQuery<ISelectUserByEmailParams,ISelectUserByEmailResult>(selectUserByEmailIR);


/** 'SelectUserById' parameters type */
export interface ISelectUserByIdParams {
  id?: string | null | void;
}

/** 'SelectUserById' return type */
export interface ISelectUserByIdResult {
  email: string;
  id: string;
  last_login: Date;
  roles: string;
}

/** 'SelectUserById' query type */
export interface ISelectUserByIdQuery {
  params: ISelectUserByIdParams;
  result: ISelectUserByIdResult;
}

const selectUserByIdIR: any = {"usedParamSet":{"id":true},"params":[{"name":"id","required":false,"transform":{"type":"scalar"},"locs":[{"a":31,"b":33}]}],"statement":"SELECT *\nFROM users\nWHERE id = :id\nLIMIT 1"};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM users
 * WHERE id = :id
 * LIMIT 1
 * ```
 */
export const selectUserById = new PreparedQuery<ISelectUserByIdParams,ISelectUserByIdResult>(selectUserByIdIR);


/** 'ApproveUserByEmail' parameters type */
export interface IApproveUserByEmailParams {
  email?: string | null | void;
}

/** 'ApproveUserByEmail' return type */
export interface IApproveUserByEmailResult {
  email: string;
  id: string;
  last_login: Date;
  roles: string;
}

/** 'ApproveUserByEmail' query type */
export interface IApproveUserByEmailQuery {
  params: IApproveUserByEmailParams;
  result: IApproveUserByEmailResult;
}

const approveUserByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":50,"b":55}]}],"statement":"UPDATE users\nSET roles = 'approved'\nWHERE email = :email\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE users
 * SET roles = 'approved'
 * WHERE email = :email
 * RETURNING *
 * ```
 */
export const approveUserByEmail = new PreparedQuery<IApproveUserByEmailParams,IApproveUserByEmailResult>(approveUserByEmailIR);


/** 'UnapproveUserByEmail' parameters type */
export interface IUnapproveUserByEmailParams {
  email?: string | null | void;
}

/** 'UnapproveUserByEmail' return type */
export interface IUnapproveUserByEmailResult {
  email: string;
  id: string;
  last_login: Date;
  roles: string;
}

/** 'UnapproveUserByEmail' query type */
export interface IUnapproveUserByEmailQuery {
  params: IUnapproveUserByEmailParams;
  result: IUnapproveUserByEmailResult;
}

const unapproveUserByEmailIR: any = {"usedParamSet":{"email":true},"params":[{"name":"email","required":false,"transform":{"type":"scalar"},"locs":[{"a":42,"b":47}]}],"statement":"UPDATE users\nSET roles = ''\nWHERE email = :email\nRETURNING *"};

/**
 * Query generated from SQL:
 * ```
 * UPDATE users
 * SET roles = ''
 * WHERE email = :email
 * RETURNING *
 * ```
 */
export const unapproveUserByEmail = new PreparedQuery<IUnapproveUserByEmailParams,IUnapproveUserByEmailResult>(unapproveUserByEmailIR);


