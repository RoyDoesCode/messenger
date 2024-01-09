import { Conversation, Message, User } from "@prisma/client";

export type PopulatedMessage = Message & {
    sender: User;
    seen: User[];
};

export type PopulatedUserConversation = Conversation & {
    users: User[];
};

export type PopulatedConversation = PopulatedUserConversation & {
    messages: PopulatedMessage[];
};
