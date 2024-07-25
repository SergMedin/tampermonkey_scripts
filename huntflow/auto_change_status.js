// ==UserScript==
// @name         HuntFlow: Auto Change Stage
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Automatically change stages and select rejection reasons in Huntflow
// @author       Sergo Medin
// @match        *://*.sandbox.huntflow.dev/*
// @match        *://*.avito.huntflow.ru/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/username/repository/branch/filename
// @downloadURL  https://raw.githubusercontent.com/username/repository/branch/filename
// ==/UserScript==

(function() {
    // Включение строгого режима для всего скрипта
    'use strict'; 
    
    // Константы для параметров
    const REJECTION_LABEL = 'Отказ';
    const REJECTION_REASON_LABEL = '1. Авито: по резюме';
    const SAVE_BUTTON_TEXT = 'Сохранить';

    // Функция для создания и вставки кнопки
    function createButton() {
        console.log("HF: Попытка создать кнопку");

        const firstListItem = document.querySelector('li.root--GhuQk');
        console.log("HF: Найден первый элемент списка:", firstListItem);

        if (firstListItem) {
            const button = document.createElement('button');
            button.textContent = 'Проставить все статусы';
            button.style.backgroundColor = '#28a745';
            button.style.color = '#fff';
            button.style.border = 'none';
            button.style.padding = '10px 20px';
            button.style.marginBottom = '10px';
            button.style.cursor = 'pointer';
            button.classList.add('button--Gh4nT', 'button', 'button_green', 'button--ISIoV', 'btn-change-status');

            firstListItem.insertBefore(button, firstListItem.firstChild);
            console.log("HF: Кнопка создана и добавлена в первый элемент списка как первый дочерний элемент");

            button.addEventListener('click', processAllStages);
        } else {
            console.log("HF: Первый элемент списка не найден, кнопка не создана");
        }
    }

    // Функция для создания и отображения баннера завершения
    function showCompletionBanner() {
        const banner = document.createElement('div');
        banner.textContent = 'Простановка статусов завершена';
        banner.style.position = 'fixed';
        banner.style.top = '50px';
        banner.style.right = '20px';
        banner.style.backgroundColor = 'rgba(40, 167, 69, 0.9)';
        banner.style.color = '#fff';
        banner.style.padding = '15px 30px';
        banner.style.borderRadius = '5px';
        banner.style.zIndex = '1000';
        banner.style.transition = 'opacity 2s ease-in-out';
        document.body.appendChild(banner);

        setTimeout(() => {
            banner.style.opacity = '0';
            setTimeout(() => {
                banner.remove();
            }, 2000);
        }, 3000);
    }

    // Функция для клика по меткам с определенным текстом
    function clickLabelWithText(labelText) {
        const labels = document.querySelectorAll('label.itemName--_nDUF');
        console.log("HF: Найдены метки с классом 'itemName--_nDUF':", labels);

        for (let label of labels) {
            if (label.textContent.includes(labelText)) {
                console.log("HF: Клик по метке с текстом:", labelText);
                label.click();
                return true;
            }
        }
        return false;
    }

    // Функция для клика по кнопкам с определенным текстом
    function clickButtonWithText(buttonText) {
        const buttons = document.getElementsByClassName('button--Gh4nT');
        console.log("HF: Найдены кнопки с классом 'button--Gh4nT':", buttons);

        for (let button of buttons) {
            if (button.textContent.includes(buttonText)) {
                console.log("HF: Клик по кнопке с текстом:", buttonText);
                button.click();
                return true;
            }
        }
        return false;
    }

    // Функция для обработки всех кнопок "Сменить этап подбора"
    function processAllStages() {
        console.log("HF: Начало обработки всех этапов");

        const changeStageButtons = document.querySelectorAll('button[data-qa="change_status_button"]');
        console.log("HF: Найдены кнопки смены этапа:", changeStageButtons);

        let index = 0;

        function processNextButton() {
            if (index < changeStageButtons.length) {
                console.log("HF: Обработка кнопки по индексу:", index);
                changeStageButtons[index].click();

                setTimeout(() => {
                    if (clickLabelWithText(REJECTION_LABEL)) {
                        setTimeout(() => {
                            if (clickLabelWithText(REJECTION_REASON_LABEL)) {
                                setTimeout(() => {
                                    if (clickButtonWithText(SAVE_BUTTON_TEXT)) {
                                        index++;
                                        console.log("HF: Переход к следующей кнопке");
                                        setTimeout(processNextButton, 1000); // ждем завершения действия сохранения
                                    }
                                }, 10);
                            }
                        }, 10);
                    }
                }, 10);
            } else {
                // Показываем баннер завершения после обработки всех этапов
                showCompletionBanner();
            }
        }

        processNextButton();
    }

    // Ждем полной загрузки страницы перед созданием кнопки
    window.addEventListener('load', () => {
        console.log("HF: Страница загружена, ждем перед попыткой создания кнопки");
        setTimeout(createButton, 1000); // Ждем 1 секунду перед созданием кнопки
    });
})();
