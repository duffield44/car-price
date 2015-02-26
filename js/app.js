$(function(){

	var request = {
			fmt: 'json',
			api_key: 'fk5fszh84rrtvy5kz3jj9pey'
		};

	var cars = $.ajax({
			url: "https://api.edmunds.com/api/vehicle/v2/makes",
			data: request,
			dataType: "json",
			type: "GET",
		})
		.done(function(result){
			console.log(result);

			$.each(result.makes, function(i, item){
				$('#make').append('<option value="0">' + item.name + '</option>');	
			});
		});

	
	
});

