import nodemailer from "nodemailer";

export const sendAdminEmail = async (toEmail, teacherNames, date) => {

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: toEmail,
    subject: "ESE Duty Assignment",
    html: `
      <h3>Duty Assigned for ${date}</h3>
      <ul>
        ${teacherNames.map(name => `<li>${name}</li>`).join("")}
      </ul>
    `
  });
};
