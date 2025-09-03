import { da } from "date-fns/locale";
import ApiService from "./ApiService";
import { useAdminStore } from "@/stores/admin";
import { useUserStore } from "@/stores/user";
import { data } from "autoprefixer";

class OrderServices extends ApiService {
  get entity() {
    return "order";
  }

  async create(data) {
    const adminStore = useAdminStore();
    return this.request({
      method: "post",
      url: `/${this.entity}/`,
      data: data,
      headers: {
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    });
  }

  async gets() {
    const adminStore = useAdminStore();
    console.log(adminStore.admin.access);

    return this.request({
      method: "get",
      url: `/${this.entity}/`,
      headers: {
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    });
  }
  async get(id) {
    const user = useUserStore();

    return this.request({
      method: "get",
      url: `/${this.entity}/${id}/`,
      headers: {
        Authorization: `Bearer ${user.user.access}`,
      },
    });
  }
  async getByUser(params = null) {
    const user = useUserStore();

    return this.request({
      method: "get",
      url: `/${this.entity}/get-by-user/${user.user.id}/`,
      data: user.user.id,
      headers: {
        Authorization: `Bearer ${user.user.access}`,
      },
      params,
    });
  }
  async update(data) {
    // const adminStore = useAdminStore();
    console.log(data.orderStatus);

    return this.request({
      method: "put",
      url: `/${this.entity}/${data._id}/`,
      data: data,
      // headers: {
      //   Authorization: `Bearer ${adminStore.admin.access}`,
      // },
    });
  }

  async delete(id) {
    console.log(id);

    const adminStore = useAdminStore();
    return this.request({
      method: "delete",
      url: `/${this.entity}/${id}/`,
      headers: {
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    });
  }
}

export default new OrderServices();
