<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="flex flex-center bg-grey-2">
        <q-card class="q-pa-md shadow-2 my_card" bordered>
          <q-card-section class="text-center">
            <div class="text-grey-9 text-h5 text-weight-bold">Admin Tool</div>
            <div class="text-grey-8">Sign in below to access your account</div>
          </q-card-section>
          <q-card-section>
            <q-input
              dense
              outlined
              v-model="email"
              label="Email Address"
              :rules="[(val) => !!val || 'Email is required']"
            ></q-input>
            <q-input
              dense
              outlined
              class="q-mt-md"
              v-model="password"
              type="password"
              label="Password"
              :rules="[(val) => !!val || 'Password is required']"
            ></q-input>
          </q-card-section>
          <q-card-section>
            <q-btn
              @click="handleLogin"
              style="border-radius: 8px"
              color="dark"
              rounded
              size="md"
              label="Sign in"
              no-caps
              class="full-width"
            ></q-btn>
          </q-card-section>
          <q-card-section class="text-center q-pt-none">
            <div class="text-grey-8">
              Don't have an account yet?
              <a href="#" class="text-dark text-weight-bold" style="text-decoration: none"
                >Sign up.</a
              >
            </div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { useUserStore } from 'stores/user'
import { pinia } from 'boot/pinia'

export default {
  name: 'login-page',
  setup() {
    const email = ref('')
    const password = ref('')
    const router = useRouter()
    const userStore = useUserStore(pinia)

    const handleLogin = async () => {
      if (!email.value || !password.value) {
        Notify.create({
          message: 'Please fill in both fields',
          color: 'negative',
        })
        return
      }
      const loginData = { email: email.value, password: password.value }
      console.log('Attempting login with:', loginData)

      try {
        // add here server endpoint for login
        // const response = await fetch('/', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(loginData),
        // })

        // random response object
        const response: Response = new Response(
          JSON.stringify({
            message: 'Login successful!',
            token: 'example_token',
          }),
          {
            status: 200,
            statusText: 'OK',
            headers: {
              'Content-Type': 'application/json',
            },
          },
        )

        if (response.status === 404) {
          Notify.create({
            message: 'The requested resource was not found. Please check the URL.',
            color: 'negative',
          })
          return
        }

        const data = await response.json()

        if (response.ok) {
          Notify.create({
            message: 'Login successful!',
            color: 'positive',
          })
          userStore.setToken(data.token)
          console.log('isSignedIn after setting token:', userStore.isSignedIn)
          router.push('/')
        } else {
          Notify.create({
            message: data.message || 'Login failed',
            color: 'negative',
          })
        }
      } catch (error) {
        Notify.create({
          message: 'An error occurred during login',
          color: 'negative',
        })
        console.error('Login error:', error)
      }
    }

    return {
      email,
      password,
      handleLogin,
    }
  },
}
</script>
