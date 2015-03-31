$(function(){

	var makeSelection = function(){
		var select = $('#make option:selected').val();
		return select;
	}

	var modelSelection = function(){
		var select = $('#model option:selected').val();
		return select;
	}		

	var yearSelection = function(){
		var select = $('#year option:selected').val();
		return select;
	}	

	var selectedStyle = function(){
		var style = $('#choose-style option:selected').val();
		return style;
	}
		
	var getCarData = function(){
		var cars = JSON.parse(window.localStorage.getItem('cars'));
		return cars;
	}

	var getStyleData = function(){
		var styles = JSON.parse(window.localStorage.getItem('styles'));
		return styles;
	}

	var showCarStyles = function(){
		var carStyles = getStyleData();
		console.log(carStyles);

		$('#choose-style option').slice(1).remove();
		$('.car-name').slideDown(300);

		$.each(carStyles.styles, function(i, style){
			$('#choose-style').append('<option value="'+i+'">' + style.name + '</option>');
		});
	}

	// Setting height of background img
	var windowHeight = $(window).height();
	$('body').css('min-height', windowHeight);


	var request = {
			fmt: 'json',
			api_key: 'fk5fszh84rrtvy5kz3jj9pey'
		};

	$.ajax({
			url: "https://api.edmunds.com/api/vehicle/v2/makes",
			data: request,
			dataType: "json",
			type: "GET",
		})
		.done(function(result){
			console.log(result);

			$.each(result.makes, function(i, make){
				$('#make').append('<option value="' + i + '">' + make.name + '</option>');	
			});		
			
			// Loading gif fadeout
			$('.gif, .gif-background').fadeOut(300);

			var carData = JSON.stringify(result);
			window.localStorage.setItem('cars', carData);
		});	

	
	// Select a Make and the corresponding Models will be selected from localStorage
	$('#make').change(function(){

		$('.warning').slideUp(200);
		// Removes previous car models & years if a make had been previously selected 
		$('#model option').slice(1).remove();
		$('#year option').slice(1).remove();
		// Hides car-name, car-result & prices divs if user re-selects
		$('.car-name').hide();
		$('.car-result').hide();
		$('.prices').hide();
		// Add Make Name to h2 tag
		var makeText = $('#make option:selected').text();
		$('#make-name').text(makeText);
		
		var carMake = makeSelection();		
		var carData = getCarData();		
		$.each(carData.makes[carMake].models, function(i, model){
			$('#model').append('<option value="' + i + '">' + model.name + '</option>');
		});
	});

	// Select a Model and the Years for this model will be selected from localStorage
	$('#model').change(function(){

		$('.warning').slideUp(200);
		// Removes previous model years if a year had previously been selected
		$('#year option').slice(1).remove();
		// Hides car-name, car-result & prices divs if user re-selects
		$('.car-name').hide();
		$('.car-result').hide();
		$('.prices').hide();
		// Add Model Name to h2 tag	
		var modelText = $('#model option:selected').text();
		$('#model-name').text(modelText);

		var carMake = makeSelection();
		var carModel = modelSelection();
		var carData = getCarData();
		$.each(carData.makes[carMake].models[carModel].years, function(i, years){
			$('#year').append('<option value="' + i + '">' + years.year + '</option>');
		});
	});

	$('#year').change(function(){

		$('.warning').slideUp(200);
		// Hides car-name, car-result & prices divs if user re-selects
		$('.car-name').hide();
		$('.car-result').hide();
		$('.prices').hide();
		//Add Year to h2 tag
		var yearText = $('#year option:selected').text();
		$('#year-name').text(yearText);
	});

	$('#choose-style').change(function(){
		// Add car style to h3 tag
		var styleText = $('#choose-style option:selected').text();
		$('.car-style').text(styleText);
	})

	// Click Go to fetch car styles
	$('#go-button').click(function(){
		var carMake = makeSelection();
		var carModel = modelSelection();
		var carYear = yearSelection();
		// If user doesn't select a make, model or year, an alert will appear
		if (carMake == "Select Make" || carModel == "Select Model" || carYear == "Select Year") {
			$('.warning').slideDown(200);
		} 
		else {			
			var carData = getCarData();
			var make = carData.makes[carMake].niceName;
			var model = carData.makes[carMake].models[carModel].niceName;
			var year = carData.makes[carMake].models[carModel].years[carYear].year;
			getCarStyles(make, model, year);
		}	
	});
		

		

	// Use make, model, and year values to fetch car styles
	var getCarStyles = function(make, model, year){
		
		var request = {
			fmt: 'json',
			api_key: 'fk5fszh84rrtvy5kz3jj9pey'			
		};

		$.ajax({
			url: "https://api.edmunds.com/api/vehicle/v2/"+make+"/"+model+"/"+year+"/styles",
			data: request,
			dataType: "json",
			type: "GET",
		}) 
		.done(function(result){
			console.log(result);
			var carStyles = JSON.stringify(result);
			window.localStorage.setItem('styles', carStyles);
			showCarStyles();
		});
	}

	// Click Start Appraisal
	$('#start-appraise').click(function(){
		var carStyles = getStyleData();
		var style = selectedStyle();
		var styleId = carStyles.styles[style].id;
		console.log(styleId);
		getCarPic(styleId);
	});

	// Performs ajax call to Edmunds API to retrieve the user's selected car image
	var getCarPic = function(Id){

		// Start loading gif
		$('.gif, .gif-background').show();

		var request = {
			styleId: Id,
			fmt: 'json',
			comparator: 'simple' ,			
			api_key: 'fk5fszh84rrtvy5kz3jj9pey'
		};

		$.ajax({
			url: "https://api.edmunds.com/v1/api/vehiclephoto/service/findphotosbystyleid",
			data: request,
			dataType: "json",
			type: "GET",
		})
		.done(function(result){
			console.log(result);
			// Show car img and appraisal details
			var url = result[0].id;
			var imgUrl = url.slice(9);			
			$('#car-image').attr('src', 'http://media.ed.edmunds-media.com' + imgUrl + '_500.jpg');
			$('#car-image').load(function(){
				$('.gif, .gif-background').fadeOut(500);
				$('.car-result').slideDown(500);
				$('html, body').animate({scrollTop: $('#car-image').offset().top }, 1000);			
			});
		});
	}

	// Click Appraise Car to getTmv()
	$('#appraise-car').click(function(){
		var carStyles = getStyleData();
		var style = selectedStyle();
		var id = carStyles.styles[style].id;
		var condition = $('#condition option:selected').val();
		var mileage = $('#mileage').val();
		var zip = $('#zipcode').val();
		console.log(condition);		
		if (condition == "" || mileage == "" || zip == "") {
			$('.details-warning').slideDown(200);
		}
		else {		
			$('.details-warning').delay(300).slideUp(200);	
			getTmv(id, condition, mileage, zip);
		}		
	});

	// Makes Ajax call to Edmunds API for TMV
	var getTmv = function(id, condition, mileage, zip){

		var request = {
			styleid: id,
			condition: condition,
			mileage: mileage,
			zip: zip,
			fmt: 'json',
			api_key: 'fk5fszh84rrtvy5kz3jj9pey'
		}

		$.ajax({
			url: "https://api.edmunds.com/v1/api/tmv/tmvservice/calculateusedtmv",
			data: request,
			dataType: "json",
			type: "GET",
		}) 
		.done(function(result){
			console.log(result);
			// Show prices section and display prices
			$('.trade-in p').text('$' + result.tmv.totalWithOptions.usedTradeIn);
			$('.private p').text('$' + result.tmv.totalWithOptions.usedPrivateParty);
			$('.dealer p').text('$' + result.tmv.totalWithOptions.usedTmvRetail);
			$('.prices').slideDown(500);
			$('html, body').animate({scrollTop: $('.prices').offset().top }, 1000);			
		});
	}

	// Click on info buttons
	$('.car-condition i').click(function(){
		$('.popup').show();
	});

	$('#close-popup').click(function(){
		$('.popup').hide();
	});

	$('.prices h3 i').click(function(){
		$('.prices-popup').show().find('p').text('This price is the Edmunds.com TMV® price. It is Edmunds.com’s determination of the current average base price in the area indicated by the Zipcode provided, unadjusted for color or any options.');
	});

	$('.trade-in i').click(function(){
		$('.prices-popup').show().find('p').text('This is the amount you can expect to receive when you trade in your used car and purchase a new car. The trade-in price is usually credited as a down payment on the new car.');
	});

	$('.private i').click(function(){
		$('.prices-popup').show().find('p').text('This is the amount at which the car is sold to or purchased by a private party, not a car dealer. This amount is usually more than the trade-in price but less than the dealer retail price.');
	});

	$('.dealer i').click(function(){
		$('.prices-popup').show().find('p').text('Dealer Retail is what other customers have paid for similar cars in your area. Dealer retail will usually be higher than private party prices and much higher than trade-in prices.');
	});

	$('#close-prices-popup').click(function(){
		$('.prices-popup').hide();
	});
});

