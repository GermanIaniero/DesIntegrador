const socket = io();

const formCreate = document.getElementById("realTimeFormCreate");
const formDelete = document.getElementById("realTimeFormDelete");

//Envia el front
formCreate.addEventListener("submit", (e) => {
  e.preventDefault();

  const title = document.querySelector("input[name=title]").value;
  const description = document.querySelector("input[name=description]").value;
  const price = Number(document.querySelector("input[name=price]").value);
  const thumbnail = document.querySelector("input[name=thumbnail]").value;
  const code = document.querySelector("input[name=code]").value;
  const stock = Number(document.querySelector("input[name=stock]").value);
  const category = document.querySelector("input[name=category]").value;

  const product = {
    title,
    description,
    price,
    thumbnail,
    code,
    stock,
    category,
  };

  socket.emit("client:newProduct", product);

  formCreate.reset();
});

//Envia el front
formDelete.addEventListener("submit", (e) => {
  e.preventDefault();

  const id = document.querySelector("input[name=id]").value;

  console.log("mainjs", id);

  socket.emit("client:deleteProduct", id);

  formDelete.reset();
});

//Respuesta del back
socket.on("server:list", (data) => {
  const divList = document.getElementById("list");
  let cards = "";
  data.forEach((content) => {
    cards += `
    <div class="card" style="margin: 10px 100px">
        <img src=${content.thumbnail} width="200px" alt="img - ${content.thumbnail}">
        <div class="card-body">
            <p class="card-title">${content.category} - ${content.title}</p>
            <p class="card-text">${content.description}</p>
            <button type="button" class="btn btn-primary">Info</button>
        </div>
    </div>`;
  });

  divList.innerHTML = cards;
});