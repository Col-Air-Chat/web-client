<template>
  <v-app id="col-air-main" :theme="theme">
    <v-navigation-drawer v-model="drawer.left" absolute width="100">
      <v-avatar class="d-block text-center mx-auto mt-4 avatar-hover" size="60"
        image="https://source.yby.zone/avatar.jpg"></v-avatar>

      <v-divider class="mx-3 my-5"></v-divider>

      <v-btn v-for="item in items" :key="item.key" :icon="item.icon" size="48" @click="item.click"
        class="d-flex mx-auto mb-6 avatar-hover" />

      <v-btn :icon="theme === 'light' ? 'mdi-brightness-7' : 'mdi-brightness-4'" @click="onChangeTheme"
        class="d-flex mx-auto toggle-bottom" />
    </v-navigation-drawer>

    <v-main>
      <v-navigation-drawer v-model="drawer.middle" width="320">
        <v-tabs v-model="tabLeft" fixed-tabs center-active @update:model-value="(onTabLeft as any)">
          <v-tab value="recent"><v-icon>mdi-message-outline</v-icon></v-tab>
          <v-tab value="friend"><v-icon>mdi-account-outline</v-icon></v-tab>
          <v-tab value="group"><v-icon>mdi-account-group-outline</v-icon></v-tab>
        </v-tabs>
        <v-window v-model="tabLeft">
          <v-window-item value="recent">
            <v-list lines="two">
              <v-list-item v-for="item in recent" :key="item.id" :title="item.name + '(' + item.id + ')'"
                :subtitle="'[' + item.lastMessageTime + ']' + item.lastMessage" :prepend-avatar="item.avatar"
                link></v-list-item>
            </v-list>
          </v-window-item>
          <v-window-item value="friend">
            <v-text-field density="compact" clearable variant="outlined" class="search-input"
              v-model="leftSearch.friend"></v-text-field>
            <v-list lines="two">
              <v-list-item v-for="item in friends" :key="item.id" :title="item.name + '(' + item.id + ')'"
                :subtitle="item.saying" :prepend-avatar="item.avatar" link></v-list-item>
            </v-list>
          </v-window-item>
          <v-window-item value="group">
            <v-text-field density="compact" clearable variant="outlined" class="search-input"
              v-model="leftSearch.group"></v-text-field>
            <v-list lines="two">
              <v-list-item v-for="item in groups" :key="item.id" :title="item.name + '(' + item.id + ')'"
                :subtitle="'[' + item.lastMessageTime + ']' + item.lastSender?.name + ': ' + item.lastMessage"
                :prepend-avatar="item.avatar" link></v-list-item>
            </v-list>
          </v-window-item>
        </v-window>
        <div class="toggle-bottom">
          <v-btn variant="tonal" class="mx-auto mt-2" @click="drawer.left = !drawer.left">
            <v-icon left>mdi-menu</v-icon>
          </v-btn>
          <v-btn variant="tonal" class="mx-auto mt-2" width="220">
            <v-icon left>mdi-plus</v-icon>
            Add Friend/Group
          </v-btn>
        </div>
      </v-navigation-drawer>
      <v-app-bar>
        <template v-slot:prepend>
          <v-app-bar-nav-icon @click="onAppBarClick"></v-app-bar-nav-icon>
        </template>

        <v-app-bar-title class="text-center">{{ chatWindow.name }}</v-app-bar-title>

        <template v-slot:append>
          <v-btn icon="mdi-dots-vertical"></v-btn>
        </template>
      </v-app-bar>
      <v-dialog v-model="messageMenu.dialog.show">
        <v-card>
          <v-card-text v-html="messageMenu.dialog.content">
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="messageMenu.dialog.cancel">
              {{ messageMenu.dialog.cancelText }}
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="messageMenu.dialog.confirm">
              {{ messageMenu.dialog.confirmText }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <v-dialog v-model="expandInput.show" class="expand-input">
        <v-card>
          <v-card-text>
            <v-textarea variant="solo" hide-details auto-grow rows="5" v-model="sender.value">
            </v-textarea>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="blue-darken-1" variant="text" @click="expandInput.show = false">
              取消
            </v-btn>
            <v-btn color="blue-darken-1" variant="text" @click="onClickSend">
              发送
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
      <rightClickMenu :location="messageMenu.location" v-model:show="messageMenu.show" :menu="messageMenu.menu" />
      <v-card class="mx-auto mt-6" width="98%" height="calc(100vh - 200px)" @contextmenu.prevent="null">
        <v-card-text id="chat-box" class="chat-box">
          <div v-for="item in chatWindow.messages" :key="item.id">
            <v-row v-if="!item.deleted" :class="item.id == self.id ? 'self' : 'other'">
              <v-col cols="auto" class="avatar" v-if="item.id != self.id">
                <v-avatar size="40" :image="item.avatar"></v-avatar>
              </v-col>
              <v-col cols="auto" class="bubble">
                <v-card class="mx-1" outlined @contextmenu.prevent="messageMenu.rightClickProxy" :msgId="item.messageId"
                  @touchstart="messageMenu.touchStartProxy" @touchend="messageMenu.touchEndProxy"
                  @touchmove="messageMenu.touchMoveProxy">
                  <v-card-text>
                    <v-row class="name-time">
                      <v-col cols="auto" class="name">{{ item.name }}</v-col>
                      <v-col cols="auto" class="time">{{ item.time }}</v-col>
                    </v-row>
                    <v-row class="font-format">
                      <v-col cols="auto" v-if="item.type === 'text'" v-html="markdown.convert(item.message)">
                      </v-col>
                      <v-col cols="auto" v-if="item.type === 'image'">
                        <img :src="item.message" />
                      </v-col>
                      <v-col cols="auto" v-if="item.type === 'file'">
                        <v-icon>mdi-file</v-icon>
                        <a :href="item.url" target="_blank">{{ item.message }}</a>
                      </v-col>
                      <v-col cols="auto" v-if="item.type === 'audio'">
                        <audio controls>
                          <source :src="item.url" type="audio/mpeg">
                          Your browser does not support the audio element.
                        </audio>
                      </v-col>
                      <v-col cols="auto" v-if="item.type === 'video'">
                        <video controls>
                          <source :src="item.url" type="video/mp4">
                          Your browser does not support the video tag.
                        </video>
                      </v-col>
                      <v-divider class="mt-2" v-if="item.reply"></v-divider>
                      <v-col cols="auto" class="reply" v-if="item.reply && typeof item.reply === 'object'"
                        @click="jumpToMsg(((item.reply) as message).messageId)">
                        <span>回复自：</span>
                        <br>
                        <v-row>
                          <v-col cols="auto" v-if="item.reply.type === 'text'"
                            v-html="markdown.cutHtml(markdown.convert(item.reply.message), 40)">
                          </v-col>
                          <v-col cols="auto" v-if="item.reply.type === 'image'">
                            <img :src="item.reply.message" />
                          </v-col>
                          <v-col cols="auto" v-if="item.reply.type === 'file'">
                            <v-icon>mdi-file</v-icon>
                            <a :href="item.reply.url" target="_blank">
                              {{ item.reply.message }}
                            </a>
                          </v-col>
                          <v-col cols="auto" v-if="item.reply.type === 'audio'">
                            <audio controls>
                              <source :src="item.reply.url" type="audio/mpeg">
                              Your browser does not support the audio element.
                            </audio>
                          </v-col>
                          <v-col cols="auto" v-if="item.reply.type === 'video'">
                            <video controls>
                              <source :src="item.reply.url" type="video/mp4">
                              Your browser does not support the video tag.
                            </video>
                          </v-col>
                        </v-row>
                      </v-col>
                    </v-row>
                  </v-card-text>
                </v-card>
                <v-row :class="item.id == self.id ? 'other' : 'self'">
                  <v-col cols="auto" class="status">
                    <v-icon v-if="item.status === 'sending'">mdi-clock-outline</v-icon>
                    <v-icon v-if="item.status === 'sent'">mdi-check</v-icon>
                    <v-icon v-if="item.status === 'read'">mdi-check-all</v-icon>
                    <span v-if="item.edited">已编辑</span>
                  </v-col>
                </v-row>
              </v-col>
              <v-col cols="auto" class="avatar" v-if="item.id == self.id">
                <v-avatar size="40" :image="item.avatar"></v-avatar>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
      </v-card>
      <div class="tool-bar">
        <v-btn size="small" color="grey" class="mx-1">
          <v-icon>mdi-microphone</v-icon>
        </v-btn>
        <v-btn size="small" color="green" class="mx-1">
          <v-icon>mdi-emoticon-outline</v-icon>
        </v-btn>
        <v-btn size="small" color="blue" class="mx-1">
          <v-icon>mdi-image-outline</v-icon>
        </v-btn>
        <v-btn size="small" color="pink" class="mx-1" @click="expandInput.show = true">
          <v-icon>mdi-arrow-expand</v-icon>
        </v-btn>
        <v-chip size="small" label v-if="sender.type !== 'default'" closable
          @click:close="sender.type = 'default', sender.value = ''">
          {{ sender.type === 'edit' ? '编辑' : '回复' }}
        </v-chip>
      </div>
    </v-main>

    <v-footer app color="transparent" height="80">
      <v-textarea dense rounded variant="solo" hide-details no-resize rows="1" v-model="sender.value">
        <template #append-inner>
          <v-btn size="small" color="primary" class="mx-1" @click="onClickSend">
            <v-icon>mdi-send</v-icon>
          </v-btn>
        </template>
      </v-textarea>
    </v-footer>
  </v-app>
</template>

<style scoped>
.avatar-hover:hover {
  opacity: 0.5;
  transform: rotate(5deg);
  transition: all 0.3s ease-in-out;
}

.toggle-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  margin-top: 100px;
  margin-bottom: 25px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
}

