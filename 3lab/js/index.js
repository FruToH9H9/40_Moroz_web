document.getElementById("startGame").addEventListener("click", () => {
    alert("Добро пожаловать в игру 'Угадай число'!");

    const secretNumber = Math.floor(Math.random() * 100) + 1;
    let attempts = 5;

    while (attempts > 0) {
        let guess = prompt(`Угадайте число от 1 до 100. Осталось попыток: ${attempts}`);

        if (guess === null) {
            alert("Вы вышли из игры.");
            return;
        }

        guess = Number(guess);

        if (isNaN(guess) || guess < 1 || guess > 100) {
            alert("Некорректный ввод! Введите число от 1 до 100.");
            continue;
        }

        if (guess === secretNumber) {
            alert("Поздравляем! Вы угадали число!");
            return;
        } else if (guess > secretNumber) {
            alert("Слишком большое число!");
        } else {
            alert("Слишком маленькое число!");
        }

        attempts--;
    }

    confirm("Вы проиграли! Хотите попробовать снова?") && location.reload();
});
