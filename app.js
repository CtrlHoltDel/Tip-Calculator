let peopleWarning = document.getElementById("inputPeople");

const tipCalculator = () => {
  const tipAmount = document.getElementById("tipAmount");
  const totalAmount = document.getElementById("totalAmount");

  let bill = 0;
  let amountOfPeople = 1;
  let tipPercent = 0;

  const updateAmount = () => {
    const currentTip = (bill * tipPercent) / amountOfPeople;
    const currentBill = bill / amountOfPeople;

    tipAmount.textContent = currentTip.toFixed(2);
    totalAmount.textContent = (currentTip + currentBill).toFixed(2);
  };

  const updateInputs = (type, amount = 0) => {
    if (type === "bill") bill = Number(amount);
    if (type === "amountOfPeople") amountOfPeople = Number(amount);
    if (type === "per") tipPercent = amount / 100;

    updateAmount();
  };

  const resetDOM = () => {
    bill = 0;
    amountOfPeople = 1;
    tipPercent = 0;
    tipAmount.textContent = "0.00";
    totalAmount.textContent = "0.00";
  };

  return { updateInputs, resetDOM };
};

const inputs = () => {
  const bill = document.getElementById("inputBill");
  const amountOfPeople = document.getElementById("inputPeople");
  const reset = document.querySelector(".resetButton");
  const percent = document.querySelectorAll(".perButton");
  const customPercent = document.querySelector(".perCustom");

  const clearStyle = () => {
    percent.forEach((button) => {
      button.classList.remove("perButtonSelected");
    });
  };

  const clearCustom = () => {
    customPercent.value = "";
  };

  bill.addEventListener("keyup", ({ target: { value } }) => {
    if (!value) value = 0;
    updateInputs("bill", value);
  });

  amountOfPeople.addEventListener("keyup", ({ target: { value } }) => {
    if (!value) value = 1;
    updateInputs("amountOfPeople", value);
  });

  customPercent.addEventListener("keyup", ({ target: { value } }) => {
    if (!value) value = 0;
    updateInputs("per", value);
  });

  customPercent.addEventListener("click", () => updateInputs("per", 0));

  percent.forEach((button) => {
    button.addEventListener("click", (e) => {
      clearStyle();
      if (e.target.classList.contains("perCustom")) return;
      clearCustom();
      e.target.classList.add("perButtonSelected");
      updateInputs("per", e.target.id);
    });
  });

  reset.addEventListener("click", () => {
    resetDOM();
    bill.value = "";
    amountOfPeople.value = "";
    customPercent.value = "";
  });
};

const { updateInputs, resetDOM } = tipCalculator();
inputs();
