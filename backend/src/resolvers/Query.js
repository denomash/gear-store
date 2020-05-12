const Query = {
  async items(arent, args, context, info) {
    const items = await context.db.query.items();
    return items;
  },
};

export default Query;
