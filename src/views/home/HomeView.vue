<template>
    <v-app id="col-air-home" :theme="theme">
        <v-card loading>
            <v-tabs v-model="tabValue" fixed-tabs center-active>
                <v-tab value="login">
                    登录
                </v-tab>
                <v-tab value="register">
                    注册
                </v-tab>
            </v-tabs>

            <v-window v-model="tabValue">
                <v-window-item value="login">
                    <v-form v-model="loginForm.vaild" @submit.prevent="loginForm.login">
                        <v-text-field v-model="loginForm.data.userId" :readonly="loginForm.loading"
                            :rules="[loginForm.rules.required, loginForm.rules.lengthUidCheck]" class="mb-2" clearable
                            label="账号" placeholder="请输入你的账号……" type="text"></v-text-field>
                        <v-text-field v-model="loginForm.data.userPwd" :readonly="loginForm.loading"
                            :rules="[loginForm.rules.required, loginForm.rules.lengthPwdCheck]" class="mb-2" clearable
                            label="密码" placeholder="请输入你的密码……" type="password"></v-text-field>
                        <v-btn :disabled="!loginForm.vaild" :loading="loginForm.loading" block size="large"
                            type="submit" variant="elevated">
                            登录
                        </v-btn>
                        <v-divider class="mt-2"></v-divider>
                    </v-form>
                </v-window-item>
                <v-window-item value="register">
                    <v-form v-model="registerForm.vaild" @submit.prevent="registerForm.register">
                        <v-text-field v-model="registerForm.data.userName" :readonly="registerForm.loading"
                            :rules="[registerForm.rules.required, registerForm.rules.lengthNameCheck]" class="mb-2"
                            clearable label="昵称" placeholder="请输入你的昵称……" type="text"></v-text-field>
                        <v-text-field v-model="registerForm.data.userPwd" :readonly="registerForm.loading"
                            :rules="[registerForm.rules.required, registerForm.rules.lengthPwdCheck, registerForm.rules.formatPwdCheck]"
                            class="mb-2" clearable label="密码" placeholder="请输入你的密码……" type="password"
                            @update:model-value="onPwdValueChange"></v-text-field>
                        <v-progress-linear v-model="registerForm.data.pwdRate" rounded height="6"></v-progress-linear>
                        <div class="password-rate">
                            <div>密码复杂度：{{ registerForm.data.pwdRate }} 分</div>
                            <v-dialog :fullscreen="appCommonStore.getIsMobile" v-model="dialog">
                                <template v-slot:activator="{ props }">
                                    <v-icon v-bind="props">
                                        mdi-information-outline
                                    </v-icon>
                                </template>
                                <v-card>
                                    <v-card-text>
                                        <h3>Q:为什么我的密码强度如此低？</h3>
                                        <br><br>A:密码强度是根据你的密码长度和密码的复杂度来计算的，密码长度越长，密码复杂度越高，密码强度越高，简单来说，<strong>密码越长</strong>相对来说较为安全。<br><br>
                                        <h3>Q:密码复杂度是什么？</h3>
                                        <br><br>A:密码复杂度是指你的密码中包含了多少种字符，如：数字、字母、特殊字符等，密码复杂度越高，密码强度越高，相对来说较为安全。<br><br>
                                        <h3>Q:我的密码不安全会怎么样？</h3><br><br>A:密码不安全可能会导致您的密码会被轻易的暴力破解或者被尝试出来，但Col Air
                                        Chat的系统无论您的密码有多简单，我们都会将您的密码<strong>高强度加密且不可逆</strong>的存储起来，评分系统只是为了提醒您，您的密码是否安全，如果您的密码不安全，我们建议您尽快修改您的密码。
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-btn block @click="dialog = false">关闭</v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-dialog>
                        </div>
                        <br>
                        <v-text-field v-model="registerForm.data.userConfirmPwd" :readonly="registerForm.loading"
                            :rules="[registerForm.rules.required, registerForm.rules.pwdConfirmCheck]" class="mb-2"
                            clearable label="确认密码" placeholder="请确认你的密码……" type="password"></v-text-field>
                        <v-text-field v-model="registerForm.data.userEmail" :readonly="registerForm.loading"
                            :rules="[registerForm.rules.required, registerForm.rules.formatEmailCheck]" class="mb-2"
                            clearable label="邮箱" placeholder="请输入你的邮箱……" type="email"></v-text-field>
                        <br>
                        <v-btn :disabled="!registerForm.vaild" :loading="registerForm.loading" block size="large"
                            type="submit" variant="elevated">
                            注册
                        </v-btn>
                        <v-divider class="mt-2"></v-divider>
                    </v-form>
                </v-window-item>
            </v-window>
        </v-card>
    </v-app>
