<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import oauthServices from "@/services/oauthServices";
import { useAdminStore } from "@/stores/admin";

const adminStore = useAdminStore();
const router = useRouter();
const email = ref("");
const password = ref("");

const emailError = ref("");
const passwordError = ref("");
const formError = ref("");

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.value) {
    emailError.value = "Email is required";
    return false;
  }
  if (!emailRegex.test(email.value)) {
    emailError.value = "Please enter a valid email address";
    return false;
  }
  emailError.value = "";
  return true;
};

const validatePassword = () => {
  if (!password.value) {
    passwordError.value = "Password is required";
    return false;
  }

  // Check for minimum length
  if (password.value.length < 6) {
    passwordError.value = "Password must be at least 6 characters long";
    return false;
  }

  // Check for at least one capital letter
  if (!/[A-Z]/.test(password.value)) {
    passwordError.value = "Password must contain at least one capital letter";
    return false;
  }

  passwordError.value = "";
  return true;
};

const handleSubmit = async (event) => {
  event.preventDefault();
  formError.value = "";

  const isEmailValid = validateEmail();
  const isPasswordValid = validatePassword();

  if (!isEmailValid || !isPasswordValid) {
    return;
  }

  try {
    const loginResponse = await oauthServices.login({
      email: email.value,
      password: password.value,
    });

    adminStore.setToken(loginResponse.data);
    console.log("long", loginResponse.data);


    adminStore.setAdminInfo(loginResponse.data.user);
    router.push("/admin/");
  } catch (error) {
    formError.value = "Invalid email or password";
    console.error("Login error:", error);
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-50 to-gray-100">
    <div class="max-w-md w-full space-y-8 bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-xl">
      <!-- Admin Title -->
      <div class="text-center">
        <h1 class="text-4xl font-bold text-gray-800 mb-2">Admin</h1>
        <p class="text-gray-500">Sign in to your dashboard</p>
        <div class="mt-4 mb-8 flex justify-center">
          <div class="h-1 w-16 bg-primary rounded-full"></div>
        </div>
      </div>

      <form class="mt-8 space-y-6" @submit="handleSubmit">
        <!-- Form Error Message -->
        <div v-if="formError" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
          {{ formError }}
        </div>

        <!-- Email Input -->
        <div class="relative">
          <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
            Email
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" width="22" height="22" viewBox="0 0 22 22" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.5">
                  <path
                    d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                    fill="currentColor" />
                </g>
              </svg>
            </div>
            <input id="email" name="email" type="email" v-model="email" @input="validateEmail" @blur="validateEmail"
              required
              class="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-white/50 backdrop-blur-sm"
              :class="{ 'border-red-500': emailError }" placeholder="Enter your email" />
            <p v-if="emailError" class="text-red-500 text-sm mt-1">
              {{ emailError }}
            </p>
          </div>
        </div>

        <!-- Password Input -->
        <div class="relative">
          <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
            Password
          </label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400" width="22" height="22" viewBox="0 0 22 22" fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <g opacity="0.5">
                  <path
                    d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                    fill="currentColor" />
                  <path
                    d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                    fill="currentColor" />
                </g>
              </svg>
            </div>
            <input id="password" name="password" type="password" v-model="password" @input="validatePassword"
              @blur="validatePassword" required
              class="appearance-none rounded-lg relative block w-full pl-10 pr-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary sm:text-sm bg-white/50 backdrop-blur-sm"
              :class="{ 'border-red-500': passwordError }" placeholder="6+ Characters, 1 Capital letter" />
            <p v-if="passwordError" class="text-red-500 text-sm mt-1">
              {{ passwordError }}
            </p>
          </div>
        </div>

        <!-- Sign In Button -->
        <div>
          <button type="submit"
            class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 shadow-lg shadow-primary/30">
            Sign In
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
