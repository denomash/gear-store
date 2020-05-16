import { forwardTo } from "prisma-binding";

const Query = {
  // items: forwardTo('db')
  async items(parent, args, context, info) {
    const itemz = await context.db.query.items();

    const users = await context.db.query.users();

    console.log(">>>><<<<", itemz);
    console.log(">>>><<<<", users, ">>>><<<<");
    return itemz;
  },
};

export default Query;
