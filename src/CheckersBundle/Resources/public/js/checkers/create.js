$(function() {
    $('input[name=enable_password]').on('click', function() {
        if($(this).prop('checked'))
            $('input[name=game_password]').parent().removeClass('hidden');
        else
            $('input[name=game_password]').parent().addClass('hidden');
    });

    $('input[name=submit]').on('click', function(event) {
        if ($('input[name=title]').val().length > 0 ) {
            $('input[name=title]').removeClass('error-input');
            $(this).parent().submit();
        } else {
            event.preventDefault();
            $('input[name=title]').addClass('error-input');
        }
    });
});