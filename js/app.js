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

	var getCarData = function(){
		var cars = JSON.parse(window.localStorage.getItem('cars'));
		return cars;
	}

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

			var carData = JSON.stringify(result);
			window.localStorage.setItem('cars', carData);
		});	

	
	// Select a Make and the corresponding Models will be selected from localStorage
	$('#make').change(function(){

		// Removes previous car models & years if a make had been previously selected 
		$('#model option').slice(1).remove();
		$('#year option').slice(1).remove();
		
		var carMake = makeSelection();		
		var carData = getCarData();
		$.each(carData.makes[carMake].models, function(i, model){
			$('#model').append('<option value="' + i + '">' + model.name + '</option>');
		});
	});

	// Select a Model and the Years for this model will be selected from localStorage
	$('#model').change(function(){

		// Removes previous model years if a year had previously been selected
		$('#year option').slice(1).remove();

		var carMake = makeSelection();
		var carModel = modelSelection();
		var carData = getCarData();
		$.each(carData.makes[carMake].models[carModel].years, function(i, years){
			$('#year').append('<option value="' + i + '">' + years.year + '</option>');
		});
	});

	// Click Go to fetch car styles
	$('#go-button').click(function(){
		var carMake = makeSelection();
		var carModel = modelSelection();
		var carYear = yearSelection();
		var carData = getCarData();
		var make = carData.makes[carMake].niceName;
		var model = carData.makes[carMake].models[carModel].niceName;
		var year = carData.makes[carMake].models[carModel].years[carYear].year;

		// If user doesn't select a make, model or year, an alert will appear
		if (year == "Select Year") {
			// Change to a slideDown alert
			alert("Oops! Please make sure you have selected a Make, Model, and Year for your car so that we can retrieve it's information");
		} 
		else {			
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
			window.localStorage.setItem('styles', carStyles);s
		});
	}
});

