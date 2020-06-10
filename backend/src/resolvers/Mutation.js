import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { promisify } from "util";

import { transport, makeANiceEmail } from "../mail";

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

  async signin(parent, { email, password }, context, info) {
    // check if there is a user with that email
    const user = await context.db.query.user({ where: { email } }, info);

    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    // check if their password is correct
    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      throw new Error("Invalid password");
    }

    // generate the JWT Token
    const token = jwt.sign({ userId: user.id }, process.env.APP_SECRET);

    // set the cookie with the token
    context.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });
    // Return the user
    return user;
  },

  signout(parent, args, context, info) {
    context.response.clearCookie("token");

    return {
      message: "Goodbye",
    };
  },

  async requestReset(parent, { email }, context, info) {
    // Check if user exists
    const user = await context.db.query.user({ where: { email } }, info);

    if (!user) {
      throw new Error(`No such user found for email ${email}`);
    }

    // Set a reset token and expiry on that user
    const randomBytesPromisified = promisify(randomBytes);
    const resetToken = (await randomBytesPromisified(20)).toString("hex");
    const resetTokenExpiry = Date.now() + 3600000; // 1 hour from now

    const res = await context.db.mutation.updateUser(
      {
        where: { email },
        data: { resetToken, resetTokenExpiry },
      },
      info
    );

    // Email them that reset token
    const mailRes = await transport.sendMail({
      from: "dennismacharia4747@gmail.com",
      to: user.email,
      subject: "Your Password Reset Token",
      html: makeANiceEmail(`
      Your Password Reset Token is here!
      \n\n
      <a href="${process.env.FRONTEND_URL}/reset?resetToken=${resetToken}">
        Click here to reset your password
      </a>
      `),
    });

    // return {
    //   message: "Great thanks!",
    // };
    return user;
  },

  async resetPassword(parent, args, context, info) {
    // 1. check if the passwords match
    if (args.password !== args.confirmPassword) {
      throw new Error("Your passwords don't match!");
    }

    // 2. check if the reset token is legit
    // 3. check if the token is expired
    const [user] = await context.db.query.users(
      {
        where: {
          resetToken: args.resetToken,
          resetTokenExpiry_gte: Date.now() - 3600000,
        },
      },
      info
    );

    if (!user) {
      throw new Error("This token is either invalid or expired!");
    }

    // 4. Hash the new password
    const password = await bcrypt.hash(args.password, 10);

    // 5. Save the new password to the user and remove the old reset token fields
    const updatedUser = await context.db.mutation.updateUser(
      {
        where: {
          email: user.email,
        },
        data: {
          password,
          resetToken: null,
          resetTokenExpiry: null,
        },
      },
      info
    );

    // 6. generate JWT
    const token = jwt.sign({ userId: updatedUser.id }, process.env.APP_SECRET);

    // 7. set the JWT cookie
    context.response.cookie("token", token, {
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24 * 365, // 1 year cookie
    });

    // 8. return the new user
    return updatedUser;
  },
};

export default Mutations;
