import ApiService from "./ApiService";
import { useAdminStore } from "@/stores/admin";

class ProductServices extends ApiService {
  get entity() {
    return "product";
  }
  async update(data) {
    const adminStore = useAdminStore();

    const { _id } = data;
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("thumbnail", data.thumbnail);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("countInStock", data.countInStock);
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, i) => {
        if (!image.id) {
          formData.append("images", image);
        }
      });
    }
    const option = {
      method: "put",
      url: `/${this.entity}/${_id}/`,
      data: formData,
      headers: {
        "Content-Type": "application/multipart/form-data",
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    };
    return this.request(option);
  }

  async create(data) {
    const adminStore = useAdminStore();
    const formData = new FormData();

    formData.append("name", data.name);
    formData.append("thumbnail", data.thumbnail);
    formData.append("price", data.price);
    formData.append("description", data.description);
    formData.append("category", data.category);
    formData.append("countInStock", data.countInStock);
    if (data.images && data.images.length > 0) {
      data.images.forEach((image, i) => {
        if (!image.id) {
          formData.append("images", image);
        }
      });
    }
    const option = {
      method: "post",
      url: `/${this.entity}/`,
      data: formData,
      headers: {
        "Content-Type": "application/multipart/form-data",
        Authorization: `Bearer ${adminStore.admin.access}`,
      },
    };
    return this.request(option);
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

export default new ProductServices();
