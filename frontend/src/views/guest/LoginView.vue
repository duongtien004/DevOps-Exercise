<script setup>
import { ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import DefaultLayout from "@/layouts/user/DefaultLayout.vue";
import oauthServices from "@/services/oauthServices";
import { useUserStore } from "@/stores/user";

const userStore = useUserStore();
const router = useRouter();
const email = ref("");
const password = ref("");
const showPassword = ref(false);
// Error states
const emailError = ref("");
const passwordError = ref("");
const formError = ref("");

// Toggle password visibility
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Validation functions
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
  if (password.value.length < 6) {
    passwordError.value = "Password must be at least 6 characters long";
    return false;
  }
  passwordError.value = "";
  return true;
};



// Form submission handler
const handleSubmit = async (event) => {
  event.preventDefault();
  formError.value = "";

  // Validate all fields
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
    userStore.setToken(loginResponse.data);

    const userResponse = await oauthServices.getme(
      loginResponse.data.access_token,
      loginResponse.data.user._id
    );
    console.log(userResponse.data);

    userStore.setUserInfo(userResponse.data.data);

    router.push("/");
  } catch (error) {
    formError.value = "Invalid email or password";
    console.error("Login error:", error);
  }
};
</script>

<template>
  <DefaultLayout>
    <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto my-10 border">
      <h2 class="text-2xl font-bold mb-6 text-center">Login</h2>



      <div class="relative flex items-center justify-center mb-6">
        <hr class="w-full border-gray-300" />
        <span class="absolute bg-white px-4 text-gray-500">or</span>
      </div>

      <form @submit="handleSubmit">
        <!-- Form Error Alert -->
        <div v-if="formError" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {{ formError }}
        </div>

        <!-- Email -->
        <div class="mb-4">
          <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
          <input type="email" id="email" v-model="email" @blur="validateEmail"
            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email" required />
          <p v-if="emailError" class="text-red-500 text-sm mt-1">
            {{ emailError }}
          </p>
        </div>

        <!-- Password -->
        <div class="mb-6">
          <div class="flex justify-between items-center mb-2">
            <label for="password" class="text-gray-700 font-bold">Password</label>
            <RouterLink to="/forgot-password" class="text-sm text-blue-500 hover:underline">
              Forgot Password?
            </RouterLink>
          </div>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password" @blur="validatePassword"
              class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password" required />
            <button type="button" @click="togglePasswordVisibility"
              class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
              <font-awesome-icon :icon="['far', showPassword ? 'eye-slash' : 'eye']" class="h-5 w-5" />
            </button>
          </div>
          <p v-if="passwordError" class="text-red-500 text-sm mt-1">
            {{ passwordError }}
          </p>
        </div>

        <!-- Login Button -->
        <button type="submit"
          class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-bold transition duration-200">
          Login
        </button>
      </form>

      <!-- Signup Link -->
      <p class="text-center text-gray-600 mt-4">
        Don't have an account?
        <RouterLink to="/register" class="text-blue-500 font-bold hover:underline">
          Sign up here
        </RouterLink>
      </p>
    </div>
  </DefaultLayout>
</template>
