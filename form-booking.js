const languages = {
	es: {
		lang: 'es-ES',
		locale: {
			firstDayOfWeek: 1,
			weekdays: {
			shorthand: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
			longhand: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
			},
			months: {
			shorthand: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Оct', 'Nov', 'Dic'],
			longhand: ['Enero', 'Febreo', 'Мarzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
			},
		}
	},
	en: {
		lang: 'en-US',
		locale: {
			firstDayOfWeek: 1,
			weekdays: {
				shorthand: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
				longhand: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
			},
			months: {
			shorthand: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Оct', 'Nov', 'Dec'],
			longhand: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
			},
		},
	},
	fr: {
		lang: 'fr-FR',
		locale: {
			firstDayOfWeek: 1,
			weekdays: {
				shorthand: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
				longhand: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
			},
			months: {
			shorthand: ['Jan', 'Fev', 'Mar', 'Avr', 'Mai', 'Jui', 'Jul', 'Aou', 'Sep', 'Оct', 'Nov', 'Dec'],
			longhand: ['Janvier', 'Férvrier', 'Мars', 'Avril', 'Mai', 'Juin', 'Julliet', 'Aoút', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
			},
		},
	},
};

const formContainer = document.getElementById('booking-form-container');
const bookingForm = document.querySelector('.booking-form');
const toggleFormBtn = document.querySelector('.booking-btn--mobile');

const dateWrappers = document.querySelectorAll('.date-wrapper');
const arrivalDate = document.getElementById('arrival-date');
const exitDate = document.getElementById('exit-date');

const promCode = document.querySelector('#prom-code');
const promCodePlaceholder = document.querySelector('.prom-code__placeholder');

const fec_ini = document.getElementById('fecha_inicio').value || 'today';

// Set language
let language = document.documentElement.lang;
language = languages[language];

// Set instance of flatpickr for arrival date
flatpickr(arrivalDate, {
	minDate: fec_ini,
	defaultDate: new Date().fp_incr(1),
	dateFormat: 'd-m-Y',
	locale: language.locale,
	monthSelectorType: 'static'
}).config.onChange.push(function(selectedDates, dateStr, instance) {

	//Update day and month in DOM date elements in arrival and exit date
	setDayAndMonth(
		instance.element.parentElement,
		new Date(selectedDates)
	);
	setDayAndMonth(
		instance.element.parentElement.nextElementSibling,
		new Date(selectedDates).fp_incr(1)
	);

	flatpickr(exitDate, {
		minDate: new Date(selectedDates).fp_incr(1),
		defaultDate: new Date(selectedDates).fp_incr(1),
		dateFormat: 'd-m-Y',
		locale: language.locale
	}).config.onChange.push(function(selectedDates, dateStr, instance) {
		setDayAndMonth(instance.element.parentElement, new Date(selectedDates));
	});

});

// Set instance of flatpickr for exit date
flatpickr(exitDate, {
	minDate: new Date().fp_incr(1),
	defaultDate: new Date().fp_incr(2),
	dateFormat: 'd-m-Y',
	locale: language.locale
}).config.onChange.push(function(selectedDates, dateStr, instance) {
	setDayAndMonth(instance.element.parentElement, new Date(selectedDates));
});

function toggleSelectDropdown(el) {
	const selectGroup = el.closest('.select-group');
	selectGroup.querySelector('.select-dropdown').classList.toggle('show');
}

function setChoosenSelect(el) {
	const selectGroup = el.closest('.select-group');
	selectGroup.querySelector('.select-label').innerHTML = el.innerHTML;
	toggleSelectDropdown(el);
}

const setDayAndMonth = (el, date) => {
	el.querySelector('.date-wrapper__day').innerHTML = date.getDate();
	el.querySelector('.date-wrapper__month').innerHTML = date.toLocaleString(language.lang, { month: 'long' });
}

//Set day and mont in DOM date elements
setDayAndMonth(arrivalDate.parentElement, new Date().fp_incr(1))
setDayAndMonth(exitDate.parentElement, new Date().fp_incr(2))

// Form Events Delegations
bookingForm.addEventListener('click', (e) => {
	//Click on date picker
	if(e.target.classList.contains('date-wrapper')) {
		e.target.querySelector('.date-wrapper__input')?.click();
	}
	//Click on select input
	if(e.target.classList.contains('select-group')) {
		toggleSelectDropdown(e.target);
	}
	//Click on select option
	if(e.target.classList.contains('select-item')) {
		setChoosenSelect(e.target);
	}
})

// Show/hide prom code placeholder
promCode.addEventListener('focus', () => {
	promCodePlaceholder.classList.add('hide');
});

promCode.addEventListener('focusout', () => {
	if(promCode.value) return;
	promCodePlaceholder.classList.remove('hide');
});

// close the custom select when clicking outside.
document.addEventListener("click", (e) => {
  const didClickedOutside = !e.target.classList.contains('select-item') &&
  							!e.target.classList.contains('select-group');

  if (didClickedOutside) {
	document.querySelectorAll('.select-dropdown').forEach( dropdown => {
		dropdown.classList.remove('show');
	})
  }
});

// Toggle form in mobiles
toggleFormBtn.addEventListener('click', (e) => {
	formContainer.classList.toggle('show');
});

// Set position of form in home page
const setFormTop = () => {
// 	const bgHeaderImageHeight =  document.querySelector('.wpb_row');
// 	const bgHeaderstyle = getComputedStyle(bgHeaderImageHeight);
// 	const height = bgHeaderstyle.height.match(/\d+/g).map(Number)[0];
// //  	formContainer.style.top = (height + height * 0.1816 ) *  0.9166 + 'px';
// 	formContainer.style.top = window.innerWidth *  0.38194 + 'px';
// // 	console.log(bgHeaderImageHeight.offsetHeight, formContainer.style.top);
	console.log('The top issue')
}

/**
	Check if scroll is not at he top remove'in home' class
*/
if(formContainer.classList.contains('in-home')) {
	setFormTop();
	window.addEventListener('resize', setFormTop);
	window.addEventListener('scroll',(e) => {
		if(scrollY > 100 && formContainer.classList.contains('in-home')) {
			formContainer.classList.remove('in-home');
			formContainer.classList.add('not-in-top');
		}

		if(scrollY === 0 && !formContainer.classList.contains('in-home')) {
			formContainer.classList.add('in-home');
			formContainer.classList.remove('not-in-top');
		}
	});

}

if(
	!formContainer.classList.contains('in-home') &&
	window.innerWidth >= 1148
)
{
	window.addEventListener('scroll',(e) => {
		if(scrollY > 0) {
			formContainer.classList.add('not-in-top');
		}else {
			formContainer.classList.remove('not-in-top');
		}
	});
}
