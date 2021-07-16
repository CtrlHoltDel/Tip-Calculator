let DOM = (function () {
	let perButtons = document.querySelectorAll(".perButton");
    let tipAmount = document.getElementById("tipAmount");
    let totalAmount = document.getElementById("totalAmount");
    let resetBut = document.querySelector(".resetButton");
    let peopleWarning = document.getElementById("inputPeople")

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
        if(element === "warning"){
            element = peopleWarning
        }
		element.classList.remove(classToRemove);
	};

    //Function that removes the selected button class from the buttons.
    let removePerButtonClass = function(){
        perButtons.forEach(function (button) {
            removeClass(button, "perButtonSelected");
        });
    }

    //Updates the output in the DOM. Can either be the tip amount or total amount.
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

    let changeDisplay = function(idName, style){
        let element = document.getElementById(`${idName}`)
        element.style.display = style
    }

    let resetButton = () => resetBut

	return { perButtons, addClass, updateOutPut, removeClass, removePerButtonClass, getInput, resetButton, resetDom, resetInput, changeDisplay };
})();

let formula = (function () {

	let tipPer = null;
    let bill = null;
    let numberOfPeople = null;

    let tipAmount = 0.00
    let totalAmount = 0.00

    //Updates the values within this function as well as updating the DOM.
    let updateValues = function() {

        //Sets the bill to whatever is within the bill DOM input.
        bill = DOM.getInput().bill
        //Sets the number of people to whatever is within the people DOM input.
        numberOfPeople = DOM.getInput().people

        //Checks if a warning is required (if the number of people is === 0)
        formula.checkForWarning();

        //Checks to make sure everything has been filled in before updating, if everything hasn't been filled in it resets the DOM.
        if(checkFields()){
            DOM.resetDom();
            return
        };

        //Everything is filled in so it runs the function which figures out the amounts and updates the variables.
        updateAmounts();

        //Updates the DOM with the value stored in the total amount and tip amount variables. 
        DOM.updateOutPut("tip", tipAmount.toFixed(2));
        DOM.updateOutPut("total", totalAmount.toFixed(2));

    }

    //Updates the tip % variable based upon what button has been pressed(or if a custom input has been inputted.)
	let updateTip = function(newTip) {

        //If the newTip isn't equal to "utCustom" it means a button has been pressed and can set the variable to that specific number.
        if(newTip != "utCustom"){
            tipPer = newTip
            return
        } else {
            //Sets the tip percent to the custom value.
            tipPer = DOM.getInput().custom
        };
    }

    //Updates the tip amount and total amount based upon the inputs.
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

    //Hard reset on the values contained within this function.
    let resetValues = function(){
        tipPer = null
        bill = null
        numberOfPeople = null
    }

    //Checks if a warning is on the "number of people form" is needed and adds classes if it is.
    let checkForWarning = function(){
        //If the bill and tip have information but the people still equals 0, show a warning.
        if(DOM.getInput().bill != 0 && tipPer != null && DOM.getInput().people === 0){
            //Adds a class that changes the border colour
            DOM.addClass("id", "inputPeople", "warning");
            DOM.changeDisplay("warningTestID", "flex")
        }
    }

    return { updateTip, updateValues, resetValues, checkForWarning }
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

        if(document.activeElement.id === "inputPeople"){
            DOM.removeClass("warning", "warning");
            DOM.changeDisplay("warningTestID", "none")
        }

        //Updating the tip everytime a key is pressed inside of the custom field.
        if(document.activeElement.id === "inputCustom"){
            formula.updateTip(document.activeElement.id.slice(3));
        }
        //Updating the overall value when a key is pressed.
        formula.updateValues();

    });

    window.addEventListener('keydown', function(){
        formula.checkForWarning()
    })


    DOM.resetButton().addEventListener('click', function(){
        formula.resetValues();
        DOM.resetDom();
        DOM.resetInput();
        DOM.removePerButtonClass();
    })

})();