</template>


<script lang="ts" setup>
// vue imports
import { ref, onMounted } from "vue"
// tools imports
import { valueStrong } from "@/tools/valueStrong"
// store imports
import { AppCommonStore } from '@/stores/app'
// store const
const appCommonStore = AppCommonStore()
// theme is the theme of the app
const theme = ref('light')
// onMounted is the hook of vue
onMounted(() => {
    // get the theme of the app
    theme.value = appCommonStore.theme
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
})
// form ref
const loginForm = ref({
    vaild: false,
    loading: false,
    data: {
        userId: '',
        userPwd: ''
    },
    rules: {
        required(v: string) {
            return !!v || '内容不允许为空'
        },
        lengthUidCheck(v: string) {
            return (v && v.length <= 16 && v.length >= 5) || '账号长度应为 5 至 16 位'
        },
        lengthPwdCheck(v: string) {
            return (v && v.length <= 32 && v.length >= 8) || '密码长度应为 8 至 32 位'
        }
    },
    login() {
        if (!loginForm.value.vaild) return
        loginForm.value.loading = true
        setTimeout(() => (loginForm.value.loading = false), 2000)
    }
})
const registerForm = ref({
    vaild: false,
    loading: false,
    data: {
        userPwd: '',
        userConfirmPwd: '',
        userEmail: '',
        userName: '',
        pwdRate: 0
    },
    rules: {
        required(v: string) {
            return !!v || '内容不允许为空'
        },
        lengthEmailCheck(v: string) {
            return (v && v.length <= 48 && v.length >= 4) || '邮箱长度应为 4 至 48 位'
        },
        lengthPwdCheck(v: string) {
            return (v && v.length <= 32 && v.length >= 8) || '密码长度应为 8 至 32 位'
        },
        lengthNameCheck(v: string) {
            return (v && v.length <= 16 && v.length >= 2) || '昵称长度应为 2 至 16 位'
        },
        formatEmailCheck(v: string) {
            return (v && /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(v)) || '邮箱格式不正确'
        },
        pwdConfirmCheck(v: string) {
            return (v && v === registerForm.value.data.userPwd) || '两次密码输入不一致'
        },
        formatPwdCheck(v: string) {
            return (v && /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[^]{8,32}$/.test(v)) || '密码应包含大小写字母和数字'
        }
    },
    register() {
        if (!registerForm.value.vaild) return
        registerForm.value.loading = true
        setTimeout(() => (registerForm.value.loading = false), 2000)
    }
})
// tabs ref
const tabValue = ref("login")
// onPwdValueChange
const onPwdValueChange = (value: string) => {
    registerForm.value.data.pwdRate = new valueStrong().rate(value)
}
// dialog ref
const dialog = ref(false)
</script>

<style scoped>
.v-card {
    width: 400px;
    height: 700px;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    position: absolute;
}

.v-form {
    width: 90%;
    margin: 0 auto;
    margin-top: 40px;
}

.progress-box {
    display: flex;
    justify-content: space-between;
}

.v-progress-linear {
    margin-top: 10px;
}

.password-rate {
    display: flex;
    justify-content: space-between;
}


@media screen and (max-width: 768px) {
    .v-card {
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        transform: translate(0, 0);
        position: absolute;
    }
}
</style>