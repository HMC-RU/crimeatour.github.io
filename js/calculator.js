const generateId = () => `id${Math.round(Math.random()*1e8).toString(16)}`
// Переменные для вывода
const
    personName = document.querySelector('.person-name'), 
    sex = document.querySelector('.sex'),
    equipment = document.querySelector('.equipment'),
    strenght = document.querySelector('.strength'),
    coefficient = document.querySelector('.coefficient'),
    totalWeightNumber = document.querySelector('.total-weight-number'),
    calcUnit = document.querySelector('.calc-unit'),
    result = document.querySelector('.result');

//Переменные для ввода
let weight = document.querySelector('#weight');
const
    calcForm = document.querySelector('#calc-form'),
    nameInp = document.querySelector('#name-inp'),
    sexGroupSelect = document.querySelector('#sexGroupSelect'),
    equipGroupSelect = document.querySelector('#equipGroupSelect'),
    strainghtGroupSelect = document.querySelector('#strainghtGroupSelect');


// Отображение select
const SexValue = () => {
let CurSexValue = sexGroupSelect.value
    if (CurSexValue == 1) {
        strainghtGroupSelect.innerHTML = `
        <option value="0.9" class="select-men">Слабая</option>
        <option value="0.95" class="select-men">Нормальная</option>
        <option value="1" class="select-men">Хорошая</option>
        `
    } else {
        strainghtGroupSelect.innerHTML = `
        <option value="0.75" class="select-men">Слабая</option>
        <option value="0.8" class="select-men">Нормальная</option>
        <option value="0.9" class="select-men">Хорошая</option>
        `
    }
};
SexValue();

// Инпут веса
document.querySelector('#weight').addEventListener('keyup', function(){
    this.value = this.value.replace(/[A-Za-zА-Яа-яЁё]/, '');
});
document.querySelector('#weight').addEventListener('keyup', function(){
    this.value = this.value.replace(/[,]/, '.');
});
document.querySelector('#weight').addEventListener('keydown', function(){
    this.value = this.value.replace(/[A-Za-zА-Яа-яЁё]/, '');
});
// Массив ячейки
let dbOperation = [];

// Вставка новой ячейки
const renderOperation = async (operation) => {
    await WeightCalc()
    const listItem = document.createElement('div');
    listItem.classList.add('person-result');
    listItem.classList.add('row');
    listItem.innerHTML = `
        <div class="col-2 person-name">${operation.name}</div>
        <div class="col-2 sex">${operation.sex}</div>
        <div class="col-2 equipment">${operation.equipment}</div>
        <div class="col-2 strength">${operation.strainght}</div>
        <div class="col-2 coefficient">${operation.coefficient}</div>
        <div class="col-2 total-weight-number column">${operation.weight}
        <div class="delete-btn" data-id="${operation.id}" >
        <svg class="delete-btn" data-id="${operation.id}" width="20" height="20">
                            <use xlink:href="img/icons.svg#cansel"></use>
                        </svg>
        </div>       
        </div>  
    `;
    result.append(listItem)
};

// Заброс значений в массив
const addPerson = async (event) => {
    event.preventDefault();
    const nameInpValue = nameInp.value,
        sexGroupSelectValue = sexGroupSelect.value,
        equipGroupSelectValue = equipGroupSelect.value,
        strainghtGroupSelectValue = strainghtGroupSelect.value;
    nameInp.style.borderColor = '';
    weight.style.borderColor = '';
    if (nameInpValue && weight.value) {
        const coef = sexGroupSelectValue * equipGroupSelectValue * strainghtGroupSelectValue
        
        const calcOperation = {
            id: generateId(),
            name: nameInpValue,
            sex: sexGroupSelectValue,
            strainght: strainghtGroupSelectValue,
            equipment: equipGroupSelectValue,
            coefficient: `${coef.toFixed(2)}`,
            weight: '',
        }
        
    dbOperation.push(calcOperation);      
    
    init();
    } else {
        if (!nameInpValue) nameInp.style.borderColor = 'red';
        if (!weight.value) weight.style.borderColor = 'red';
    };
    nameInp.value = '';
};

//Общий вес
let totalWeight = () => {
    const weightValue = weight.value.replace(/[A-Za-zА-Яа-яЁё]/, '')
    totalWeightNumber.innerHTML =  `${weightValue}`
};

//Суммирорвание коэффициентов
const coef = async function () {
Array.prototype.sum = function (prop) {
    let total = 0
    for ( var i = 0, _len = this.length; i < _len; i++ ) {
        total += +this[i][prop]
    };
    return total
};
return dbOperation.sum("coefficient");
};
//Подсчет веса
const WeightCalc = async () => {
    const curCoef = await coef();
    if (dbOperation.length > 0) {
    dbOperation.forEach(item => {
        const weightValue = weight.value;
        const weightUnit = (+weightValue / +curCoef).toFixed(2);
        item.weight = (+weightUnit * +item.coefficient).toFixed(2);
        });  
};
};
// Обновление веса
const newWeight = (event) => {
    init();
}
//Удаление ячейки
const deleteOperation = (event) => {
    if(event.target.classList.contains('delete-btn')){
        dbOperation = dbOperation
        .filter(operation => operation.id != event.target.dataset.id)
        init();
    }
};

//Перебор массива и вставка ячейки
const init = () => {
    result.textContent = '';
    dbOperation.forEach(renderOperation)
    
};
calcForm.addEventListener('submit', addPerson);
calcForm.addEventListener('submit', WeightCalc);
calcForm.addEventListener('submit', coef);
result.addEventListener('click', deleteOperation);
weight.addEventListener('input', newWeight);
weight.addEventListener('input', totalWeight);
weight.addEventListener('input', WeightCalc);
sexGroupSelect.addEventListener('change', SexValue);
init();
