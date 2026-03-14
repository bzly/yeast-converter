function yeastCalc(amount, fromUnit, fromType, toUnit = "grams", toType = fromType) {
	const factors = {
		instant: {
			ratio: 1,
			units: {
				grams: 	1,
				tsp: 	3.1,
				tbsp: 	9.3,
				cups: 	149
			}
		},
		fresh: {
			ratio: 3,
			units: {
				grams: 	1,
				tsp:	7,
				tbsp:	21,
				cups:	336
			}
		},
		active_dry: {
			ratio: 1.33,
			units: {
				grams: 	1,
				tsp:	3.1,
				tbsp:	9.3,
				cups:	149
			}
		}
	}
	
	if (typeof amount === 'number' && amount > 0 && fromType in factors && toType in factors) {
		let val = amount
		val = val*factors[toType].ratio/factors[fromType].ratio
		if ((fromUnit in factors[fromType]["units"] || fromUnit === "oz") && 
			(toUnit in factors[toType]["units"] || toUnit === "oz")) {
				val = val*factors[fromType]["units"][fromUnit]/factors[toType]["units"][toUnit]
			}
		return val
	}
}

function displayNumber(num) {
	if (typeof num === 'number') {
		const lang = window.navigator.userLanguage || window.navigator.language
		let txt = num.toString()
		
		if (num > 9999) {
			// panic about K/M/G suffixes
			// or just return in scientific notation
			// probably nobody gets here anyway
			return num.toPrecision(2)
		} else if (num <= 9999 && Number.isInteger(num)) {
			return num
		} else {
			return Number(num.toPrecision(4)).toLocaleString(lang)
		}
	} else if (typeof num === 'undefined') {return '⏳'}
}

function yeastConverter() {
	const sel = document.querySelectorAll('.selected')
	let s = {}
	
	sel.forEach(e => {
		s[e.parentNode.getAttribute('class')] = e.innerHTML.replace(" ","_")
		//e.removeAttribute('class')
	})
	s["amount"] = document.getElementsByTagName('input')[0].valueAsNumber
	
	const num = yeastCalc(s.amount, s.fromUnit, s.fromType, s.toUnit, s.toType)
	const outNum = displayNumber(num)
	
	document.getElementsByTagName('output')[0].value = outNum
}

function updater(e) {
	if (e.tagName === 'BUTTON' && e.getAttribute('class') !== 'selected') {
		const choice = e.parentNode.getAttribute('class')
		document.querySelector('.'+choice+' > .selected').removeAttribute('class')
		e.setAttribute('class','selected')
		yeastConverter()
	} else if (e.tagName === 'INPUT') {
		yeastConverter()
	}
}

document.querySelectorAll('button').forEach(e => e.setAttribute('onclick','updater(this)'))
yeastConverter()