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

	// Identify Car ID when user clicks Go
	$('#go-button').click(function(){
		var carMake = makeSelection();
		var carModel = modelSelection();
		var year = yearSelection();
		var carData = getCarData();

		// If user doesn't select a make, model or year, an alert will appear
		if (year == "Select Year") {
			// Change to a slideDown alert
			alert("Oops! Please make sure you have selected a Make, Model, and Year for your car so that we can retrieve it's information");
		} 
		else {			
			var carId = carData.makes[carMake].models[carModel].years[year].id;
			console.log(carId);
			getCar(carId);
		}	
	});

	var getCar = function(Id){
		
		var request = {
			styleId: Id,
			fmt: 'json',
			comparator: 'simple',
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
		});
	}
});

