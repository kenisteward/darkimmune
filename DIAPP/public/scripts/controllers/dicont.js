/// <reference path="../../../typings/angularjs/angular.d.ts"/>
angular.module('di', ['ngFileUpload']).controller("diCtrl", function ($scope) {
	$scope.dataFiles = [];

	$scope.$watch('files', function () {
		$scope.upload($scope.files);
	});

	function processImage(image) {
		var canv = document.createElement('canvas');
		var ctx = canv.getContext('2d');

		canv.width = image.naturalWidth;
		canv.height = image.naturalHeight;

		ctx.drawImage(image, 0, 0);

		var pixels = ctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);
		var brightness = 0;

		for (var i = 0; i < (pixels.data.length); i += 4) {
			var avg = (pixels.data[i] + pixels.data[i + 1] + pixels.data[i + 2]) / 3;

			if (avg != 255)
				brightness = (brightness + avg) / 2;
		}

		return brightness;
	}

	function addToData(e) {
		var img = new Image();

		img.onload = function () {
			$scope.dataFiles.push({
				'name': e.target.file.name,
				'data': e.target.result,
				'progress': 1,
				'size': img.width + " x " + img.height,
				'rating': processImage(img)
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

});