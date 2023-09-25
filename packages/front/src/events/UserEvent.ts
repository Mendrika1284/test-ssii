import { User } from "@edmp/api";

export const UserEventType = "UserEvent" as const;

// A décommenter en es6 :
// export class UserEvent extends CustomEvent<User> {
//   constructor(detail: User) {
//     super(UserEventType, {detail});
//   }
// }

export class UserEvent extends CustomEvent<User> {}

// Methode pour créer un UserEvent (car l'héritage et le super ne fonctionne pas en es5)
export function dispatchUserEvent(detail: User) {
  dispatchEvent(new CustomEvent<User>(UserEventType, { detail }));
}
