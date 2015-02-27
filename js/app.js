$(function(){

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

			$.each(result.makes, function(i, make){
				$('#make').append('<option value="' + i + '">' + make.name + '</option>');	
			});		

			var carData = JSON.stringify(result);
			window.localStorage.setItem('cars', carData);
		});	

	
	// Select a Make and the corresponding Models will be selected from localStorage
	$('#make').change(function(){

		// Removes previous car models if a make had been previously selected 
		$('#model option').slice(1).remove();
		
		var makeSelection = $('#make option:selected').val();			
		var carData = JSON.parse(window.localStorage.getItem('cars'));
		$.each(carData.makes[makeSelection].models, function(i, model){
			$('#model').append('<option value="' + i + '">' + model.name + '</option>');
		});
	});
});

