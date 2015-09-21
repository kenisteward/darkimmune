/// <reference path="../../typings/jquery/jquery.d.ts"/>
$().ready(function () {
	$(".nav a").on("click", function () {
		$(".nav").find(".active").removeClass("active");
		$(this).parent().addClass("active");
	});
});

