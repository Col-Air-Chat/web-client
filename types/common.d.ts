type recent = {
    id: string | number // user id
    name: string // user name
    avatar: string // user avatar
    lastMessage?: string // last message
    lastMessageTime?: number | string // last message time
    isRead?: boolean // is read
    isOnline?: boolean // is online
    isTyping?: boolean  // is typing
}

type friend = {
    id: string | number // user id
    name: string // user name
    avatar: string // user avatar
    saying?: string // user saying
    lastMessage?: string // last message
    lastMessageTime?: number | string // last message time
}

type group = {
    id: string | number // group id
    name: string // group name
    avatar: string // group avatar
    onlineCount?: number // online count
    lastSender?: sender // last sender
    lastMessage?: string // last message
    lastMessageTime?: number | string // last message time
}

type message = {
    messageId: string | number // message id
    id: string | number // chat id
    name: string // chat name
    avatar: string // chat avatar
    message: string // message content
    time: number | string // message time
    type: string // message type
    url?: string // if type is image or video, url is required
    deleted?: boolean // is delete
    reply?: boolean | message // is replay
    edited?: boolean // is edited
    status: string // message status
}

type chat = {
    id: string | number // chat id
    name: string // chat name
    avatar: string // chat avatar
    isGroup?: boolean // is group
    isRead?: boolean // is read
    isOnline?: boolean // is online
    isTyping?: boolean  // is typing
    lastMessage?: string // last message
    lastMessageTime?: number | string // last message time
    messages?: message[] // messages
}

type sender = {
    id: string | number // user id
    name: string // user name
}

type chosen = {
    id: string | number // chat id
    name: string // chat name
    avatar: string // chat avatar
    isChosen: boolean // is chosen
    isGroup?: boolean // is group
}

type chatWindow = {
    id: string | number // chat id
    name: string // chat name
    avatar: string // chat avatar
    messages: message[] // messages
}
