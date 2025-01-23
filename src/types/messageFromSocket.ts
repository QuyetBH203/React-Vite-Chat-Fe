import { GetMessageFromFriendResponse } from "modules/direct-message/services/getMessage"
import { GetGroupMessageResponse } from "modules/group/services/getGroupMessage"

export interface MessageFromSocket extends GetMessageFromFriendResponse {}

export interface GroupMessageFromSocket extends GetGroupMessageResponse {}
