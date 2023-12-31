class CepService {
  constructor() {
    this.endpoint = "https://viacep.com.br/ws";
  }

  async buscarCep(cep) {
    try {
      const response = await fetch(`${this.endpoint}/${cep}/json/`);
      console.log("Início da requisição");
      if (response.status === 200) {
        const data = await response.json();
        console.log("Requisição feita com sucesso");
        return data;
      } else {
        console.error({
          Application: "CepService",
          stackTraceError: error,
          date: Date.now(),
          method: "BuscarCep",
          descriptionError: "Cep não foi encontrado",
          code: [50],
        });
        throw new Error("Cep não foi encontrado");
      }
    } catch (error) {
      console.error({
        Application: "CepService",
        stackTraceError: error,
        date: Date.now(),
        method: "BuscarCep",
        descriptionError: "Erro ao buscar o cep",
        code: [51],
      });
      throw new Error("Erro ao buscar o cep");
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const cepInput = document.getElementById("cepInput");
  const buscarCepButton = document.getElementById("buscarCep");
  const resultado = document.querySelector("#resultado tbody");
  const mapa = document.getElementById("mapa");

  const cepService = new CepService();

  buscarCepButton.addEventListener("click", async () => {
    const cep = cepInput.value.trim();
    resultado.innerHTML = "";
    mapa.innerHTML = "";
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.textContent = "";

    try {
      buscarCepButton.classList.add("bg-blue-300", "cursor-not-allowed");
      buscarCepButton.textContent = "Buscando...";

      const data = await cepService.buscarCep(cep);
      const row = resultado.insertRow(0);
      row.insertCell(0).textContent = data.cep;
      row.insertCell(1).textContent = data.logradouro;
      row.insertCell(2).textContent = data.bairro;
      row.insertCell(3).textContent = data.localidade;
      row.insertCell(4).textContent = data.uf;

      const rows = resultado.querySelectorAll("tr");
      rows.forEach((row, index) => {
        row.classList.toggle("bg-gray-100", index % 2 === 0);
        row.classList.toggle("bg-white", index % 2 === 0);
        row.classList.add("py-2");
      });

      buscarCepButton.classList.remove("bg-blue-300", "cursor-not-allowed");
      buscarCepButton.textContent = "Buscar CEP";

      const logradouro = data.cep;

      const mapaIframe = document.createElement("iframe");
      mapaIframe.src = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBbyMEoOrR6XieyaJqMG6_x2rGscnraV7c&zoom=14&q=${encodeURIComponent(
        logradouro
      )}`;
      mapaIframe.width = "100%";
      mapaIframe.heigth = "400";
      mapaIframe.style.border = "0";
      mapa.appendChild(mapaIframe);
      document.getElementById("mapa").appendChild(mapaIframe);
    } catch (error) {
      console.error({
        Application: "CepService",
        stackTraceError: error,
        date: Date.now(),
        method: "BuscarCep",
        descriptionError:
          "Cep não foi encontrado, verifique se o CEP está correto",
        code: [52],
      });
      errorMessageElement.textContent =
        "Cep não foi encontrado, verifique se o CEP está correto";
      throw new Error("Cep não foi encontrado");
    } finally {
      buscarCepButton.classList.remove("bg-blue-300", "cursor-not-allowed");
      buscarCepButton.textContent = "Buscar CEP";
      console.log("Finalizado");
    }
  });
});
