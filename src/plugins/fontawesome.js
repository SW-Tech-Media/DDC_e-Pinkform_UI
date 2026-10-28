import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

// ลงทะเบียนไอคอน Solid / Regular ทั้งชุด (Prototype) ใช้ผ่าน <v-icon icon="fas fa-xxx" />
library.add(fas, far);

export default {
  install(app) {
    app.component("font-awesome-icon", FontAwesomeIcon);
  },
};
