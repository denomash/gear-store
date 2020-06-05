import { forwardTo } from "prisma-binding";

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
};

export default Query;
