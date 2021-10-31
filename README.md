# ShRI_performance

## Учебный проект по сбору и анализу пользовательских метрик и метрик производительности

Проект "Путешествие по России" содержит информацию о необычных и интересных местах нашей страны, в которых стоит побывать, а также информацию о фотографах, снимающих Россию, и о том, как добраться из Москвы до Байкала на электричках.

Посмотреть проект и отправку метрик: https://lilylilps.github.io/ShRI_performance/

Метрики: 
+ connect - время соединения;
+ ttfb - время до первого байта;
+ translate - время появления алерта (после нажатия на кнопку EN);
+ firstInputDelay - время от момента, когда пользователь впервые взаимодействует со страницей, до момента, когда браузер может начать обработку событий в ответ на это взаимодействие

Посмотреть метрики: https://lilylilps.github.io/ShRI_performance/stats.html

В консоли браузера отображается:
+ статистика по всем метрикам (в процентилях) за 28.10.2021
+ информация о сессиях пользователя за 28.10.2021
+ статистика по метрике "translate" за период 28-29.10.2021 (в процентилях)
+ статистика по метрике "ttfb" по срезу "device" (в процентилях)
+ статистика по метрике "firstInputDelay" по срезу "browser" (в процентилях)
