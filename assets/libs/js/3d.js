// Tạo cảnh
// let lastScreenSizeCategory;

// function checkScreenSizeAndReload() {
//   const width = window.innerWidth;
//   let newScreenSizeCategory;

//   if (width < 739) {
//     newScreenSizeCategory = "small";
//   } else if (width >= 739 && width <= 1023) {
//     newScreenSizeCategory = "medium";
//   } else if (width > 1023) {
//     newScreenSizeCategory = "large";
//   }

//   // Chỉ reload khi chuyển từ một danh mục kích thước khác
//   if (newScreenSizeCategory !== lastScreenSizeCategory) {
//     lastScreenSizeCategory = newScreenSizeCategory;
//     location.reload();
//   }
// }

// window.addEventListener("resize", checkScreenSizeAndReload);

const scene = new THREE.Scene();

// Tạo camera
const camera = new THREE.PerspectiveCamera(
  -1000,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(9, 0, 0);

// Tạo renderer
const renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0xb4d8fa, 0); // Đặt màu nền thành màu xám
// Sử dụng tone mapping để điều chỉnh exposure
//renderer.toneMapping = THREE.ACESFilmicToneMapping; // Chọn tone mapping
//renderer.toneMappingExposure = 1; // Tăng exposure

// Tìm và gắn renderer vào wrapper

let wrapper;
if ($(window).width() < 739) {
  wrapper = document.getElementById("lipsticks-result-mobile");
} else {
  wrapper = document.getElementById("lipsticks-result");
}

// window.addEventListener("load", checkScreenSize);
// window.addEventListener("resize", checkScreenSize);
wrapper.appendChild(renderer.domElement);

