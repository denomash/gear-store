import { forwardTo } from "prisma-binding";
import { hasPermission } from "../utils";

const Query = {
  // items: forwardTo('db')
  async items(parent, args, context, info) {
    const items = await context.db.query.items({}, info);

    return items;
  },
  item: forwardTo("db"),
  itemsConnection: forwardTo("db"),
  async me(parent, args, context, info) {
    // check if there is a current user id
    if (!context.request.userId) {
      return null;
    }

    const user = await context.db.query.user(
      {
        where: { id: context.request.userId },
      },
      info
    );

    return user;
  },
  async users(parent, args, context, info) {
    // 1. Check if they are logged in
    if (!context.request.userId) {
      throw new Error("You must be logged in to do that!");
    }

    // 2. Check if the user has permissions to query all users
    hasPermission(context.request.user, ["ADMIN", "PERMISSIONUPDATE"]);

    // 3. If they do, query all the users!
    return context.db.query.users({}, info);
  },
};

export default Query;
