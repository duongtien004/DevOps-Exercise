<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { Form, Field, ErrorMessage } from "vee-validate";
import * as yup from "yup";
import DefaultLayout from "@/layouts/user/DefaultLayout.vue";
import oauthServices from "@/services/oauthServices";
import { RouterLink } from "vue-router";
import Toast from "@/components/Toast.vue";
import { useToastStore } from "@/stores/toast";


const router = useRouter();
const showPassword = ref(false);
const formError = ref("");
const toastStore = useToastStore();

// Define validation schema using yup
const schema = yup.object({
    name: yup
        .string()
        .required("Full name is required")
        .min(2, "Name must be at least 2 characters long"),
    email: yup
        .string()
        .required("Email is required")
        .email("Please enter a valid email address"),
    password: yup
        .string()
        .required("Password is required")
        .min(6, "Password must be at least 6 characters")
        .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
        .matches(/[a-z]/, "Password must contain at least one lowercase letter")
        .matches(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: yup
        .string()
        .required("Please confirm your password")
        .oneOf([yup.ref("password")], "Passwords do not match"),
    acceptTerms: yup
        .boolean()
        .oneOf([true], "You must accept the terms and conditions"),
});

// Password strength checker
const getPasswordStrength = (password) => {
    return {
        hasUpperCase: /[A-Z]/.test(password),
        hasLowerCase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        isLongEnough: password?.length >= 6,
    };
};

// Toggle password visibility
const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

// Social signup handlers
const handleGoogleSignup = async () => {
    try {
        console.log("Signing up with Google");
    } catch (error) {
        formError.value = "Google signup failed. Please try again.";
    }
};

const handleFacebookSignup = async () => {
    try {
        console.log("Signing up with Facebook");
    } catch (error) {
        formError.value = "Facebook signup failed. Please try again.";
    }
};

const onSubmit = async (values) => {
  try {
    console.log("Signing up with:", values);

    oauthServices
      .signup(values)
      .then((response) => {
        if (response.status === 200) {
          toastStore.showToast(
            5000,
            "The user is registered. Please activate your account by clicking your email link.",
            "bg-emerald-500"
          );
        } else {
          const data = JSON.parse(response.data.message);
          for (const key in data) {
            errors.value.push(data[key][0].message);
          }

          toastStore.showToast(
            5000,   
            "Something went wrong. Please try again",
            "bg-red-300"
          );
        }
      })
      .catch((error) => {
        console.log("error", error);
      });
  } catch (error) {
    formError.value = "Registration failed. Please try again.";
    console.error("Signup error:", error);
  }
};
</script>

<template>
    <DefaultLayout>
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-auto my-10 border">
            <h2 class="text-2xl font-bold mb-6 text-center">Sign Up</h2>

            <!-- Form Error Alert -->
            <div v-if="formError" class="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {{ formError }}
            </div>

            <Form @submit="onSubmit" :validation-schema="schema" v-slot="{ meta }">
                <!-- Full Name -->
                <div class="mb-4">
                    <label for="name" class="block text-gray-700 font-bold mb-2">Full Name</label>
                    <Field name="name" type="text" id="name"
                        class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name" />
                    <ErrorMessage name="name" class="text-red-500 text-sm mt-1" />
                </div>
                <!-- Email -->
                <div class="mb-4">
                    <label for="email" class="block text-gray-700 font-bold mb-2">Email</label>
                    <Field name="email" type="email" id="email"
                        class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your email" />
                    <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
                </div>
                <!-- phone -->
                <div class="mb-4">
                    <label for="phone" class="block text-gray-700 font-bold mb-2">Phone</label>
                    <Field name="phone" type="name" id="phone"
                        class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your phone" />
                    <ErrorMessage name="email" class="text-red-500 text-sm mt-1" />
                </div>
                <!-- Password -->
                <div class="mb-4">
                    <label for="password" class="block text-gray-700 font-bold mb-2">Password</label>
                    <div class="relative">
                        <Field v-slot="{ field, meta }" name="password">
                            <div class="relative">
                                <input :type="showPassword ? 'text' : 'password'" id="password" v-bind="field"
                                    class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Create a password" />
                                <!-- Password Strength Indicators -->
                                <div v-if="meta.touched && field.value" class="mt-2 space-y-1">
                                    <div class="flex items-center gap-2">
                                        <font-awesome-icon :icon="[
                                            'fas',
                                            getPasswordStrength(field.value).isLongEnough
                                                ? 'check'
                                                : 'times',
                                        ]" class="w-4" :class="getPasswordStrength(field.value).isLongEnough
                                            ? 'text-green-500'
                                            : 'text-gray-400'
                                            " />
                                        <span class="text-sm text-gray-600">At least 6 characters</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <font-awesome-icon :icon="[
                                            'fas',
                                            getPasswordStrength(field.value).hasUpperCase
                                                ? 'check'
                                                : 'times',
                                        ]" class="w-4" :class="getPasswordStrength(field.value).hasUpperCase
                                            ? 'text-green-500'
                                            : 'text-gray-400'
                                            " />
                                        <span class="text-sm text-gray-600">One uppercase letter</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <font-awesome-icon :icon="[
                                            'fas',
                                            getPasswordStrength(field.value).hasLowerCase
                                                ? 'check'
                                                : 'times',
                                        ]" class="w-4" :class="getPasswordStrength(field.value).hasLowerCase
                                            ? 'text-green-500'
                                            : 'text-gray-400'
                                            " />
                                        <span class="text-sm text-gray-600">One lowercase letter</span>
                                    </div>
                                    <div class="flex items-center gap-2">
                                        <font-awesome-icon :icon="[
                                            'fas',
                                            getPasswordStrength(field.value).hasNumber
                                                ? 'check'
                                                : 'times',
                                        ]" class="w-4" :class="getPasswordStrength(field.value).hasNumber
                                            ? 'text-green-500'
                                            : 'text-gray-400'
                                            " />
                                        <span class="text-sm text-gray-600">One number</span>
                                    </div>
                                </div>
                            </div>
                        </Field>
                        <button type="button" @click="togglePasswordVisibility"
                            class="absolute right-2 top-6 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <font-awesome-icon :icon="['far', showPassword ? 'eye-slash' : 'eye']" class="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <!-- Confirm Password -->
                <div class="mb-6">
                    <label for="confirmPassword" class="block text-gray-700 font-bold mb-2">Confirm Password</label>
                    <div class="relative">
                        <Field name="confirmPassword" :type="showPassword ? 'text' : 'password'" id="confirmPassword"
                            class="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm your password" />
                        <button type="button" @click="togglePasswordVisibility"
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none">
                            <font-awesome-icon :icon="['far', showPassword ? 'eye-slash' : 'eye']" class="h-5 w-5" />
                        </button>
                    </div>
                    <ErrorMessage name="confirmPassword" class="text-red-500 text-sm mt-1" />
                </div>

                <!-- Terms and Conditions -->
                <div class="mb-6">
                    <label class="flex items-center">
                        <Field name="acceptTerms" type="checkbox"
                            class="rounded border-gray-300 text-blue-500 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50" />
                        <span class="ml-2 text-sm text-gray-600">
                            I agree to the
                            <a href="/terms" class="text-blue-500 hover:underline">Terms and Conditions</a>
                            and
                            <a href="/privacy" class="text-blue-500 hover:underline">Privacy Policy</a>
                        </span>
                    </label>
                    <ErrorMessage name="acceptTerms" class="text-red-500 text-sm mt-1" />
                </div>

                <!-- Signup Button -->
                <button type="submit" :disabled="!meta.valid"
                    class="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 font-bold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
                    Sign Up
                </button>
            </Form>
            <Toast />

            <!-- Login Link -->
            <p class="text-center text-gray-600 mt-4">
                Already have an account?
                <RouterLink to="/login" class="text-blue-500 font-bold hover:underline">
                    Log in here
                </RouterLink>
            </p>
        </div>
    </DefaultLayout>
</template>
