let DOM = (function () {
	let perButtons = document.querySelectorAll(".perButton");
    let tipAmount = document.getElementById("tipAmount");
    let totalAmount = document.getElementById("totalAmount");
    let resetBut = document.querySelector(".resetButton")

    //Add Selector(class/ID) and selector name, className to add.
	let addClass = function (selector, selectorName, className) {

		if (selector === "id") {
			selector = "#";
		} else if (selector === "class") {
			selector = ".";
		} else {
			return;
		}

		let element = document.querySelector(`${selector}${selectorName}`);
		element.classList.add(className);
	};

    //Remove a class from an element. Requires the element and the class name you wish to remove.
	let removeClass = function (element, classToRemove) {
		element.classList.remove(classToRemove);
	};

    //Function that removes the selected button class from the buttons.
    let removePerButtonClass = function(){
        perButtons.forEach(function (button) {
            removeClass(button, "perButtonSelected");
        });
    }

    let updateOutPut = function(output, update){

        if(output === "tip"){
            output = tipAmount
        } else if (output === "total") {
            output = totalAmount
        }

        output.innerHTML = "$" + update    
    }

    let getInput = function(){
        let bill = Number(document.getElementById("inputBill").value)
        let people = Number(document.getElementById("inputPeople").value)
        let custom = Number(document.getElementById("inputCustom").value)
        return {bill, people, custom}
    }

    let resetDom = function(){
        tipAmount.innerHTML = `$0.00`
        totalAmount.innerHTML = `$0.00`
    }

    let resetInput = function(){
        document.getElementById("inputBill").value = ""
        document.getElementById("inputPeople").value = ""
        document.getElementById("inputCustom").value = ""
    }

    let resetButton = () => resetBut

	return { perButtons, addClass, updateOutPut, removeClass, removePerButtonClass, getInput, resetButton, resetDom, resetInput };
})();

let formula = (function () {

	let tipPer = null;
    let bill = null;
    let numberOfPeople = null;

    let tipAmount = 0.00
    let totalAmount = 0.00

	let updateTip = function(newTip) {
        if(newTip != "utCustom"){

            //If the value coming in is a number it sets the tip per value to that number (this happens if a button is pressed.)
            tipPer = newTip
            return

        } else {

            //Sets the tip percent to the custom value.
            tipPer = DOM.getInput().custom
            //If the field is empty (back to 0) it resets the tip.
            if(tipPer === 0){
                tipPer = null
            }

        };
    }

    let updateValues = function() {

        bill = DOM.getInput().bill
        numberOfPeople = DOM.getInput().people

        //Checks to make sure everything has been filled in before updating.
        if(checkFields()){
            DOM.resetDom();
            return
        };


        updateAmounts();


        //Updates the DOM with the value stored in the total amount and tip amount variables.
        DOM.updateOutPut("tip", tipAmount.toFixed(2));
        DOM.updateOutPut("total", totalAmount.toFixed(2));

    }

    let updateAmounts = function(){
        let totalTip = (bill/100) * tipPer

        totalAmount = (bill + totalTip)/numberOfPeople
        tipAmount = totalTip/numberOfPeople
    }

    //Checks for empty fields and returns true if there is one.
    let checkFields = function(){
        if(tipPer === null){
            return true
        }else if (DOM.getInput().bill === 0){
            return true
        } else if (DOM.getInput().people === 0){
            return true
        } 

        return false
    }

    let checkValues = function(){
        return {tipPer, bill, numberOfPeople}
    }

    let resetValues = function(){
        tipPer = null
        bill = null
        numberOfPeople = null
    }

    return { updateTip, updateValues, checkValues, resetValues }
})();


(function () {

	//When any of the % buttons are pressed.
	DOM.perButtons.forEach((button) => button.addEventListener("click", function (e) {

        //Removes the class from the buttons.
        DOM.removePerButtonClass();
        //Adds a class to the button that was last pressed.
        DOM.addClass("id", e.target.id, "perButtonSelected", "yes");
        //Updates the tip amount inside the formula function to the last pressed..
        formula.updateTip(e.target.id.slice(3));

        //Updating outputs.
        formula.updateValues();

        })
    );

    //Keyup to get value after keypress has ended.
	window.addEventListener("keyup", function () {        
        //Updating the tip everytime a key is pressed inside of the custom field.
        if(document.activeElement.id === "inputCustom"){
            formula.updateTip(document.activeElement.id.slice(3));
        }
        //Updating the overall value when a key is pressed.
        formula.updateValues();

    });


    DOM.resetButton().addEventListener('click', function(){
        formula.resetValues();
        DOM.resetDom();
        DOM.resetInput();
        DOM.removePerButtonClass();
    })

})();