// Hàm cập nhật kích thước renderer
function resizeRendererToDisplaySize() {
  const width = wrapper.clientWidth;
  const height = wrapper.clientHeight;
  const needsResize =
    renderer.domElement.width !== width ||
    renderer.domElement.height !== height;
  if (needsResize) {
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
}

// Thêm event listener để cập nhật kích thước khi cửa sổ thay đổi kích thước
window.addEventListener("resize", resizeRendererToDisplaySize);

// Gọi hàm cập nhật kích thước ban đầu
resizeRendererToDisplaySize();
// Thêm OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0); // Đặt mục tiêu của controls vào trung tâm cảnh
controls.update();

// Thêm ánh sáng môi trường: Ambient light to provide overall illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

// Thêm ánh sáng định hướng mặt trước: Front directional light
const frontLight = new THREE.DirectionalLight(0xffffff, 0.5);
frontLight.position.set(1, 1, 1).normalize();
scene.add(frontLight);

// Thêm ánh sáng định hướng mặt sau: Front directional light
const backLight = new THREE.DirectionalLight(0xffffff, 0.5);
backLight.position.set(-1, -1, -1).normalize();
scene.add(backLight);

// Tạo shadow-catching plane
renderer.shadowMap.enabled = true; // Kích hoạt đổ bóng
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Tùy chọn loại đổ bóng
frontLight.castShadow = true; // Kích hoạt đổ bóng cho đèn
backLight.castShadow = true; // Kích hoạt đổ bóng cho đèn
const planeGeometry = new THREE.PlaneGeometry(200, 200);
const planeMaterial = new THREE.ShadowMaterial({ opacity: 0.1 });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = -Math.PI / 2; // Xoay để nằm ngang
plane.position.y = -4; // Đặt dưới model
plane.receiveShadow = true; // Kích hoạt nhận bóng cho plane
scene.add(plane);

// Khai báo các Texture ////////////////////////////////////
const textureLoader = new THREE.TextureLoader();
let Texture_Label;
let Texture_Avatar;
let originalTexture;
let originalLabel;

function Texture_Label_Update(newSrc) {
  const Texture_Label_New = textureLoader.load(newSrc, function (texture) {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.rotation = Math.PI;
    texture.center.set(0.5, 0.5);
    texture.repeat.set(-1, 1);
    originalLabel = "";
    // Update the material's map with the new texture
    if (Texture_Label && Texture_Label.material) {
      Texture_Label.material.map = texture;
      Texture_Label.material.needsUpdate = true;
    }
  });
}

function Texture_Avatar_Update(newSrc) {
  const Texture_Avatar_New = textureLoader.load(newSrc, function (texture) {
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.rotation = Math.PI;
    texture.center.set(0.5, 0.5);
    texture.repeat.set(-1, 1);
    originalTexture = "";
    // Update the material's map with the new texture
    if (Texture_Avatar && Texture_Avatar.material) {
      Texture_Avatar.material.map = texture;
      Texture_Avatar.material.needsUpdate = true;
    }
  });
}

var frontViewCamera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
frontViewCamera.position.set(0, 0, -5); // Position the front view camera
frontViewCamera.lookAt(new THREE.Vector3(0, 0.5, 1));
// Tải và thêm model 3D
const loader = new THREE.GLTFLoader();
let rotate = true; // Biến lưu trạng thái xoay

let progressBar = $(".progress");
let percentageText = $(".percentage");
let postsContainer = $(".posts-container");
let percentage = 0;

function updateProgress(progress) {
  percentage = progress;
  progressBar.css("width", percentage + "%");
  percentageText.text(percentage + "%");
}

// function checkScreenSize() {
//   // Lấy kích thước màn hình hiện tại
//   const width = window.innerWidth;

//   // Lấy phần tử thông báo
//   const messageElement = document.getElementById("message");

//   // Cập nhật nội dung thông báo dựa trên kích thước màn hình
//   if (width <= 768) {
//     // Giả sử kích thước điện thoại là 768px trở xuống
//     messageElement.textContent = "Kích thước màn hình hiện tại: Điện thoại";
//   } else {
//     messageElement.textContent = "Kích thước màn hình hiện tại: Máy tính";
//   }
// }

loader.load(
  "./assets/img/lipstick.glb",
  function (gltf) {
    const model = gltf.scene;

    // Giả sử model của bạn có một mesh với hai materials
    model.traverse(function (child) {
      if (child.isMesh) {
        switch (child.material.name) {
          case "3D_Label":
            Texture_Label = child; // Reference the mesh you want to update
            break;
          case "3D_Avatar":
            Texture_Avatar = child; // Reference the mesh you want to update
            break;
          default: {
            // Tăng cường độ sáng cho vật liệu mặc định
            child.material.emissive = new THREE.Color(0xffffff); // Ánh sáng phát ra màu trắng
            child.material.emissiveIntensity = 0.15; // Đặt cường độ ánh sáng phát ra
            child.material.roughness = 0.2; // Thay đổi độ nhám
            child.material.metalness = 0.2; // Thay đổi độ kim loại
            //child.material.needsUpdate = true;
            //child.castShadow = true; // Kích hoạt đổ bóng cho mesh
            //child.material.receiveShadow = true; // Kích hoạt nhận bóng cho mesh
          }
        }
      }
    });

    // Đặt model ở vị trí (0, 0, 0)
    model.position.set(0, -5, 0);

    // Điều chỉnh xoay của model để hiển thị đúng hướng
    model.rotation.x = Math.PI; // Xoay 180 độ quanh trục X nếu model đang ngược xuống dưới
    // Điều chỉnh thêm nếu cần thiết
    model.rotation.y = Math.PI / 2; // Xoay 90 độ quanh trục Y (nếu cần thiết)
    model.rotation.z = Math.PI; // Xoay 90 độ quanh trục Z (nếu cần thiết)

    scene.add(model);
    animate();

    // Hàm render
    function animate() {
      requestAnimationFrame(animate);
      // Xoay đối tượng cha quanh trục trung tâm
      if (rotate) {
        model.rotation.y += 0.01;
      }
      // Cập nhật kích thước renderer trước khi render
      resizeRendererToDisplaySize();
      renderer.render(scene, camera);
    }

    const maxHistory = 3;
    let resetCount = 0;

    $("#create-lipstick").click(function () {
      Texture_Label_Update($(".image-ai-img").attr("src"));
      Texture_Avatar_Update($(".avatar-ai-img").attr("src"));
      $("#create-lipstick").hide();
      $("#download-lipstick").show();
    });

    $("#download-lipstick").click(function () {
      console.log("download");
      angle = 0; // Reset angle if needed
      model.rotation.y = angle; // Reset rotation

      // Temporarily adjust renderer size for higher resolution capture
      var originalSize = {
        width: renderer.domElement.width,
        height: renderer.domElement.height,
      };
      var captureWidth = window.innerWidth; // Adjust the width as needed
      var captureHeight = window.innerHeight;
      renderer.setSize(captureWidth, captureHeight); // Increase the resolution

      // Render and capture the front view
      renderer.render(scene, frontViewCamera);
      renderer.setClearColor(0x000000, 0); // Ensure background is transparent (alpha: 0)
      // model.scale.set(0.5, 0.5, 0.5);

      // Capture the image from the front view
      $("#lipstick-username").text(localStorage.getItem("userName"));
      $(".section.gameplay .modal-result").css("display", "flex");
      var imgData = renderer.domElement.toDataURL("image/png");
      $("#capturedImage").attr("src", imgData).show();

      // Restore original renderer size
      renderer.setSize(originalSize.width, originalSize.height);
    });

    $("#download-img-mobile").click(function () {
      angle = 0; // Reset angle if needed
      model.rotation.y = angle; // Reset rotation

      // Temporarily adjust renderer size for higher resolution capture
      var originalSize = {
        width: renderer.domElement.width,
        height: renderer.domElement.height,
      };
      var captureWidth = window.innerWidth; // Adjust the width as needed
      var captureHeight = window.innerHeight;
      renderer.setSize(captureWidth, captureHeight); // Increase the resolution

      // Render and capture the front view
      renderer.render(scene, frontViewCamera);
      renderer.setClearColor(0x000000, 0); // Ensure background is transparent (alpha: 0)
      // model.scale.set(0.5, 0.5, 0.5);

      // Capture the image from the front view
      if (!getArrayFromCookies("loginCookies")) {
        $("#lipstick-username").text(" ");
      } else {
        $("#lipstick-username").text(
          getArrayFromCookies("loginCookies").Objects[0].UserId
        );
      }

      $(".section.gameplay .modal-result").css("display", "flex");
      var imgData = renderer.domElement.toDataURL("image/png");
      $("#capturedImage").attr("src", imgData).show();
      //
      // Restore original renderer size
      renderer.setSize(originalSize.width, originalSize.height);
    });

    $("#reset-btn").click(function () {
      if (resetCount < maxHistory) {
        $("#keyword-box").val("");
        $("#result").text("");
        $(".image-ai-img").hide("");
        $(".image-ai-img").attr("src", "");
        $("#croppedImage").attr("src", "");
        $("#uploadImage").val("");
        $("#removeImageButton").hide();
        $("#openModalButton").hide();
        $("#file-name").text("No file chosen");
        $(".avatar-ai-img").css("display", "none");
        $(".avatar-ai-img").attr("src", "");
        $(".file-upload-label").show();
        $("#create-image-ai").attr("disabled", "disabled");
        $("#download-lipstick").hide();
        $("#create-lipstick").show();
        $("#register-form").hide();
        $("#register-overlay .loading-container").hide();
        updateProgress(0);
        localStorage.removeItem("update");
        Texture_Label_Update("./assets/img/original.png");
        Texture_Avatar_Update("./assets/img/original.png");
        resetCount++;
        $("#reset-btn").text(`Hoàn tác (${resetCount}/3)`);
        if (resetCount >= maxHistory) {
          $(this).prop("disabled", true);
          $("#reset-btn").attr("disabled", "disabled");
          $("#reset-btn").attr("noHover");
          $("#create-image-ai").click(function () {
            return false;
          });
        }
      }
    });
  },
  undefined,
  function (error) {
    console.error("An error occurred loading the model:", error);
  }
);

$("#lipsticks-result, #lipsticks-result-mobile").on("mousedown", function () {
  rotate = false;
});

$("#lipsticks-result, #lipsticks-result-mobile").on("mouseup", function () {
  rotate = true;
});

// Texture_Label_Update($("#Label_Img").attr("src"));
//   Cookies Functions --------------------------------
function setArrayToCookies(cookieName, cookieString) {
  const arrayName = cookieName;
  const arrayValues = cookieString;
  const jsonArray = JSON.stringify(arrayValues);
  document.cookie = `${arrayName}=${jsonArray}; path=/`;
}

function getArrayFromCookies(cookieName) {
  const arrayName = cookieName;
  const cookies = document.cookie.split("; ");
  let arrayData = null;
  $.each(cookies, function (_, cookie) {
    const [name, value] = cookie.split("=");
    if (name === arrayName) {
      arrayData = JSON.parse(decodeURIComponent(value));
    }
  });

  const displayDiv = $("#displayArray");
  if (arrayData) {
    return arrayData;
  } else {
    return false;
  }
}
