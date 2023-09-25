import { User, UserDocument, UserModel, UserCreateInternal, UserUpdateInternalRepository } from "@edmp/api";
import { FilterQuery } from "mongoose";
import { RepositoryLib } from "@/lib";
import { IUsersService } from "@/interfaces";

export namespace UsersRepository {
  export const create = async (
    service: IUsersService.Service,
    ctx: IUsersService.Context<"service.users.create">,
    params: UserCreateInternal
  ): Promise<User> => {
    const doc = await UserModel.create(params);
    const userCreated = RepositoryLib.transformDocuments(doc);
    void ctx.emit("user.created", { user: userCreated, params });
    if (userCreated.emailStatus === "pending") {
      void ctx.emit("user.email.updated", { user: userCreated, params });
    }
    return userCreated;
  };

  export const list = async (
    service: IUsersService.Service,
    ctx: IUsersService.Context<"service.users.list">,
    params: IUsersService.Context<"service.users.list">["params"]
  ): Promise<User[]> => {
    const { ids, emailStatus } = params;

    const filter: FilterQuery<UserDocument> = {};
    if (ids) {
      filter.id = { $in: ids };
    }
    if (emailStatus) {
      filter.emailStatus = emailStatus;
    }

    const docs = await UserModel.find(filter);
    const users = RepositoryLib.transformDocuments(docs);
    return users;
  };

  export const get = async (
    service: IUsersService.Service,
    ctx: IUsersService.Context<"service.users.create" | "service.users.get" | "service.users.update">,
    params: IUsersService.Context<"service.users.get">["params"]
  ): Promise<User | undefined> => {
    const { id, email, emailVerifyToken } = params;

    const filter: FilterQuery<UserDocument> = {};
    if (id) {
      filter._id = id;
    }
    if (email) {
      filter.email = email;
    }
    if (emailVerifyToken) {
      filter.emailVerifyToken = emailVerifyToken;
    }

    const doc = await UserModel.findOne(filter);
    const user = RepositoryLib.transformDocuments(doc);
    return user;
  };

  export const update = async (
    service: IUsersService.Service,
    ctx: IUsersService.Context<"service.users.update" | "service.users.validateEmail" | "user.email.updated">,
    params: UserUpdateInternalRepository
  ): Promise<User> => {
    const doc = await UserModel.findByIdAndUpdate(
      params.id,
      { $set: params },
      {
        upsert: true,
        new: true,
      }
    );
    const userUpdated = RepositoryLib.transformDocuments(doc);
    void ctx.emit("user.updated", { user: userUpdated, params });
    if (userUpdated.emailStatus === "pending") {
      void ctx.emit("user.email.updated", { user: userUpdated, params });
    }
    return userUpdated;
  };
}
