$(function() {
    $('#add-friend').on('click','.save-request',function(event) {

        var email = 'sean@c.com';
        var username = 'seangeek';

        console.log('test!');

        $.ajax({
            url: Routing.generate('checkers.friends.add'),
            data: JSON.stringify({
                arguments: {
                    fields: {
                        email: email,
                        username: username,
                    },
                },
            }),
            type: 'post',
            dataType: 'json',
            context: this,
            success: function (reply) {
                if (!reply.success) {
                    alert('An error occurred while trying to add notes to this lead. Please try again.');

                    this.classList.remove('locked');

                    return;
                }
            }
        });
    });
});