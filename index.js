const input = document.getElementById("input");
const submit = document.getElementById("submit-btn");

console.log("running");
submit.addEventListener("click", () => {
  console.log(input.value);
  const data = input.value;
  document.getElementById("img").src = data;
  fetch("/", {
    method: "POST",
    body: JSON.stringify({
      data: data,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
    });
});
