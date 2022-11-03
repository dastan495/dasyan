const API = "http://localhost:8001/products";

let namee = document.querySelector("#namee");
let first = document.querySelector("#first");
let number = document.querySelector("#number");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");

let list = document.querySelector("#products-list");

// ? переменные для инпутов редактирование товаров
let editName = document.querySelector("#edit-name");
let editFirst = document.querySelector("#edit-first");
let editNumber = document.querySelector("#edit-number");
let editImage = document.querySelector("#edit-image");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");

console.log(
  editName,
  editFirst,
  editNumber,
  editImage,
  editSaveBtn,
  exampleModal
);

btnAdd.addEventListener("click", async function () {
  let obj = {
    namee: namee.value,
    first: first.value,
    number: number.value,
    image: image.value,
  };

  if (
    !obj.namee.trim() ||
    !obj.first.trim() ||
    !obj.number.trim() ||
    !obj.image.trim()
  ) {
    alert("enter");
    return;
  }
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset = utf-8",
    },
    body: JSON.stringify(obj),
  });
  namee.value = "";
  first.value = "";
  number.value = "";
  image.value = "";
  render();
});

// ! отоброжение контактов
async function render() {
  let products = await fetch(API)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  list.innerHTML = "";
  products.forEach((element) => {
    let newElem = document.createElement("div");
    newElem.id = element.id;

    newElem.innerHTML = `<div class="card" style="width: 18rem;">
    <img src="${element.image}" class="card-img-top" alt="">
    <div class="card-body">
      <h5 class="card-title">${element.namee} ${element.first}</h5>
      <p class="card-text">${element.number}</p>
      <a href="#" id = ${element.id} onclick = 'deleteProduct(${element.id})' class="btn btn-primary">delete</a>
      <a href="#" id = ${element.id}  data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-primary btn-edit">Edit</a>

    </div>
  </div>`;

    list.append(newElem);
  });
}
render();

// ! удаление
function deleteProduct(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE",
  }).then(() => render());
}

// ! редактирование

document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editName.value = data.namee;
        editFirst.value = data.first;
        editNumber.value = data.number;
        editImage.value = data.image;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

editSaveBtn.addEventListener("click", function () {
  let id = this.id;

  let name = editName.value;
  let first = editFirst.value;
  let number = editNumber.value;
  let image = editImage.value;

  if (!name || !first || !number || !image) return;

  let editeProduct = {
    name: name,
    first: first,
    number: number,
    image: image,
  };
  console.log("dsfjkl");
  saveEdit(editeProduct, id);
});

function saveEdit(editeProduct, id) {
  console.log(id, editeProduct);
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editeProduct),
  }).then(() => {
    render();
  });

  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}
