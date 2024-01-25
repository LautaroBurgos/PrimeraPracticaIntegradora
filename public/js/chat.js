const socket = io();

let correoDelUsuario;

Swal.fire({
    title: "Ingrese su email",
    input: "text",
    inputValidator: (value) => {
        if (!value) {
            return "Tienes que ingresar tu email";
        } else if (!isValidEmail(value)) {
            return "Ingresa un email válido";
        }
    }
  }).then(data => {
    correoDelUsuario = data.value;
    socket.emit("newUser", correoDelUsuario)
  });

  function isValidEmail(email) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailOk.test(email);
}

  const inputData = document.getElementById("inputData");
  const outPutData = document.getElementById("outPutData");

  inputData.addEventListener("keyup", (event) => {
    if(event.key === "Enter"){
        if(inputData.value.trim().length > 0){
            socket.emit("message", {user: correoDelUsuario, data: inputData.value});
        }
    }
  });

  socket.on("messageLogs", data => {
    let messages = "";
    data.forEach(message => {
        messages+=`<span style="color: blue;">${message.user}</span> dice: ${message.data} <br />`
    });
    outPutData.innerHTML = messages;
  });

  socket.on("newConnection", data => {
    console.log(data)
  });

  socket.on("notification", user => {
    Swal.fire({
        text: `${user} se conecto!`,
        toast: true,
        position:"top-right"
    })
  })

