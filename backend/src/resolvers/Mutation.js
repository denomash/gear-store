import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    const item = await context.db.query.item({ where }, info);

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
  async signup(parent, args, context, info) {
    // lowercase the email
    args.email = args.email.toLowerCase();

    // hash user password
    const password = await bcrypt.hash(args.password, 10);

    // create user in the DB
    const user = await context.db.mutation.createUser(
      {
        data: {
          ...args,
          password,
          permissions: { set: ["USER"] },
        },
      },
      info
    );

    // create JWT token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // we set the JWT as a cookie on the response
    context.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });

    // finally we return the user to the browser
    return user;
  },
};

export default Mutations;
