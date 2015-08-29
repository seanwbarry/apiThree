$(function () {
	$('#searchTerm').submit( function (event){
		//zero out results if previous search has run
		event.preventDefault();
		$('#searchResults').html('');
		//
		var maxPrice = $(this).find("input[name='maxPrice']").val();
		var tags = $(this).find("input[name='tags']").val();

		if (maxPrice.length===0) {
			maxPrice = 9999999999999;
			getThings(maxPrice, tags);	
		} else {
			getThings(maxPrice, tags);	
		}
	});
});

var getThings = function(maxPrice, tags){
	//get the results
	//GET https://openapi.etsy.com/v2/listings/active?api_key={YOUR_API_KEY}
	//GET https://openapi.etsy.com/v2/listings/active?api_key={1iek2r0romzac5e32ycn3o76}
	var request = {
		api_key: '1iek2r0romzac5e32ycn3o76',
		max_price: maxPrice,
		tags: tags
		//,method: 'findAllListingActive'
	};

	var result = $.ajax({
		url: "https://openapi.etsy.com/v2/listings/active.js",
		data: request,
		dataType: "jsonp",
		type: "GET"
	})
	
	.done(function(result){
		$.each(result.results, function(i,item) {
			var request1 = {
				api_key: '1iek2r0romzac5e32ycn3o76',
			}

			var urlKey = "https://openapi.etsy.com/v2/listings/"+item.listing_id+"/images.js";

			var result = $.ajax({
				url: urlKey,
				data: request1,
				dataType: "jsonp",
				type: "GET"
			})

			.done(function(result1){
				var thumbnail = result1.results[0].url_75x75;
				var listing = showThings(item, thumbnail);
				$('#searchResults').append(listing);
			});
		})
	});

	//show the results
};

var showThings = function(listing, thumbnail){
	//format the things
	var result = $('.templates .listing').clone();
	
	console.log(thumbnail);

	var listingElem = result.find('#listing_id');
	listingElem.text(listing.listing_id);
	
	var priceElem = result.find('#price');
	priceElem.text(listing.price);

	var viewsElem = result.find('#views');
	viewsElem.text(listing.views);

	var tagsElem = result.find('#tags');
	tagsElem.text(listing.tags);

	var pictureElem = result.find('#picture');
	pictureElem.html("<img style=height:100px; width:100px; src="+thumbnail+">");

	return result;
};