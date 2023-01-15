import { defineStore } from 'pinia'

type status = {
    [key: string]: any
}

const serverAllowMaxLoginTime = 1000 * 60 * 60 * 24 * 1 // 1 days

export const UserCommonStore = defineStore('userCommon', {
    state: () => ({
        userStatus: {
            isLogin: false,
            lastPingTime: 0,
            lastLoginTime: 0,
        } as status,
        userInfo: {} as user
    }),
    getters: {
        getUserStatus: (state) => state.userStatus,
        getUserInfo: (state) => state.userInfo,
        getIsLogin: (state) => state.userStatus.isLogin && state.userStatus.lastPingTime + serverAllowMaxLoginTime > Date.now(),
    },
    actions: {
        setUserInfo(userInfo: user) {
            this.userInfo = userInfo
        },
        setUserStatus(key: string, value: any) {
            this.userStatus[key] = value
        }
    },
    persist: true,
})