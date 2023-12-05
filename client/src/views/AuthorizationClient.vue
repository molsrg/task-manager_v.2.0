<template>
<div class="auth">
  <div class="auth-container">
    <div :class="isReg ? 'auth-form auth-form-short' : 'auth-form '">
      <div class="auth-form__section">
        <img
          src="../assets/images/logo/logo.svg"
          alt="logo"
        />
        <h3 class="auth-form__section_text">Task Unity Tech</h3>
      </div>
      <div class="auth-form__section">
        <button @click="changeReg" :class="isReg ? 'auth-form__section_button-inactive' : 'auth-form__section_button'">Регистрация</button>
        <button @click="changeReg" :class="isReg ? 'auth-form__section_button' : 'auth-form__section_button-inactive'">Вход</button>
      </div>
      <div style="overflow: hidden; max-height: 410px;"  >
        <form @submit="authUser"
          :class="isReg ? 'form-signin ' : 'form-signin form-signin-left'"
          action=""
          method="post"
          name="form"
        >
        <div>
          <input class="auth-form-input"  type="email" placeholder="E-mail" v-model="mail">
          <!-- <span class="invalid-span" v-if="v$.mail.$invalid && !v$.login.$dirty">Некорректный email</span>           -->
          <span class="invalid-span" v-if="this.isInvalidMail_incorrect">Почта не найдена</span>  
        </div>
        
        <div>
          <input class="auth-form-input"  type="password" placeholder="Пароль" v-model="password">
          <!-- <span class="invalid-span" v-if="v$.password.$invalid && !v$.password.$dirty">Введите пароль</span> -->
          <span class="invalid-span" v-if="this.isInvalidPassword_incorrect">Введён неверный пароль</span>
        </div>
        
        <a class="auth-form-input_forget">Забыли пароль?</a>

        <button type="submit" class="auth-form-button">{{ auth }}</button>

        </form>

        <form @submit="authUser"
          :class="isReg ? 'form-signup' : 'form-signup form-signup-left'"
          action=""
          method="post"
          name="form"
          
        >
        <div>
          <input class="auth-form-input" type="text" placeholder="Имя пользователя" v-model="login" >
          <span class="invalid-span" v-if="v$.login.$invalid && !v$.login.$dirty">Минимальная длина 6 символов</span>
          <!-- <span class="invalid-span" v-if="v$.login.$invalid && v$.login.$dirty">Проверьте правильность введённых данных</span> -->
          <span class="invalid-span" v-if="isInvalidLogin">Пользователь с таким именем уже существует</span>
          
        </div>

        <div>
          <input class="auth-form-input"  type="text" placeholder="E-mail" v-model="mail">
          <span class="invalid-span" v-if="v$.mail.$invalid && !v$.login.$dirty">Некорректный email</span>          
          <span class="invalid-span" v-if="isInvalidEmail">Эта почта уже была зерегестрирована</span>
        </div>

        <div>
          <input class="auth-form-input"  type="text" placeholder="Пароль" v-model="password">
          <span class="invalid-span" v-if="v$.password.$invalid && !v$.password.$dirty">Минимальная длина 8 символов. Допускаются только буквы латинницы и цифры. Обязательно наличие 1 буквы.</span>
          <span class="invalid-span" v-if="isInvalidPassword_valid">Пароль не прошел валидацию</span>
        </div>
        <div>
          <input class="auth-form-input"  type="text" placeholder="Подтверждение пароля" v-model="confirm_password">
          <!-- <span class="invalid-span" v-if="v$.confirm_password.$invalid">Минимальная длина 8 символов</span> -->
          <!-- {{ v$.confirm_password.sameAsPassword }} -->
          <span class="invalid-span" v-if="(this.password !== this.confirm_password && !v$.confirm_password.$dirty) || this.isInvalidPassword_dsntmatch">Пароли не совпадают</span>
        </div>
          
          <button type="submit" class="auth-form-button">{{ auth }}</button>
      </form>
      
      </div> 

      <div class="auth-form-or">
          <div class="auth-form-or__text">
              <span>или</span>
            </div>
          <div class="auth-form-container">
            <a href="https://accounts.google.com/o/oauth2/auth?client_id=429829081659-l7g63tlu2g45o46vkf54l5sk8i2rqjq1&redirect_uri=http://localhost:8080/waiting&response_type=code&scope=https://www.googleapis.com/auth/userinfo.profile&state=123"><img src="../assets/images/auth/google.svg"></a>

            <a href="https://github.com/login/oauth/authorize?scope=user:email&client_id=db3492f883c60a412c39&redirect_uri=http://localhost:8080/waiting"> <img src="../assets/images/auth/github.svg"></a>

            <a href="https://oauth.yandex.ru/authorize?client_id=5b1b15fa24b542948bbd72ac320d6b9f&redirect_uri=http://localhost:8080/waiting&response_type=code"> <img src="../assets/images/auth/yandex.svg"></a>
          </div>
      </div>
    </div>
  </div>

