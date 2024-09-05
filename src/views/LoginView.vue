<template>
    <div class="bobyBox">
        <div class="box">
            <div class="pre-box" ref="preRes">
                <h3>WELCOME</h3>
                <p>JOIN US!</p>
                <div class="img-box">
                    <img :src="getImageUrl()" alt="" ref="imgRes"/>
                </div>
            </div>
            <div class="register-form">
                <div class="title-box1">
                    <h1>注册</h1>
                </div>
                <el-form :model="loginForm" class="register-container" :rules="rules" ref="regFormRef">
                    <el-form-item prop="email">
                        <el-input type="input" v-model= "loginForm.email"
                            placeholder="邮箱" clearable prefix-icon="Message"></el-input>
                    </el-form-item>
                    <el-form-item prop="emailCode">
                        <el-input type="input" style="width: 220px;"
                            placeholder="请输入邮箱验证码"
                            clearable
                            v-model="loginForm.emailCode"
                            prefix-icon="Edit"></el-input>
                        <el-button
                            style="margin-left: 60px;"
                            type="primary"
                            @click="getEmailCode">获取验证码</el-button>
                    </el-form-item>

                    <el-form-item prop="nickName">
                        <el-input type="input" v-model= "loginForm.nickName"
                        placeholder="昵称" clearable prefix-icon="User"></el-input>
                    </el-form-item>
                    <el-form-item prop="registerPassword" >
                        <el-input type="password" v-model= "loginForm.registerPassword"
                         placeholder="密码" clearable prefix-icon="Lock"></el-input>
                    </el-form-item>
                    <el-form-item prop="registerPassword">
                        <el-input type="password" v-model="loginForm.reRegisterPassword"
                         placeholder="确认密码" clearable prefix-icon="Check"></el-input>
                    </el-form-item>
                    <el-form-item prop="checkCode">
                        <div class="checkcode">
                            <el-input
                                placeholder="请输入验证码"
                                v-model="loginForm.checkCode"
                                @keyup.enter="handleRegister()">
                            </el-input>
                                <img :src="CheckCodeImgUrl"
                                    @click="changeImg(0)"/>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleRegister">注册</el-button>
                        <el-switch
                            v-model="LoginFlag"
                            size="large"
                            active-text="登录"
                            inactive-text="注册"
                            style="--el-switch-on-color: #c9e0ed; --el-switch-off-color: #edd4dc"
                            @change="handleChange()"
                        />
                    </el-form-item>
                </el-form>
            </div>
            <div class="login-form">
                <div class="title-box">
                    <h1>登录</h1>
                </div>
                <el-form :model="loginForm" class="login-container" :rules="rules2" ref="loginFormRef">
                    <el-form-item prop="email">
                        <el-input type="input" placeholder="邮箱" v-model="loginForm.email" clearable prefix-icon="User"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" placeholder="密码" v-model="loginForm.password" clearable show-password prefix-icon="Lock"></el-input>
                    </el-form-item>
                    <el-form-item prop="checkCode">
                        <div class="checkcode">
                            <el-input
                                placeholder="请输入验证码"
                                v-model="loginForm.checkCode"
                                @keyup.enter="handleLogin()">
                            </el-input>
                                <img :src="CheckCodeImgUrl"
                                    @click="changeImg(0)"/>
                        </div>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="handleLogin">登录</el-button>
                        <el-switch
                            v-model="LoginFlag"
                            size="large"
                            active-text="登录"
                            inactive-text="注册"
                            style="--el-switch-on-color: #c9e0ed; --el-switch-off-color: #edd4dc"
                            @change="handleChange()"
                        />
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
    <Dialog
        :show="dialogConfig4SendMailCode.show"
        :title="dialogConfig4SendMailCode.title"
        :buttons="dialogConfig4SendMailCode.buttons"
        width="500px"
        :showCancel="false"
        @close="dialogConfig4SendMailCode.show = false"
        >
        <el-form
            :model="formData4SendMailCode"
            :rules="rules"
            ref="sendEmailRef"
            label-width="80px"
            @submit.prevent
        >
            <el-form-item label="邮箱">
            {{ loginForm.email }}
            </el-form-item>
            <div class="checkDig">
            <el-form-item label="验证码" prop="checkCode">
                <el-input
                placeholder="请输入验证码"
                v-model.trim="formData4SendMailCode.checkCode"
                >
                
                </el-input>
                <img
                :src="checkCodeUrl4SendMailCode"
                class="check-code"
                @click="changeImg(1)"
                />
            </el-form-item>
            </div>
        </el-form>
        </Dialog>
</template>

