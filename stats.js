function quantile(arr, q) {
    const sorted = arr.sort((a, b) => a - b);
    const pos = (sorted.length - 1) * q;
    const base = Math.floor(pos);
    const rest = pos - base;

    if (sorted[base + 1] !== undefined) {
        return Math.floor(sorted[base] + rest * (sorted[base + 1] - sorted[base]));
    } else {
        return Math.floor(sorted[base]);
    }
};

function prepareData(result) {
	return result.data.map(item => {
		item.date = item.timestamp.split('T')[0];

		return item;
	});
}

// рассчитать все метрики за день
function calcMetricsByDate(data, page, date) {
	console.log(`All metrics for ${date}:`);

	let table = {};
	table.connect = addMetricByDate(data, page, 'connect', date);
	table.ttfb = addMetricByDate(data, page, 'ttfb', date);
	table.translate = addMetricByDate(data, page, 'translate', date);
	table.firstInputDelay = addMetricByDate(data, page, 'firstInputDelay', date);

	console.table(table);
};

// показать значение метрики за период
function showMetricByPeriod(data, page, name, startDate, endDate) {
	console.log(`Metric "${name}" for period from ${startDate} till ${endDate}:`);
	let table = {};
	
	table.translate = addMetricByPeriod(data, page, name, startDate, endDate);

	console.table(table);
}

// показать сессии пользователя
function showSession(data, user, date) {
	console.log(`Session information for ${user} on ${date}:`);

	let table = data
		.filter(item => item.date == date && item.additional.user == user && item.requestId)
		.map(item => {return { 
			'date': item.date,
			'sessionId': item.requestId,
			'user': item.additional.user,
			'agent': item.additional.browser,
			'name': item.name,
		}});

	console.table(table);
}

// сравнить метрику в разных срезах
function compareMetricBySlice(slice, data, page, name, date) {
	console.log(`Metric "${name}" on ${date} by slice "${slice}":`);

	let table = {};
	let sliceArray = Object.entries(getSliceForMetric(slice, data));

	sliceArray.map(([slice, data]) => {
		table[slice] = addMetricByDate(data, page, name, date)
	});

	console.table(table);
}

// Вспомогательные функции:
// добавить метрику за выбранный день
function addMetricByDate(data, page, name, date) {
	let sampleData = data
					.filter(item => item.page == page && item.name == name && item.date == date)
					.map(item => item.value);

	let result = {};

	result.hits = sampleData.length;
	result.p25 = quantile(sampleData, 0.25);
	result.p50 = quantile(sampleData, 0.5);
	result.p75 = quantile(sampleData, 0.75);
	result.p95 = quantile(sampleData, 0.95);

	return result;
}

// добавить метрику за выбранный период
function addMetricByPeriod(data, page, name, startDate, endDate) {
	let sampleData = data
					.filter(item => item.page == page && item.name == name && item.date >= startDate && item.date <= endDate)
					.map(item => item.value);

	let result = {};

	result.hits = sampleData.length;
	result.p25 = quantile(sampleData, 0.25);
	result.p50 = quantile(sampleData, 0.5);
	result.p75 = quantile(sampleData, 0.75);
	result.p95 = quantile(sampleData, 0.95);

	return result;
}

// получить срез по метрике
function getSliceForMetric(slice, data) {
	let result = {};

	for (let item of data) {
		let newSlice = item.additional[slice];

		if (Array.isArray(result[newSlice])) {
			result[newSlice].push(item);
		} else {
			result[newSlice] = Array.from(item);
		}
	};

	return result;
}

fetch('https://shri.yandex/hw/stat/data?counterId=E757F704-8BDC-4A53-8B29-004A5B76FAE4')
	.then(res => res.json())
	.then(result => {
		let data = prepareData(result);

		calcMetricsByDate(data, 'send test', '2021-10-28');
		showSession(data, 'Guest', '2021-10-28');
		showMetricByPeriod(data, 'send test', 'translate', '2021-10-28', '2021-10-29');
		compareMetricBySlice('device', data, 'send test', 'ttfb', '2021-10-28');
		compareMetricBySlice('browser', data, 'send test', 'firstInputDelay', '2021-10-28');
	});
