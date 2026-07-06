import { hash } from "bcryptjs";
import { prismaClient } from "../../prisma";

interface CreateUserProps {
  name: string;
  email: string;
  password: string;
}

class CreateUserService {
  async execute({ name, email, password }: CreateUserProps) {
    const userAlreadyExists = await prismaClient.user.findFirst({
      where: { email },
    });

    if (userAlreadyExists) {
      throw new Error("Usuário já cadastrado");
    }

    const passwordHashed = await hash(password, 8);

    const user = await prismaClient.user.create({
      data: { name, email, password: passwordHashed },
      select: {
        name: true,
        email: true,
        createdAt: true,
      },
    });

    return user;
  }
}

export { CreateUserService };
