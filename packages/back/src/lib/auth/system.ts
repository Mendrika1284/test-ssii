import { MetaUser } from "@edmp/api";
import { cloneDeep } from "lodash";
import { Context } from "moleculer";

export const system = {
  metaUser: { id: "system", scope: "system", username: "system" } as MetaUser,

  getSystemMetaIfUserMetaNotExist: <Meta extends Context["meta"] & { user?: MetaUser }>(
    meta: Meta
  ): Meta & { user: MetaUser } => {
    if (meta.user) {
      return meta as Meta & { user: MetaUser };
    }
    return cloneDeep(Object.assign(meta, { user: system.metaUser })); // Clone deep because rewrite system.metaUser on system.impersonate and on system.depersonate error for sub system
  },
};