<script setup>
    import { reactive, ref, getCurrentInstance, onMounted, nextTick } from 'vue';
    import { useAllDateStores } from '@/stores'
    import { useRouter, useRoute } from 'vue-router'
    import md5 from 'js-md5';

    const router = useRouter();
    const route = useRoute();

    onMounted(()=>{
        resetForm();
    })

    const loginForm = ref({})

    const LoginFlag = ref(false);
    const preRes = ref('');

    const loginFormRef = ref();
    const regFormRef = ref();

    const getImageUrl = ()=>{
        return new URL(LoginFlag.value ? `../assets/images/wuwu.jpeg` : `../assets/images/waoku.jpg`, import.meta.url).href;
    }

    const CheckCodeImgUrl = ref();

    const changeImg = (type) => {
        if (type === 0) {
            CheckCodeImgUrl.value = "http://localhost:7090/api/checkCode" + "?type=" + type + "&time=" + new Date().getTime();
        }
        else if (type === 1) {
            checkCodeUrl4SendMailCode.value = "http://localhost:7090/api/checkCode" + "?type=" + type + "&time=" + new Date().getTime();
        }
    }

    const {proxy} = getCurrentInstance();

    function handleChange() {
        if (LoginFlag.value) {
            preRes.value.style.transform = 'translateX(100%)'
            preRes.value.style.background = '#c9e0ed'
        }
        else {
            preRes.value.style.transform = 'translateX(0%)'
            preRes.value.style.background = '#edd4dc'
        }
        resetForm();
    }

    const checkRePassword = (rule, value, callback)=>{
        if (value !== loginForm.value.registerPassword) {
            callback(new Error(rule.message));
        } else {
            callback();
        }
    }

    const rules = {
        email: [
            { required: true, message: "请输入邮箱" },
            { validator: proxy.Verify.email, message: "请输入正确的邮箱" },
        ],
        emailCode: [{ required: true, message: "请输入邮箱验证码" }],
        nickName: [{ required: true, message: "请输入昵称" }],
        registerPassword: [
            { required: true, message: "请输入密码" },
            {
            validator: proxy.Verify.password,
            message: "密码只能是数字，字母，特殊字符 8-18位",
            },
        ],
        reRegisterPassword: [
            { required: true, message: "请再次输入密码" },
            {
            validator: checkRePassword,
            message: "两次输入的密码不一致",
            },
        ],
        checkCode: [{ required: true, message: "请输入图片验证码" }],
    };

    const rules2 = {
        email: [
            { required: true, message: "请输入邮箱" },
            { validator: proxy.Verify.email, message: "请输入正确的邮箱" },
        ],
        password: [{ required: true, message: "请输入密码" }],
        emailCode: [{ required: true, message: "请输入邮箱验证码" }],
        checkCode: [{ required: true, message: "请输入图片验证码" }],
    };


    const checkCodeUrl4SendMailCode = ref();
    const formData4SendMailCode = ref({});
    const sendEmailRef = ref();
    const dialogConfig4SendMailCode = reactive({
        show: false,
        title: "发送邮箱验证码",
        buttons: [
            {
            type: "primary",
            text: "发送验证码",
            click: () => {
                sendEmailCode();
            },
            },
        ],
    });

    const getEmailCode = async ()=> {
        regFormRef.value.validateField("email", (valid) => {
            if (!valid) {
            return;
            }
            dialogConfig4SendMailCode.show = true;
        })
        nextTick(() => {
            changeImg(1);
            sendEmailRef.value.resetFields();
            formData4SendMailCode.value = {
                email: loginForm.value.email,
            };
        });
    };

    const sendEmailCode = () => {
        sendEmailRef.value.validate(async (vaild)=>{
            if (!vaild) return;
            const params = Object.assign({}, formData4SendMailCode.value);
            params.type = 0;
            params.email = loginForm.value.email
            params.checkCode = formData4SendMailCode.value.checkCode;
            // console.log(params)
            let result = await proxy.$api.getRegEmailCode(params, ()=>changeImg(1));
            // console.log(result);
            if (!result) {
                return;
            }
        proxy.Message.success("验证码发送成功，请登录邮箱查看");
            dialogConfig4SendMailCode.show = false;
        })
    };

    const resetForm = () => {
        nextTick(() => {
            changeImg(0);
            loginForm.value = {};

            if (!LoginFlag.value) {
                const cookieLoginInfo = proxy.VueCookies.get("loginInfo");
                if (cookieLoginInfo) {
                    loginForm.value = cookieLoginInfo;
                }
            }
        });


    };

    const handleRegister = async ()=>{
        regFormRef.value.validate(async (vaild)=>{
            if (!vaild) return;
            let params = {};
            Object.assign(params, loginForm.value);
            params.password = params.registerPassword;
            delete params.registerPassword;
            delete params.reRegisterPassword;
            let res = await proxy.$api.registerEmailPas(params, ()=>changeImg(0));
            // console.log(res);
            proxy.Message.success("注册成功，请登录");
            
        })
    } 

    const store = useAllDateStores();
    const handleLogin = ()=>{
        loginFormRef.value.validate(async (vaild)=>{
            if (!vaild) return;
            let params = {};
            Object.assign(params, loginForm.value);
            params.password = md5(params.password);
            let res = await proxy.$api.loginCheck(params, ()=>changeImg(0));
            // console.log(res);
            if (!res) return;
            const loginInfo = {
                email: params.email,
                password: loginForm.value.password,
            };
            // console.log(res);
            
            proxy.VueCookies.set("loginInfo", loginInfo, "7d");
            res.avatar = proxy.$api.getAvatar(res.userId, new Date().getDate());
            proxy.VueCookies.set("userInfo", res, 0);
            store.state.avatar = res.avatar;
            router.push(route.query.redirectUrl || '/');
            proxy.Message.success("登录成功");
        })
    }

