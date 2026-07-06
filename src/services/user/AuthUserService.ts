interface AuthUserProps {
  email: string;
  password: string;
}

class AuthUserService {
  async execute({ email, password }: AuthUserProps) {
    console.log("Chamou serviço para logar", { email, password });

    return { ok: "logado" };
  }
}

export { AuthUserService };
