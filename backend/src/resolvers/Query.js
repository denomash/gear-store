import { forwardTo } from "prisma-binding";

const Query = {
  // items: forwardTo('db')
  async items(parent, args, context, info) {
    const items = await context.db.query.items({}, info);

    return items;
  },
};

export default Query;
