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
};

export default Mutations;
