export async function getMe(token: string): Promise<TgBotUser> {
  return await request(`bot${token}/getMe`)
}

export interface TgUser {
  id: number
  is_bot: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
}

export interface TgBotUser extends TgUser {
  username: string
  can_join_groups?: boolean
  can_read_all_group_messages?: boolean
  supports_inline_queries?: boolean
}

export async function getChat(token: string, chat_id: string | number): Promise<TgChat> {
  return await request(`bot${token}/getChat?${query({ chat_id })}`)
}

export interface TgChat {
  id: number
  type: "private" | "group" | "supergroup" | "channel"
  /** Title, for supergroups, channels and group chats */
  title?: string
  /** Username, for private chats, supergroups and channels if available */
  username?: string
  /** First name of the other party in a private chat */
  first_name?: string
  /** Last name of the other party in a private chat */
  last_name?: string
  /** Chat photo. Returned only in getChat. */
  photo?: TgChatPhoto
  /** Description, for groups, supergroups and channel chats. Returned only in getChat. */
  description?: string
  /** Chat invite link, for groups, supergroups and channel chats. Each administrator in a chat generates their own invite links, so the bot must first generate the link using exportChatInviteLink. Returned only in getChat. */
  invite_link?: string
  /** Pinned message, for groups, supergroups and channels. Returned only in getChat. */
  pinned_message?: object
  /** Default chat member permissions, for groups and supergroups. Returned only in getChat. */
  permissions?: TgChatPermissions
  /** For supergroups, the minimum allowed delay between consecutive messages sent by each unpriviledged user. Returned only in getChat. */
  slow_mode_delay?: number
  /** For supergroups, name of group sticker set. Returned only in getChat. */
  sticker_set_name?: string
  /** True, if the bot can change the group sticker set. Returned only in getChat. */
  can_set_sticker_set?: boolean
}

export interface TgChatPhoto {
  small_file_id: string
  small_file_unique_id: string
  big_file_id: string
  big_file_unique_id: string
}

export interface TgChatPermissions {
  /** True, if the user is allowed to send text messages, contacts, locations and venues */
  can_send_messages?: boolean
  /** True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes, implies can_send_messages */
  can_send_media_messages?: boolean
  /** True, if the user is allowed to send polls, implies can_send_messages */
  can_send_polls?: boolean
  /** True, if the user is allowed to send animations, games, stickers and use inline bots, implies can_send_media_messages */
  can_send_other_messages?: boolean
  /** True, if the user is allowed to add web page previews to their messages, implies can_send_media_messages */
  can_add_web_page_previews?: boolean
  /** True, if the user is allowed to change the chat title, photo and other settings. Ignored in public supergroups */
  can_change_info?: boolean
  /** True, if the user is allowed to invite new users to the chat */
  can_invite_users?: boolean
  /** True, if the user is allowed to pin messages. Ignored in public supergroups */
  can_pin_messages?: boolean
}

export async function getChatMember(
  token: string,
  chat_id: string | number,
  user_id: number
): Promise<TgChatMember> {
  return await request(`bot${token}/getChatMember?${query({ chat_id, user_id })}`)
}

export interface TgChatMember {
  user: TgUser
  status: "creator" | "administrator" | "member" | "restricted" | "left" | "kicked"
  /** Owner and administrators only. Custom title for this user */
  custom_title?: string
  /** Restricted and kicked only. Date when restrictions will be lifted for this user; unix time */
  until_date?: number
  /** Administrators only. True, if the bot is allowed to edit administrator privileges of that user */
  can_be_edited?: boolean
  /** Administrators only. True, if the administrator can post in the channel; channels only */
  can_post_messages?: boolean
  /** Administrators only. True, if the administrator can edit messages of other users and can pin messages; channels only */
  can_edit_messages?: boolean
  /** Administrators only. True, if the administrator can delete messages of other users */
  can_delete_messages?: boolean
  /** Administrators only. True, if the administrator can restrict, ban or unban chat members */
  can_restrict_members?: boolean
  /** Administrators only. True, if the administrator can add new administrators with a subset of their own privileges or demote administrators that he has promoted, directly or indirectly (promoted by administrators that were appointed by the user) */
  can_promote_members?: boolean
  /** Administrators and restricted only. True, if the user is allowed to change the chat title, photo and other settings */
  can_change_info?: boolean
  /** Administrators and restricted only. True, if the user is allowed to invite new users to the chat */
  can_invite_users?: boolean
  /** Administrators and restricted only. True, if the user is allowed to pin messages; groups and supergroups only */
  can_pin_messages?: boolean
  /** Restricted only. True, if the user is a member of the chat at the moment of the request */
  is_member?: boolean
  /** Restricted only. True, if the user is allowed to send text messages, contacts, locations and venues */
  can_send_messages?: boolean
  /** Restricted only. True, if the user is allowed to send audios, documents, photos, videos, video notes and voice notes */
  can_send_media_messages?: boolean
  /** Restricted only. True, if the user is allowed to send polls */
  can_send_polls?: boolean
  /** Restricted only. True, if the user is allowed to send animations, games, stickers and use inline bots */
  can_send_other_messages?: boolean
  /** Restricted only. True, if the user is allowed to add web page previews to their messages */
  can_add_web_page_previews?: boolean
}