</div>

  

</template>

<script>
import axios from 'axios'
import { useVuelidate } from '@vuelidate/core'
import { required, minLength, email } from '@vuelidate/validators'

export default {
  setup () {
        return {
            v$: useVuelidate()
        }
    },
  data(){
    return { 
      login: '', 
      mail: '', 
      password: '', 
      confirm_password: '', 
      auth: 'Зарегестрироваться',

    isReg: false,
      errors: [],


      isInvalidEmail: false, 
      isInvalidLogin: false, 
      isInvalidPassword_incorrect: false,
      isInvalidMail_incorrect: false,
      isInvalidPassword_valid: false, 
      isInvalidPassword_dsntmatch: false
    }
  }, 
  validations: {
    login: { required, minLength: minLength(6) },
    mail: { required, email },
    password: { required,  minLength: minLength(8)},
    confirm_password: { required,  minLength: minLength(8)},
    },

  mounted(){
    if(localStorage.getItem('AccessToken')){
      window.location.href = "http://localhost:8080/home"
    }
  },
  methods: {
    changeReg(){
      this.isReg = !this.isReg
      this.auth = this.auth == 'Войти' ?  'Зарегестрироваться' : 'Войти'
    },

    async authUser(event) {
      event.preventDefault();
      this.isInvalidEmail = false
      this.isInvalidLogin = false
      this.isInvalidPassword_valid = false
      this.isInvalidPassword_incorrect = false
      this.isInvalidMail_incorrect = false
    
      const isFormCorrect = await this.v$.$validate()
      const validPass =  await this.validForm()
      console.log(validPass)



            if (!isFormCorrect && validPass && this.auth == 'Зарегестрироваться') {
              
              console.log('Валидация формы не прошла')
              return
            }
      
      if(this.errors.length == 0){
        let data = {}
        let type = ''

        if(this.auth == 'Зарегестрироваться'){
          data = {
          username: this.login,
          email: this.mail,
          password: this.password,
            } 
          
          type = 'registration'
        }
        else if (this.auth == 'Войти') {
          data = {
            email: this.mail,
            password: this.password,
          }

          type = 'login'
        }
        axios.post(`http://localhost:5000/auth/${type}`, data)
          .then((response) => {
              this.login = ''
              this.mail = '', 
              this.password = '', 
              this.confirm_password = ''

              const token = response.data.AccessToken
              localStorage.setItem('AccessToken', token); // write
              // console.log(localStorage.getItem('AccessToken')); // read
              window.location.href = "http://localhost:8080/home"

              
      
                
          }
          )

          .catch((error) => {
            console.log(error)
            // this.errors = [error.response.data?.errors]
            // this.errors = [error.response.data?.message]

            if(error.response.data?.message == "Почтовый адрес уже был зарегистрирован"){
              this.isInvalidEmail = true
              this.mail = ""
            }
            if(error.response.data?.message == "Пользователь с таким именем уже существует"){
              this.isInvalidLogin = true
              this.login = ""
            }
            if(error.response.data?.message == "Введен неверный пароль"){
              this.isInvalidPassword_incorrect = true
              this.password = ""
            }

            if(error.response.data?.message == `Почта ${this.mail} не найдена`){
              this.isInvalidMail_incorrect = true
              this.mail = ""
            }

          })   
      }
      
    },     
    validForm(){
      const regex = /^(?=.*[A-Za-z])([A-Za-z0-9]+)$/;
      if(this.auth == 'Зарегестрироваться'){
        if(this.password !== this.confirm_password){
                this.isInvalidPassword_dsntmatch = true
          }
      }
      if(!regex.test(this.password)){
        this.isInvalidPassword_valid = true
        this.password = ''
        this.confirm_password = ''
      }

      if(this.isInvalidPassword_dsntmatch || this.isInvalidPassword_valid){
        return false
      }

      return true
    },

  }
}
</script>

