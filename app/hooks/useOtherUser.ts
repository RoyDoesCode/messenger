import { User } from "@prisma/client";
import { PopulatedConversation } from "../types";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

const useOtherUser = (
    conversation:
        | PopulatedConversation
        | {
              users: User[];
          }
) => {
    const session = useSession();

    const otherUser = useMemo(() => {
        const currentUserEmail = session?.data?.user?.email;

        const otherUser = conversation.users.find(
            (user) => user.email != currentUserEmail
        );

        return otherUser!;
    }, [session?.data?.user?.email, conversation.users]);

    return otherUser;
};

export default useOtherUser;
