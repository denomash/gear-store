import nodemailer from "nodemailer";

export const transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
//   secure: true, // use SSL
  auth: { user: "13ea683a954738", pass: "738ca6e7900bf6" },
});

export const makeANiceEmail = (text) => `
<div className="email" style="
    border: 1px solid black;
    padding: 20px;
    font-family: sans-serif;
    line-height: 2;
    font-size: 20px;
">
    <h2>Hello There!</h2>
    <p>${text}</p>
    
    <p>Deno Mash</p>
</div>
`;