export async function getUserProfilePhotos(
  token: string,
  user_id: number,
  offset?: number,
  limit?: number
): Promise<TgUserProfilePhotos> {
  return await request(`bot${token}/getUserProfilePhotos?${query({ user_id, offset, limit })}`)
}

export interface TgUserProfilePhotos {
  total_count: number
  photos: TgPhotoSize[][]
}

export interface TgPhotoSize {
  file_id: string
  file_unique_id: string
  width: number
  height: number
  file_size: number
}

export async function getFile(token: string, file_id: string): Promise<TgFile> {
  return await request(`bot${token}/getFile?${query({ file_id })}`)
}

export interface TgFile {
  file_id: string
  file_unique_id: string
  file_size: number
  file_path: string
}

export async function sendMediaGroup(
  token: string,
  data: TgSendMediaGroupData
): Promise<TgMessage> {
  return await request(`bot${token}/sendMediaGroup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

export interface TgSendMediaGroupData {
  chat_id: string | number
  media: Array<
    | {
        type: "photo"
        media: string
        caption?: string
        parse_mode?: TgParseMode
      }
    | {
        type: "video"
        media: string
        thumb?: string
        caption?: string
        parse_mode?: TgParseMode
        width?: number
        height?: number
        duration?: number
        supports_streaming?: boolean
      }
  >
  disable_notification?: boolean
  reply_to_message_id?: number
}

export async function sendPhoto(token: string, data: TgSendPhotoData): Promise<TgMessage> {
  return await request(`bot${token}/sendPhoto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
}

export interface TgSendPhotoData {
  chat_id: string | number
  photo: string
  caption?: string
  parse_mode?: TgParseMode
  disable_notification?: boolean
  reply_to_message_id?: number
  reply_markup?: unknown
}

type TgParseMode = "Markdown" | "MarkdownV2" | "HTML"

export interface TgMessage {
  message_id: number
  from?: TgUser
  date: number
  chat: TgChat
  forward_from?: TgUser
  forward_from_chat?: TgChat
  forward_from_message_id?: number
  forward_signature?: string
  forward_sender_name?: string
  forward_date?: number
  reply_to_message?: TgMessage
  edit_date?: number
  media_group_id?: string
  author_signature?: string
  text?: string
  entities?: unknown[]
  caption_entities?: unknown[]
  audio?: unknown
  document?: unknown
  animation?: unknown
  game?: unknown
  photo?: TgPhotoSize[]
  sticker?: unknown
  video?: unknown
  voice?: unknown
  video_note?: unknown
  caption?: string
  contanct?: unknown
  location?: unknown
  venue?: unknown
  poll?: unknown
  dice?: unknown
  new_chat_members?: TgUser[]
  left_chat_member?: TgUser
  new_chat_title?: string
  new_chat_photo?: TgPhotoSize[]
  delete_chat_photo?: true
  group_chat_created?: true
  supergroup_chat_created?: true
  channel_chat_created?: true
  migrate_to_chat_id?: number
  migrate_from_chat_id?: number
  pinned_message?: TgMessage
  invoice?: unknown
  successful_payment?: unknown
  connected_website?: string
  passport_data?: unknown
  reply_markup?: unknown
}

export async function request(url: string, init?: RequestInit) {
  try {
    const res = await fetch(`https://api.telegram.org/${url}`, init)
    const data = await res.json()
    if (data?.ok === false) throw Error(`${data.description}`)
    if (!res.ok) throw Error(`Request failed with code ${res.status} ${res.statusText}`)
    return data.result
  } catch (error) {
    console.error(error.message)
    throw error
  }
}

export async function download(token: string, file_path: string) {
  try {
    const res = await fetch(`https://api.telegram.org/file/bot${token}/${file_path}`, {
      mode: "no-cors",
      credentials: "omit",
    })
    if (!res.ok) throw Error(`Request failed with code ${res.status} ${res.statusText}`)
    const blob = await res.blob()
    return blob
  } catch (error) {
    console.error(error.message)
    throw error
  }
}

function query(data: Record<string, string | number | boolean | null | undefined>): string {
  const params = new URLSearchParams()
  for (const key in data) {
    if (data[key] != null) {
      params.set(key, String(data[key]))
    }
  }
  return params.toString()
}
