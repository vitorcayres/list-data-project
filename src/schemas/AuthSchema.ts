import * as z from "zod";

const passwordValidation = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
);

export const AuthSchema = z.object({
  email: z.string().min(1, { message: "Preencha esse campo" }).email({
    message: "Informe um e-mail válido",
  }),
  password: z
    .string({ message: "Preencha esse campo" })
    .min(1, { message: "Preencha esse campo" })
    .regex(passwordValidation, {
      message: "Sua senha não é válida",
    }),
});
