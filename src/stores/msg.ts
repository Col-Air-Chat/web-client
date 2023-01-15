import { defineStore } from 'pinia'

export const MsgCommonStore = defineStore('msgCommon', {
    state: () => ({
        msg: "",
    }),
    getters: {
        getMsg: (state) => state.msg,
    },
    actions: {
        setMsg(msg: string) {
            this.msg = msg
        }
    },
    persist: true,
})