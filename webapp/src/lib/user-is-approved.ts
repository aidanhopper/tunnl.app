// import { getUserByEmail, IGetUserByEmailResult } from "@/db/types/users.queries";
// import isApproved from "./is-approved";
// import client from "./db";
//
// const userIsApproved = async (email: string | null | undefined): Promise<boolean> => {
//     if (email === null || email === undefined) return false;
//     let user: null | IGetUserByEmailResult = null
//     const userList = await getUserByEmail.run({ email: email }, client);
//     if (userList.length !== 0) user = userList[0];
//     return isApproved(user?.roles);
// }
//
// export default userIsApproved;
