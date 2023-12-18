// Получаем ссылки на элементы DOM
const textArea = document.querySelector('.input-field__text');
const imageInput = document.querySelector('.input-field__file-input');
const memeCanvas = document.querySelector('.field-draw-image__canvas');
const colorPicker = document.querySelector('.input-field__text__set-color-text');
const styleSelect = document.querySelector('.input-field__text__set-style');
const fontSelect = document.querySelector('.input-field__text__set-font');

const ctx = memeCanvas.getContext('2d');

// Константы и переменные для управления состоянием
const MAX_SIZE_IMAGE = 500;
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let textX = 0;
let textY = 0;
let image = null;
// Изначальный размер текста
let textSize = 16;
// Изначальный цвет текста
let textColor = 'black';
// Изначальный стиль текста
let textStyle = 'normal';
// Изначальный шрифт текста
let textFont = 'serif';


// Обработчик загрузки изображения
const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = (e) => {
            image = new Image();
            image.src = e.target.result;

            image.onload = () => {
                resizeImage();
                centerText();
                drawText();
            };
        };

        reader.readAsDataURL(file);
    }
};

// Ограничение размера изображения
const resizeImage = () => {
    if (image.width > MAX_SIZE_IMAGE || image.height > MAX_SIZE_IMAGE) {
        image.width = image.height = MAX_SIZE_IMAGE;
    }

    [memeCanvas.width, memeCanvas.height] = [image.width, image.height];
};

// Изначальное позиционирование текста по центру холста
const centerText = () => {
    [textX, textY] = [memeCanvas.width / 2, memeCanvas.height / 2];
};

// Отрисовка текста
const drawText = () => {
    ctx.clearRect(0, 0, memeCanvas.width, memeCanvas.height); // Очистка холста
    ctx.drawImage(image, 0, 0, memeCanvas.width, memeCanvas.height); // Отрисовка холста
    ctx.font = `${textStyle} ${textSize}px ${textFont}`;// Устанавливает размер текста/стиль/шрифт
    ctx.fillStyle = textColor; // Устанавливает цвет текста
    ctx.fillText(textArea.value, textX, textY); // Заполняет текстом
};

// Обработка ввода текста
const handleInput = () => {
    centerText();
    drawText();
};

// Обработчик нажатия мыши для перемещения текста
const handleMouseDown = (e) => {
    isDragging = true;
    [dragStartX, dragStartY] = [e.clientX, e.clientY];
};

// Обработчик отпускания кнопки мыши
const handleMouseUp = () => {
    isDragging = false;
};

// Обработчик движения мыши для перемещения текста
const handleMouseMove = (e) => {
    if (isDragging) {
        const deltaX = e.clientX - dragStartX;
        const deltaY = e.clientY - dragStartY;

        [textX, textY] = [textX + deltaX, textY + deltaY];

        drawText();

        [dragStartX, dragStartY] = [e.clientX, e.clientY];
    }
};

// Функция обработки события прокрутки колеса мыши
const handleWheel = (e) => {
    e.preventDefault();

    // Сохраняем текущий размер текста
    const currentTextSize = textSize;

    // Изменение размера текста в зависимости от направления прокрутки
    const delta = e.deltaY > 0 ? -1 : 1;

    // Увеличение или уменьшение размера шрифта
    const fontSizeChange = 2;

    // Увеличиваем или уменьшаем размер шрифта текста
    textSize = currentTextSize + delta * fontSizeChange;

    // Перерисовываем текст
    drawText();
}

// Обработчик изменения цвета
const handleColorChange = () => {
    // Обновляем цвет текста
    textColor = colorPicker.value;
    // Перерисовываем текст
    drawText();
}

// Обработчик изменения стиля текста
const handleStyleChange = () => {
    // Сохраняем текущий размер текста
    const currentTextSize = textSize;

    // Устанавливаем новый стиль текста
    textStyle = styleSelect.value;

    // Восстанавливаем размер текста после изменения стиля
    textSize = currentTextSize;

    // Перерисовываем текст
    drawText();
};

// Обработчик изменения шрифта текста
const handleFontChange = () => {
    textFont = fontSelect.value;
    drawText();
};

// Сохранение мема
const saveMeme = () => {
    const imageDataUrl = memeCanvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = imageDataUrl;
    link.download = 'meme.png';
    link.click();
};

// Настройка обработчиков событий
imageInput.addEventListener('change', handleImageUpload);
textArea.addEventListener('input', handleInput);

memeCanvas.addEventListener('mousedown', (e) => handleMouseDown(e));
textArea.addEventListener('mousedown', (e) => handleMouseDown(e));

document.addEventListener('mouseup', handleMouseUp);
document.addEventListener('mousemove', (e) => handleMouseMove(e));

// Обработчик колеса мыши для изменения размера текста
memeCanvas.addEventListener('wheel', handleWheel);

// Обработчик для выбора цвета текста
colorPicker.addEventListener('input', handleColorChange);

// Добавляем обработчики для изменения стиля текста и шрифта
styleSelect.addEventListener('change', handleStyleChange);
fontSelect.addEventListener('change', handleFontChange);

