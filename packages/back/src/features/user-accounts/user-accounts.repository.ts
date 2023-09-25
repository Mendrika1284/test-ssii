import {
  UserAccount,
  UserAccountModel,
  UserAccountDocument,
  UserAccountCreateInternal,
  UserAccountUpdateInternal,
} from "@edmp/api";
import { FilterQuery } from "mongoose";
import { RepositoryLib } from "@/lib";
import { IUserAccountsService } from "@/interfaces";

export namespace UserAccountsRepository {
  export const create = async (
    service: IUserAccountsService.Service,
    ctx: IUserAccountsService.Context<"service.user-accounts.create">,
    params: UserAccountCreateInternal
  ): Promise<UserAccount> => {
    const doc = await UserAccountModel.create(params);
    const userAccountCreated = RepositoryLib.transformDocuments(doc);
    void ctx.emit("user-account.created", { userAccount: userAccountCreated, params });
    return userAccountCreated;
  };

  export const get = async (
    service: IUserAccountsService.Service,
    ctx: IUserAccountsService.Context<
      "service.user-accounts.get" | "service.user-accounts.create" | "service.user-accounts.verify"
    >,
    params: IUserAccountsService.Context<"service.user-accounts.get">["params"]
  ): Promise<UserAccount | undefined> => {
    const { id, username } = params;

    const filter: FilterQuery<UserAccountDocument> = {};
    if (id) {
      filter._id = id;
    }
    if (username) {
      filter.username = username;
    }

    const doc = await UserAccountModel.findOne(filter);
    const userAccount = RepositoryLib.transformDocuments(doc);
    return userAccount;
  };

  export const update = async (
    service: IUserAccountsService.Service,
    ctx: IUserAccountsService.Context<"service.user-accounts.update">,
    params: UserAccountUpdateInternal
  ): Promise<UserAccount> => {
    const doc = await UserAccountModel.findByIdAndUpdate(
      params.id,
      { $set: params },
      {
        upsert: true,
        new: true,
      }
    );
    const userAccountUpdated = RepositoryLib.transformDocuments(doc);
    void ctx.emit("user-account.updated", { userAccount: userAccountUpdated, params });
    return userAccountUpdated;
  };
}