</script>

<style lang="less" scoped>

* {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
}

.bobyBox {
        width: 100%;
        height: 100%;
        overflow: hidden;
        background: linear-gradient(to right, rgb(247, 209, 215), rgb(191, 227, 241));
}


@media screen and (min-width: 767px){
    .box {
        width: 1050px;
        height: 600px;
        display: flex;
        position: relative;
        // background-color: #fff;
        margin:50px auto;
        border-radius: 8px;
        border: 1px solid rgba(255, 255, 255, .6);
        box-shadow: 4px 4px 3px rgba(0, 0, 0, .1);
    }

    .pre-box {
        z-index: 2;
        width: calc(1050px / 2);
        height: 600px;
        left: 0;
        top: 0;
        position: absolute;
        border-radius: 4px;
        background-color: #edd4dc;
        box-shadow: 4px 4px 3px rgba(0, 0, 0, .1);
        transition: transform 0.4s ease-in-out;
        h3 {
            font-size: 40px;
            color:#fff;
            margin-top: 150px;
            text-align: center;
            letter-spacing: 5px;
            text-shadow: 4px 4px 3px rgba(0, 0, 0, .1);
        }
        p {
            color:#fff;
            height: 30px;
            line-height: 30px;
            text-align: center;
            margin: 20px 0;
            font-weight: bold;
            text-shadow: 4px 4px 3px rgba(0, 0, 0, .1);
        }
    }

    .img-box {
        width: 300px;
        height: 300px;
        margin: 20px auto;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 4px 4px 3px rgba(0, 0, 0, .1);
        img {
            width: 100%;
        }
    }

    .register-form, .login-form {
        flex: 1;
        height: 100%;
    }

    .login-container {
        width: 450px;
        padding: 35px 35px 15px 35px;
        margin: auto;
        :deep(.el-form-item__content){
            margin-bottom: 20px;
        }
        :deep(.el-button) {
            margin-left: 20px;
            width: 100px;
        }
        :deep(.el-switch) {
            margin-left: 110px;
        }
    }

    .register-container {
        h2 {
            line-height: 20px;
        }
        width: 450px;
        padding: 35px 35px 15px 35px;
        margin: auto;
        :deep(.el-form-item__content){
            margin-bottom: 20px;
        }
        :deep(.el-button) {
            margin-left: 20px;
            width: 100px;
        }
        :deep(.el-switch) {
            margin-left: 110px;
        }
    }

    .title-box1 {
        height: 145px;
        line-height: 200px;
        h1 {
            font-size: 35px;
            color:#fff;
            text-align: center;
            letter-spacing: 5px;
        }
    }

    .title-box {
        height: 300px;
        line-height: 500px;
        h1 {
            font-size: 35px;
            color:#fff;
            text-align: center;
            letter-spacing: 5px;
        }
    }

    .checkcode {
        display: flex;
        flex-direction: row;
        .el-input{
            width: 200px;
        }
        img {
            margin-left: 55px;
            max-height: 35px;
        }
    }

    .checkDig{
        display: flex;
        flex-direction: row;
        padding-top: 20px;
        padding-bottom: 30px;
        :deep(.el-input){
            width: 200px;
        }
        img{
            margin-left: 20px;
            max-height: 35px;
        }
    }
    
}

@media screen and (max-width: 767px){
    .bobyBox {
        .pre-box {
            display: none;
        }
    }
    .box {
        width: 100vw;
        height: 100vh;
    }

}


// .move-enter-active, .move-leave-active {
//     transition: transform 0.5s ease;
// }

// .move-enter, .move-leave-to {
//     transform: translateX(0);
// }

// .move-leave, .move-enter-to {
//     transform: translateX(100%);
// }


</style>
