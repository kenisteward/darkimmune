/// <reference path="../../../typings/angularjs/angular.d.ts"/>
angular.module('di', ['ngFileUpload']).controller("diCtrl", function ($scope) {
	$scope.dataFiles = [];

	$scope.$watch('files', function () {
		$scope.upload($scope.files);
	});

	function processImage(image) {
		var canv = document.createElement('canvas');
		var ctx = canv.getContext('2d');
		var r = 0, b = 0, g = 0;
		var avg = [];
		canv.width = image.naturalWidth;
		canv.height = image.naturalHeight;

		ctx.drawImage(image, 0, 0);

		var pixels = ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
		var brightness = 0;

		for (var i = 0; i < (pixels.data.length); i += 4) {
			r = pixels.data[i];
			b = pixels.data[i + 1];
			g = pixels.data[i + 2];

			if (r != 255 || b != 255 || g != 255) {
				avg.push((r + b + g) / 3);
			}
		}

		for (var k = 0; k < avg.length; k++) {
			brightness += avg[k];
		}

		return {'rating': brightness / avg.length, 'pixSpace': avg.length};
	}

	function addToData(e) {
		var img = new Image();

		img.onload = function () {
			$scope.dataFiles.push({
				'name': e.target.file.name,
				'data': e.target.result,
				'progress': 1,
				'size': img.width + " x " + img.height,
				'rating': processImage(img).rating.toPrecision(5),
				'specimenPixelSpace' : processImage(img).pixSpace
			});

			$scope.$apply();
		};

		img.src = e.target.result;
	}

	$scope.upload = function (files) {
        if (files && files.length) {
            for (var i = 0; i < files.length; i++) {
				var reader = new FileReader();
				reader.onloadend = addToData;
				reader.file = files[i];
				reader.readAsDataURL(reader.file);
            }
        }
    };

	$scope.createReport = function () {
		var files = $scope.dataFiles;

		if (files.length > 0) {
			var doc = new jsPDF('p', 'in');
			setupPageTable(doc);
			var ygap = .475;

			for (var f = 0; f < files.length; f++) {
				if (f != 0 && f % 21 == 0) {
					doc.addPage();
					setupPageTable(doc);
				}

				doc.text(1.05, 1.35 + (f % 21) * ygap, files[f].name);
				doc.text(5.1, 1.35 + (f % 21) * ygap, files[f].size);
				doc.text(6.70, 1.35 + (f % 21) * ygap, files[f].rating.toString());
			}

			doc.save('test.pdf');
		}
	}

	function setupPageTable(doc) {
		// Empty square
		doc.setLineWidth(.05);
		doc.rect(1, .5, 6.45, 10.45);
		
		doc.text(1.05, .4, "On a scale of 0 (Completely Black) to 255 (Completely White)");
		
		var hgap = 2.12;
		var ygap = .475;
		
		//horizontal lines
		for (var h = 1; h <= 21; h++) {
			doc.line(1, h * ygap + .5, 7.45, h * ygap + .5);
		}	 
			
		//vertical lines
        doc.line(5.00, .5, 5.00, 10.95);
		doc.line(6.61, .5, 6.61, 10.95);


		doc.text(1.05, .9, "Specimen");
		doc.text(5.1, .9, "Width x Height");
		doc.text(6.70, .9, "Rating");
	}
});