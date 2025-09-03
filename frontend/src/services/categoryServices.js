import { useAdminStore } from "@/stores/admin";
import ApiService from "./ApiService";

class CategoryServices extends ApiService {
  get entity() {
    return "category";
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
  async update(data) {
    const adminStore = useAdminStore();
    const { _id } = data;
    return this.request({
      method: "put",
      url: `/${this.entity}/${_id}/`,
      data: data,
      headers: {
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    });
  }

  async delete(id) {
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

export default new CategoryServices();
