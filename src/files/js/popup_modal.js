$(window).load(function() {

    //Apply the modal functionality to all elements with the class
    $(".modalTarget").click(function(){
        console.log($(this).prop('outerHTML'))
        $("#PopupModal").css("display", "block");
        $("#PopupModalContent").html( $(this).prop('outerHTML') );
        $("#PopupModalContent").children().removeClass().attr('style', "");

    })

    //Setup the close button to shut down the 
    $("#PopupModal").click(function(){
        $("#PopupModal").css("display", "none");
    })
})