<style scoped>
.auth {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
}

.auth-form {
    max-height: 660px;
    width: 400px;

    display: flex;
    flex-direction: column;
    gap: 20px;

    border: 2px #cacdd3 solid;
    overflow: hidden;
    transition: all 0.5s ease;

    font-family: Raleway;
    padding: 20px 10px;
}

.auth-form-short {
    max-height: 500px;
}

.auth-form__section {
    display: flex;
    gap: 11px;
    align-items: center;
}

.auth-form__section h3 {
    font-size: 20px;
    font-weight: 200;
}

.auth-form__section_button {
    font-size: 32px;
    font-weight: 700;

    padding-bottom: 10px;
    color: #15616d;

    border-bottom: solid 2px #15616d;
    transition: all 0.25s ease;
    cursor: pointer;
}

.auth-form__section_button-inactive {
    font-family: Raleway;
    font-size: 32px;
    font-weight: 700;
    padding-bottom: 10px;
    color: #001524;
    cursor: pointer;
}

.form-signin {
    display: flex;
    flex-direction: column;
    /* background-color: red; */
    gap: 41px;
    padding-top: 10px;
    width: 100%;
    height: 375px;

    transition: opacity 0.5s ease, transform 0.5s ease;
}

.form-signin-left {
    transform: translateX(-400px);
}

.form-signup {
    display: flex;
    flex-direction: column;
    gap: 41px;
    padding-top: 10px;
    /* background-color: blue; */
    width: 100%;
    height: 375px;

    position: relative;
    top: -375px;
    left: 400px;
    transition: all 0.5s ease;
}

.form-signup-left {
    transform: translateX(-400px);
}

.auth-form-input {
    margin: 0 auto;
    width: 95%;
    margin-bottom: 3px;
    outline: none;
    border: 0px solid white;
    border-bottom: 1px solid rgba(0, 21, 36, 0.5);
    background: transparent;

    font-family: Raleway;
    font-size: 16px;
}

.auth-form-input_forget {
    color: #15616d;
    border-bottom: 1px solid #15616d;
    cursor: pointer;

    font-family: Raleway;
    font-size: 16px;

    max-width: 123px;
    margin-left: 2%;
}

.auth-form-button {
    width: 95%;
    margin: 0 auto;
    padding: 16px 53px;
    border-radius: 10px;

    font-size: 14px;
    font-weight: 500;

    color: rgba(255, 236, 209, 1);
    background: rgba(135, 151, 154, 1);

    cursor: pointer;
}

.auth-form-or {
    width: 95%;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-height: 100px;
}

.auth-form-or__text {
    text-align: center;
    padding-bottom: 15px;
    position: relative;
}

.auth-form-or__text:before,
.auth-form-or__text:after {
    content: "";
    display: inline-block;
    vertical-align: middle;

    width: 100%;
    height: 1px;

    background-color: rgba(0, 21, 36, 0.5);

    position: relative;
}
.auth-form-or__text:before {
    margin-left: -100%;

    left: -14px;
}
.auth-form-or__text:after {
    margin-right: -100%;

    right: -14px;
}

.auth-form-container {
    display: flex;
    justify-content: space-between;
}

</style>