const Mutations = {
  async createItem(parent, args, context, info) {
    const item = await context.db.mutation.createItem(
      {
        data: {
          ...args,
        },
      },
      info
    );

    return item;
  },
  updateItem(parent, args, context, info) {
    // make a copy of the updates
    const update = { ...args };

    // remove the id from updates
    delete update.id;

    // run the update method
    return context.db.mutation.updateItem(
      {
        data: update,
        where: {
          id: args.id,
        },
      },
      info
    );
  },
  async deleteItem(parent, args, context, info) {
    const where = {
      id: args.id,
    };

    // 1. Find the item
    const item = await context.db.query.item({ where }, `{ id title}`)

    // 2. check if they own that item, or have the permisions
      // TODO
    // Delete the item
    return context.db.mutation.deleteItem(
      {
        where,
      },
      info
    );
  },
};

export default Mutations;