.search-input {
  width: 90%;
  margin: 30px auto auto auto;
}

.self {
  justify-content: flex-end;
  margin-right: 1px;
}

.other {
  justify-content: flex-start;
  margin-left: 1px;
}

.bubble {
  min-width: 100px;
  max-width: 80%;
}

.avatar {
  margin-top: 10px;
}

.name-time {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.name {
  font-weight: bold;
}

.time {
  font-size: 12px;
}

.status {
  font-size: 12px;
}

.status:hover {
  opacity: 0.5;
  transition: all 0.3s ease-in-out;
}

.chat-box {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 10px;
}

.v-dialog {
  max-width: 500px;
  height: 300px;
}

.reply {
  font-size: 12px;
}

.tool-bar {
  position: fixed;
  margin-top: 8px;
  margin-left: 20px;
}

.expand-input {
  min-width: 100%;
  height: auto;
}

.font-format {
  line-height: normal;
}
</style>

<script lang="ts" setup>
// vue imports
import { ref, onMounted, watch, reactive } from 'vue'
// store imports
import { AppCommonStore } from '@/stores/app'
import { MsgCommonStore } from '@/stores/msg'
// tools imports
import { dateFormat, FormatsEnums } from '@/tools/dateFormatter'
import { markdownToHtml } from '@/tools/markdownToHtml'
import { clipboard } from '@/tools/clipboard'
import { encodeString } from '@/tools/encodeString'
// sha1 imports
import sha1 from "sha1"
// components imports
import rightClickMenu from '@/components/rightClickMenu.vue'
// store const
const appCommonStore = AppCommonStore()
const msgCommonStore = MsgCommonStore()
// copyText const
const copyText = new clipboard().copy
// const new markdownToHtml()
const markdown = new markdownToHtml()
// drawer control the state of the drawer
const drawer = ref(
  {
    left: true,
    middle: true,
  }
)
// items is an array of objects that contain the title and icon of the items
const items = [
  { key: 0, title: 'Dashboard', icon: 'mdi-view-dashboard-outline', color: 'grey', click: () => { console.log("click") } },
  { key: 1, title: 'Messages', icon: 'mdi-message-outline', color: 'grey', click: () => { drawer.value.middle = tabLeft.value === "recent" ? !drawer.value.middle : true, tabLeft.value = "recent" } },
  { key: 2, title: 'Friends', icon: 'mdi-account-outline', color: 'grey', click: () => { drawer.value.middle = tabLeft.value === "friend" ? !drawer.value.middle : true, tabLeft.value = "friend" } },
  { key: 3, title: 'Groups', icon: 'mdi-account-group-outline', color: 'grey', click: () => { drawer.value.middle = tabLeft.value === "group" ? !drawer.value.middle : true, tabLeft.value = "group" } },
  { key: 4, title: 'Files', icon: 'mdi-file-outline', color: 'grey', click: () => { console.log('click') } },
  { key: 5, title: 'Settings', icon: 'mdi-cog-outline', color: 'grey', click: () => { console.log('click') } },
]
// theme is the theme of the app
const theme = ref('light')
// onChangeTheme is a function that changes the theme
const onChangeTheme = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light'
}
// sender is input value of the sender
const sender = reactive({
  value: '',
  type: 'default',
  to: ""
})
// onClickSend is a function that is called when the send button is clicked
const onClickSend = () => {
  // if value has a script tag replace it with nothing
  sender.value = sender.value.replace(/<script.*?>.*?<\/script>/ig, '')
  const value = sender.value
  // push message to chatWindow
  if (sender.type === 'default')
    chatWindow.value.messages.push({
      messageId: sha1(Date.now().toString() + "col-msg").substring(0, 7) + '-' + sha1("10001").substring(0, 7) + '-' + sha1(value).substring(0, 7),
      id: "10001",
      name: 'John Doe',
      avatar: 'https://source.yby.zone/avatar.jpg',
      message: value,
      time: dateFormat(Date.now(), FormatsEnums.HI),
      type: 'text',
      status: 'sent',
      url: '',
      deleted: false,
      reply: false,
      edited: false,
    })
  else if (sender.type === 'edit') {
    const index = chatWindow.value.messages.findIndex((item) => item.messageId === sender.to)
    chatWindow.value.messages[index].message = value
    chatWindow.value.messages[index].time = dateFormat(Date.now(), FormatsEnums.HI)
    chatWindow.value.messages[index].status = 'sent'
    chatWindow.value.messages[index].edited = true
  }
  else if (sender.type === 'reply') {
    const msg = chatWindow.value.messages.find((item) => item.messageId === sender.to)
    chatWindow.value.messages.push({
      messageId: sha1(Date.now().toString() + "col-msg").substring(0, 7) + '-' + sha1("10001").substring(0, 7) + '-' + sha1(value).substring(0, 7),
      id: "10001",
      name: 'John Doe',
      avatar: 'https://source.yby.zone/avatar.jpg',
      message: value,
      time: dateFormat(Date.now(), FormatsEnums.HI),
      type: 'text',
      status: 'sent',
      url: '',
      deleted: false,
      reply: msg,
      edited: false,
    })
  }
  sender.value = ''
  sender.type = 'default'
  if (expandInput.show) expandInput.show = false
  // scroll to bottom
  setTimeout(() => {
    const chatBox = document.getElementById('chat-box')
    chatBox!.scrollTop = chatBox!.scrollHeight
  }, 100)
}
// recent is an array of objects that contain the name and avatar of the recent
const recent = ref<recent[]>(
  [
    {
      id: "10001",
      name: 'John Doe',
      avatar: 'https://source.yby.zone/avatar.jpg',
      lastMessage: 'Hello World',
      lastMessageTime: dateFormat(Date.now(), FormatsEnums.HI)
    },
    {
      id: "10002",
      name: 'Yby',
      avatar: 'https://source.yby.zone/tx.jpg',
      lastMessage: 'Hello World 2',
      lastMessageTime: dateFormat(Date.now(), FormatsEnums.HI)
    },
  ]
)
// friends is an array of objects that contain the name and avatar of the friends
const friends = ref<friend[]>(
  [
    {
      id: "10001",
      name: 'John Doe',
      avatar: 'https://source.yby.zone/avatar.jpg',
      saying: 'Hello World',
    },
    {
      id: "10002",
      name: 'Yby',
      avatar: 'https://source.yby.zone/tx.jpg',
      saying: 'Hello World 2',
    },
  ]
)
// groups is an array of objects that contain the name and avatar of the groups
const groups = ref<group[]>(
  [
    {
      id: "10001",
      name: 'John Doe',
      avatar: 'https://source.yby.zone/avatar.jpg',
      lastMessage: 'Hello World',
      lastMessageTime: dateFormat(Date.now(), FormatsEnums.HI),
      lastSender: {
        id: "10001",
        name: 'John Doe',
      }
    },
    {
      id: "10002",
      name: 'Yby',
      avatar: 'https://source.yby.zone/tx.jpg',
      lastMessage: 'Hello World 2',
      lastMessageTime: dateFormat(Date.now(), FormatsEnums.HI),
      lastSender: {
        id: "10002",
        name: 'Yby',
      }
    },
  ]
)
// tabLeft is the tab of the window
const tabLeft = ref('recent')
// onTabLeft is a function that is called when the tab is changed
const onTabLeft = (value: string) => {
  tabLeft.value = value
}
// leftSearch is the search value of the left window
const leftSearch = ref({
  friend: '',
  group: ''
})
// onClickMicrophone is a function that is called when the microphone button is clicked
const onClickMicrophone = () => {
  console.log('microphone')
}
// chat box settings
const chatWindow = ref<chatWindow>(
  {
    id: "10002",
    name: 'Yby',
    avatar: 'https://source.yby.zone/avatar.jpg',
    messages: [
      {
        messageId: "test1",
        id: "10001",
        name: 'John Doe',
        avatar: 'https://source.yby.zone/avatar.jpg',
        message: 'v-card 组件是一种多功能组件，可用于从面板到静态图像的任何东西。 card 组件有许多助手组件，以使标记尽可能简单。没有列出选项的组件使用 Vue的 功能组件选项来加快渲染速度，并充当标记糖来简化构建。',
        time: dateFormat(Date.now(), FormatsEnums.HI),
        type: 'text',
        status: 'read',
        url: '',
        deleted: false,
        reply: false,
        edited: false,
      },
      {
        messageId: "test2",
        id: "10002",
        name: 'Yby',
        avatar: 'https://source.yby.zone/tx.jpg',
        message: '指定该组件作为应用程序布局的一部分。用于动态调整内容的大小。使用此 prop 的组件应该位于 v-main组件的 外 部，才能正常运行。你可以在 应用程序页面 上获得更多关于布局的信息。注意： 这个 prop 会自动将 position: fixed 应用到布局元素上。你可以使用 absolute prop 来覆盖这个功能。',
        time: dateFormat(Date.now(), FormatsEnums.HI),
        type: 'text',
        status: 'read',
        url: '',
        deleted: false,
        reply: false,
        edited: true,
      },
      {
        messageId: "test3",
        id: "10002",
        name: 'Yby',
        avatar: 'https://source.yby.zone/tx.jpg',
        message: 'https://source.yby.zone/upload/images/1671978267_3r7Bjd5kEGj.jpg',
        time: dateFormat(Date.now(), FormatsEnums.HI),
        type: 'image',
        status: 'sent',
        url: '',
        deleted: false,
        reply: false,
        edited: false,
      },
    ],
  }
)
// self is the self user
const self = ref({
  id: "10001",
  name: 'John Doe',
  avatar: 'https://source.yby.zone/avatar.jpg',
})
// onAppBarClick is a function that is called when the app bar is clicked
const onAppBarClick = () => {
  drawer.value.middle = !drawer.value.middle
}
// onMounted is a function that is called when the component is mounted
onMounted(() => {
  // set the theme
  theme.value = appCommonStore.theme
  // set left tab
  tabLeft.value = appCommonStore.tabs.left
  // set drawer
  drawer.value = {
    left: appCommonStore.drawer.left,
    middle: appCommonStore.drawer.middle,
  }
  // set is mobile
  if (window.innerWidth < 768)
    appCommonStore.setIsMobile(true)
  else
    appCommonStore.setIsMobile(false)
  // window on resize
  window.onresize = () => {
    if (window.innerWidth < 768)
      appCommonStore.setIsMobile(true)
    else
      appCommonStore.setIsMobile(false)
  }
  // set document click
  document.addEventListener('click', (e) => {
    if (e.target instanceof HTMLElement) {
      if (e.target.className.indexOf('message-menu') === -1) {
        messageMenu.show = false
      }
    }
  })
  // get msg
  const msgLocal = msgCommonStore.getMsg
  if (msgLocal) {
    chatWindow.value.messages = JSON.parse(new encodeString().decode(msgLocal))
  }
  // scroll to bottom
  setTimeout(() => {
    const chatBox = document.getElementById('chat-box')
    chatBox!.scrollTop = chatBox!.scrollHeight
  }, 500)
})
// watch the theme
watch(theme, (value) => {
  appCommonStore.setTheme(value)
})
// watch the left tab
watch(tabLeft, (value) => {
  appCommonStore.setTabs("left", value)
})
// watch the drawer deep
watch(drawer, (value) => {
  appCommonStore.setDrawer("middle", value.middle)
  appCommonStore.setDrawer("left", value.left)
}, { deep: true })
watch(chatWindow, (value) => {
  msgCommonStore.setMsg(new encodeString().encode(JSON.stringify(value.messages)))
  // scroll to bottom
  const lastMsg = value.messages[value.messages.length - 1]
  if (document.getElementById('chat-box')!.scrollTop + document.getElementById('chat-box')!.clientHeight !== document.getElementById('chat-box')!.scrollHeight && self.value.id !== lastMsg.id) return
  setTimeout(() => {
    const chatBox = document.getElementById('chat-box')
    chatBox!.scrollTop = chatBox!.scrollHeight
  }, 200)
}, { deep: true })
// messageMenu is the menu of the message
const messageMenu = reactive(
  {
    show: false,
    dialog: {
      show: false,
      content: "",
      cancel: () => {
        messageMenu.dialog.show = false
      },
      confirm: () => {
        messageMenu.dialog.show = false
      },
      cancelText: "取消",
      confirmText: "确定",
    },
    msgId: "",
    timer: 0 as any as NodeJS.Timeout,
    location: {
      x: 0,
      y: 0,
    },
    menu: [
      {
        name: "复制",
        action: (e: MouseEvent | TouchEvent) => {
          const id = messageMenu.msgId
          const msg = chatWindow.value.messages.find((item) => item.messageId === id)
          copyText(msg?.message as string)
        },
        icon: "mdi-content-copy",
      },
      {
        name: "编辑",
        action: (e: MouseEvent | TouchEvent) => {
          const id = messageMenu.msgId
          const msg = chatWindow.value.messages.find((item) => item.messageId === id)
          sender.to = id
          sender.type = "edit"
          sender.value = msg?.message as string
        },
        icon: "mdi-pencil",
        disabled: false,
      },
      {
        name: "回复",
        action: (e: MouseEvent | TouchEvent) => {
          const id = messageMenu.msgId
          const msg = chatWindow.value.messages.find((item) => item.messageId === id)
          sender.to = id
          sender.type = "reply"
          sender.value = `@${msg?.name} `
        },
        icon: "mdi-reply",
        disabled: false,
      },
      {
        name: "转发",
        action: (e: MouseEvent | TouchEvent) => {
          messageMenu.dialog.show = true
        },
        icon: "mdi-share-variant",
      },
      {
        name: "删除",
        action: (e: MouseEvent | TouchEvent) => {
          const id = messageMenu.msgId
          const msg = chatWindow.value.messages.find((item) => item.messageId === id)
          messageMenu.dialog.show = true
          messageMenu.dialog.content = "确定删除该消息吗?"
          messageMenu.dialog.confirm = () => {
            messageMenu.dialog.show = false
            msg!.deleted = true
          }
        },
        icon: "mdi-delete",
      },
    ],
    rightClickProxy(e: MouseEvent) {
      e.preventDefault()
      const target = e.currentTarget as HTMLElement
      const id = target.getAttribute('msgId') as string
      messageMenu.msgId = id
      const location = {
        x: e.clientX,
        y: e.clientY,
      }
      messageMenu.location = location
      messageMenu.show = true
      const msg = chatWindow.value.messages.find((item) => item.messageId === id)
      messageMenu.menu[1].disabled = !(msg!.id === self.value.id)
    },
    touchStartProxy(e: TouchEvent) {
      e.preventDefault()
      const target = e.currentTarget as HTMLElement
      const id = target.getAttribute('msgId') as string
      messageMenu.msgId = id
      if (messageMenu.timer) clearTimeout(messageMenu.timer)
      const location = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      }
      messageMenu.location = location
      messageMenu.timer = setTimeout(() => {
        messageMenu.show = true
      }, 500)
    },
    touchEndProxy(e: TouchEvent) {
      e.preventDefault()
      if (messageMenu.timer) clearTimeout(messageMenu.timer)
    },
    touchMoveProxy(e: TouchEvent) {
      e.preventDefault()
      if (messageMenu.timer) clearTimeout(messageMenu.timer)
    },
  }
)
// input expand dialog
const expandInput = reactive(
  { show: false }
)
// jump to the msg
const jumpToMsg = (id: string | number) => {
  const msg = chatWindow.value.messages.find((item) => item.messageId === id)
  if (msg) {
    const chatBox = document.getElementById('chat-box')
    const msgBox = document.querySelector(`[msgId="${id}"]`) as HTMLElement
    if (msgBox) {
      chatBox!.scrollTop = msgBox.offsetTop - 5
    }
  }
}
</script>