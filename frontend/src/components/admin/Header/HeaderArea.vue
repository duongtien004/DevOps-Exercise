<script setup>
import { useSidebarStore } from '@/stores/sidebar'
import DarkModeSwitcher from './DarkModeSwitcher.vue'
import DropdownNotification from './DropdownNotification.vue'
import DropdownUser from './DropdownUser.vue'

const { toggleSidebar } = useSidebarStore()
const sidebarStore = useSidebarStore()
</script>

<template>
  <header
    class="sticky top-0 z-50 flex w-full transition-all duration-300
           bg-gradient-to-r from-violet-100 via-purple-100 to-pink-100 
           dark:from-slate-900 dark:via-purple-900 dark:to-slate-900
           shadow-lg backdrop-blur-md"
  >
    <div
      class="flex flex-grow items-center justify-between py-4 px-4 md:px-6 2xl:px-11
             bg-white/30 dark:bg-slate-900/30 backdrop-blur-sm"
    >
      <!-- Left Side -->
      <div class="flex items-center gap-2 sm:gap-4 lg:hidden">
        <!-- Hamburger Toggle Button -->
        <button
          class="z-50 block rounded-xl p-1.5 
                 bg-white/80 hover:bg-white/95
                 dark:bg-slate-800/80 dark:hover:bg-slate-800/95 
                 border border-white/20 hover:border-white/40
                 dark:border-slate-700/50 dark:hover:border-slate-700
                 shadow-sm hover:shadow-md
                 backdrop-blur-lg
                 transition-all duration-300"
          @click="
            () => {
              console.log('Toggling Sidebar')
              toggleSidebar()
            }
          "
        >
          <span class="relative block h-5.5 w-5.5 cursor-pointer">
            <span class="block absolute right-0 h-full w-full">
              <span
                class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-full 
                       bg-violet-600 dark:bg-violet-400
                       delay-[0] duration-200 ease-in-out"
                :class="{ '!w-full delay-300': !sidebarStore.isSidebarOpen }"
              ></span>
              <span
                class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-full 
                       bg-violet-600 dark:bg-violet-400
                       delay-150 duration-200 ease-in-out"
                :class="{ '!w-full delay-400': !sidebarStore.isSidebarOpen }"
              ></span>
              <span
                class="relative top-0 left-0 my-1 block h-0.5 w-0 rounded-full 
                       bg-violet-600 dark:bg-violet-400
                       delay-200 duration-200 ease-in-out"
                :class="{ '!w-full delay-500': !sidebarStore.isSidebarOpen }"
              ></span>
            </span>
            <span class="block absolute right-0 h-full w-full rotate-45">
              <span
                class="absolute left-2.5 top-0 block h-full w-0.5 rounded-full 
                       bg-violet-600 dark:bg-violet-400
                       delay-300 duration-200 ease-in-out"
                :class="{ '!h-0 delay-[0]': !sidebarStore.isSidebarOpen }"
              ></span>
              <span
                class="delay-400 absolute left-0 top-2.5 block h-0.5 w-full rounded-full 
                       bg-violet-600 dark:bg-violet-400
                       duration-200 ease-in-out"
                :class="{ '!h-0 delay-200': !sidebarStore.isSidebarOpen }"
              ></span>
            </span>
          </span>
        </button>

        <!-- Logo -->
        <router-link 
          class="block flex-shrink-0 lg:hidden transition-all duration-300 
                 hover:scale-105 hover:drop-shadow-xl" 
          to="/"
        >
          <img src="@/assets/images/logo/logo-icon.svg" alt="Logo" 
               class="h-8 w-auto drop-shadow-md" />
        </router-link>
      </div>

      <!-- Middle Section -->
      <div class="hidden sm:block"></div>

      <!-- Right Side -->
      <div class="flex items-center gap-3 2xsm:gap-7">
        <ul class="flex items-center gap-2 2xsm:gap-4">
          <li class="hover:scale-105 transition-transform duration-300">
            <!-- Dark Mode Toggler -->
            <div class="bg-white/50 dark:bg-slate-800/50 rounded-lg p-1 backdrop-blur-sm
                        hover:bg-white/70 dark:hover:bg-slate-800/70
                        transition-all duration-300">
              <DarkModeSwitcher />
            </div>
          </li>
        </ul>

        <!-- User Area -->
        <div class="hover:scale-105 transition-all duration-300
                    bg-white/50 dark:bg-slate-800/50 rounded-lg p-1 
                    hover:bg-white/70 dark:hover:bg-slate-800/70
                    backdrop-blur-sm">
          <DropdownUser />
        </div>
      </div>
    </div>
  </header>
</template>