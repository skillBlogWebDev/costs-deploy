import { MutableRefObject } from "react";
import { handleAlertMessage } from "./auth";

export const validateInputs = (
    priceInput: MutableRefObject<HTMLInputElement>,
    textInput: MutableRefObject<HTMLInputElement>,
    dateInput: MutableRefObject<HTMLInputElement>,
) => {
    const priceInputValue = priceInput.current.value;
    const textInputValue = textInput.current.value;
    const dateInputValue = dateInput.current.value;

    const inputs = [
        priceInput.current, 
        textInput.current, 
        dateInput.current
    ]

    const addDangerBorderByCondition = () => 
    inputs.forEach(item => item.value.length
        ? item.classList.remove('border-danger')
        : item.classList.add('border-danger')
    )
        
    if (!priceInputValue || !textInputValue || !dateInputValue) {
        handleAlertMessage({ alertText: 'Заполните все поля!', alertStatus: 'warning' });
        addDangerBorderByCondition();
        return false
    }

    if (isNaN(+priceInputValue)) {
        handleAlertMessage({ alertText: 'Введите число!', alertStatus: 'warning' });
        addDangerBorderByCondition();
        
        priceInput.current.classList.add('border-danger')
        return false
    }

    textInput.current.value = '';
    priceInput.current.value = '';
    dateInput.current.value = '';

    inputs.forEach(item => item.classList.remove('border-danger'))

    return true
}