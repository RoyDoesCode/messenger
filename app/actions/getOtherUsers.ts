import prisma from "@/app/libs/prismadb";
import getSession from "./getSession";
import { ErrorType } from "../types/errors";

export default async function getOtherUsers() {
    const session = await getSession();

    if (!session?.user?.email) {
        return [];
    }

    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: "desc",
            },
            where: {
                NOT: {
                    email: session.user.email,
                },
            },
        });

        return users;
    } catch (error) {
        console.log(error, ErrorType.USER);
        return [];
    }
}
