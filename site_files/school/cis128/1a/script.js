$(document).ready(function() {
    $("#start-animation").click(function() {
        const heading = $("#main-heading");
        const image = $("#profile-img");

        heading.animate({ fontSize: "2.4em" }, 1000)
               .animate({ fontSize: "2em" }, 1000);

        heading.css("color", "blue");

        setTimeout(function() {
            heading.css("color", "black");
        }, 1000);

        image.css("border", "5px solid blue");

        setTimeout(function() {
            image.css("border", "none");
        }, 1000);
    });
});