type Collection = "conversation" | "message";
type Action = "new" | "update" | "delete";

type PusherEvent = `${Collection}:${Action}`;

export const CONVERSATION_NEW_EVENT: PusherEvent = "conversation:new";
export const CONVERSATION_UPDATE_EVENT: PusherEvent = "conversation:update";
export const CONVERSATION_DELETE_EVENT: PusherEvent = "conversation:delete";
export const MESSAGE_NEW_EVENT: PusherEvent = "message:new";
export const MESSAGE_UPDATE_EVENT: PusherEvent = "message:update";
