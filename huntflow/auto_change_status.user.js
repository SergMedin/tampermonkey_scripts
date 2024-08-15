// ==UserScript==
// @name         HuntFlow: Auto Change Stage
// @namespace    http://tampermonkey.net/
// @version      1.86
// @description  Автоматически отказывает по всем пунктам в Huntflow
// @author       Sergo Medin
// @match        *://*.sandbox.huntflow.dev/*
// @match        *://*.avito.huntflow.ru/*
// @grant        none
// @updateURL    https://raw.githubusercontent.com/SergMedin/tampermonkey_scripts/main/huntflow/auto_change_status.user.js
// @downloadURL  https://raw.githubusercontent.com/SergMedin/tampermonkey_scripts/main/huntflow/auto_change_status.user.js
// ==/UserScript==

(function() {
    'use strict';

    const parametersList = [
        {
            START_BUTTON_LABEL: 'Проставить везде: "по резюме"',
            START_BUTTON_BACKGROUND_COLOR: '#28a745',
            REJECTION_LABEL: 'Отказ',
            REJECTION_REASON_LABEL: '1. Авито: по резюме',
            SAVE_BUTTON_LABEL: 'Сохранить',
            BUTTON_PROCESSING_MODE: 'all'
        },
        {
            START_BUTTON_LABEL: 'Проставить кроме последеней "другая вакансия"',
            START_BUTTON_BACKGROUND_COLOR: '#FFB347',
            REJECTION_LABEL: 'Отказ',
            REJECTION_REASON_LABEL: '1.7 Авито: переведен на другую вакансию',
            SAVE_BUTTON_LABEL: 'Сохранить',
            BUTTON_PROCESSING_MODE: 'allExceptLast'
        }
    ];

    function createButtons() {
        const firstListItem = document.querySelector('li.root--GhuQk');

        if (firstListItem && !document.querySelector('.btn-change-status')) {
            parametersList.forEach(params => {
                const button = document.createElement('button');
                button.textContent = params.START_BUTTON_LABEL;
                button.style.backgroundColor = params.START_BUTTON_BACKGROUND_COLOR;
                button.style.color = '#fff';
                button.style.border = 'none';
                button.style.padding = '10px 20px';
                button.style.marginBottom = '10px';
                button.style.cursor = 'pointer';
                button.classList.add('button--Gh4nT', 'button', 'button_green', 'button--ISIoV', 'btn-change-status');

                firstListItem.insertBefore(button, firstListItem.firstChild);

                button.addEventListener('click', () => processAllStages(params));
            });
        }
    }

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

    function clickLabelWithText(labelText) {
        const labels = document.querySelectorAll('label.itemName--_nDUF');

        for (let label of labels) {
            if (label.textContent.includes(labelText)) {
                label.click();
                return true;
            }
        }
        return false;
    }

    function clickButtonWithText(buttonText) {
        const buttons = document.getElementsByClassName('button--Gh4nT');

        for (let button of buttons) {
            if (button.textContent.includes(buttonText)) {
                button.click();
                return true;
            }
        }
        return false;
    }

    function processAllStages(params) {
        const changeStageButtons = document.querySelectorAll('button[data-qa="change_status_button"]');
        let buttonsToProcess = Array.from(changeStageButtons);

        if (params.BUTTON_PROCESSING_MODE === 'allExceptLast') {
            buttonsToProcess = buttonsToProcess.slice(0, -1);
        }

        let index = 0;

        function processNextButton() {
            if (index < buttonsToProcess.length) {
                buttonsToProcess[index].click();

                setTimeout(() => {
                    if (clickLabelWithText(params.REJECTION_LABEL)) {
                        setTimeout(() => {
                            if (clickLabelWithText(params.REJECTION_REASON_LABEL)) {
                                setTimeout(() => {
                                    if (clickButtonWithText(params.SAVE_BUTTON_LABEL)) {
                                        index++;
                                        setTimeout(processNextButton, 1000);
                                    }
                                }, 10);
                            }
                        }, 10);
                    }
                }, 10);
            } else {
                showCompletionBanner();
            }
        }

        processNextButton();
    }

    const observer = new MutationObserver(() => {
        createButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', () => {
        setTimeout(createButtons, 500);
    });
})();
