import { defineStore } from "pinia";
import axios from "axios";

export const useAdminStore = defineStore("admin", {
  persist: {
    enabled: true, // Lưu trạng thái nếu cần
  },
  state: () => ({
    admin: {
      isAuthenticated: false,
      id: null,
      name: null,
      email: null,
      access: null,
      refresh: null,
      avatar: null,
    },
  }),

  actions: {
    initStore() {
      console.log("initStore", localStorage.getItem("admin.access"));

      if (localStorage.getItem("admin.access")) {
        console.log("admin has access!");

        this.admin.access = localStorage.getItem("admin.access");
        this.admin.refresh = localStorage.getItem("admin.refresh");
        this.admin.id = localStorage.getItem("admin.id");
        this.admin.name = localStorage.getItem("admin.name");
        this.admin.email = localStorage.getItem("admin.email");
        this.admin.avatar = localStorage.getItem("admin.avatar");
        // this.admin.isAuthenticated = true;

        // this.refreshToken();

        console.log("Initialized admin:", this.admin);
      }
    },

    setToken(data) {
      console.log("setToken", data);

      this.admin.access = data.access_token;
      this.admin.refresh = data.refresh_token;
      this.admin.isAuthenticated = true;

      localStorage.setItem("admin.access", data.access_token);
      localStorage.setItem("admin.refresh", data.refresh_token);
      localStorage.setItem("admin.isAuthenticated", true);

      console.log("admin.access: ", localStorage.getItem("admin.access"));
    },

    removeToken() {
      console.log("removeToken");

      this.admin.refresh = null;
      this.admin.access = null;
      this.admin.isAuthenticated = false;
      this.admin.id = null;
      this.admin.name = null;
      this.admin.email = null;
      this.admin.avatar = null;

      localStorage.setItem("admin.isAuthenticated", false);
      localStorage.setItem("admin.access", "");
      localStorage.setItem("admin.refresh", "");
      localStorage.setItem("admin.id", "");
      localStorage.setItem("admin.name", "");
      localStorage.setItem("admin.email", "");
      localStorage.setItem("admin.avatar", "");
    },

    setAdminInfo(admin) {
      console.log("setadminInfo", admin._id);

      this.admin.id = admin._id;
      this.admin.name = admin.name;
      this.admin.email = admin.email;
      // this.admin.avatar = admin.avatar;

      localStorage.setItem("admin.id", this.admin.id);
      localStorage.setItem("admin.name", this.admin.name);
      localStorage.setItem("admin.email", this.admin.email);
      // localStorage.setItem("admin.avatar", this.admin.avatar);

      console.log("admin", this.admin);
    },

    refreshToken() {
      axios
        .post("/api/account/refresh/", {
          refresh: this.admin.refresh,
        })
        .then((response) => {
          this.admin.access = response.data.access;

          localStorage.setItem("admin.access", response.data.access);

          axios.defaults.headers.common["Authorization"] =
            "Bearer " + response.data.access;
        })
        .catch((error) => {
          console.log(error);

          this.removeToken();
        });
    },
  },
});
