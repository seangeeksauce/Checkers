$(function() {
    var redPositions = [2,4,6,8,9,11,13,15,18,20,22,24];
    var blackPositions = [41,43,45,47,50,52,54,56,57,59,61,63];
    var blackRestrictedLeft = [25,41,57];
    var blackRestrictedRight = [40,56];
    var redRestrictedLeft = [1,9,17,33,49];
    var redRestrictedRight = [8,16,24,32,48,64];
    var restrictedLeft = $.merge(redRestrictedLeft,blackRestrictedLeft);
    var restrictedRight = $.merge(redRestrictedRight,blackRestrictedRight);
    var blackKingsPos = [2,4,6,8];
    var redKingsPos = [57,59,61,63];
    var active_entity = null;
    var player = 'player_1';
    var moved = false;
    var jumped = null;
    var active;

    var red = $('#template-red');
    var black = $('#template-black');

    var position = {
        'id' : null,
        'jumped' : null
    };

    // rules
    // red - left  = -7
    // red - right = -9
    // black - left = 9
    // black - right = 7

    // set up initial game pieces
    $.each(redPositions, function(index) {
        red = red.clone();
        red
            .removeClass('hidden')
            .removeAttr('id');
        $('.position-' + redPositions[index]).prepend(red);
    });

    $.each(blackPositions, function(index) {
        black = black.clone();
        black
            .removeClass('hidden')
            .removeAttr('id');
        $('.item.position-' + blackPositions[index]).prepend(black);
    });

    $('#add-friend').on('click','.save-request',function(event) {
        //if (this.classList.contains('locked'))
        //    return;

        var modal = $(this).parents('.modal');

        this.classList.add('locked')

        if (modal.id === 'pending-invite')
            alert('its an invite');

        var email = $('#add-friend input[name=email]').val();
        var username = $('#add-friend input[name=username]').val();

        $.ajax({
            url: Routing.generate('checkers.friends.add'),
            data: JSON.stringify({
                email: email,
                username: username,
            }),
            type: 'post',
            dataType: 'json',
            context: this,
            success: function(reply) {
                this.classList.remove('locked');

                if (!reply.success) {
                    alert(reply.error || 'An unknown error has occurred.');

                    return;
                }

                modal.modal('hide');
            },
        });
    });

    $('input[name=enable_password]').on('click', function() {
       if($(this).prop('checked'))
           $('input[name=game_password]').parent().removeClass('hidden');
        else
           $('input[name=game_password]').parent().addClass('hidden');
    });

    $('.position')
        .hover(
            function() {
                if (!$(this).hasClass('active-item') && !$(this).hasClass('red')) {
                    $(this)
                        .addClass('hovered-space');
                }
            },
            function() {
                $(this).removeClass('hovered-space');
             }
        )
        .click(function() {
            if ($(this).hasClass('available-space-test')) {
                if (active_entity) {
                    $(this).find('.item').append(active_entity.find('.game-piece'));

                    console.log('we have moved, check if we should delete');
                    if (active !== null && $(this).data('jumped')) {
                        $('#' + $(this).data('jumped')).find('.game-piece').remove();
                    }

                    moved = true;
                    active = null;

                    checkKing($(this));

                    alternateTurn();
                }
            }

            removeActive($(this));

            if ($(this).hasClass('black') && $(this).find('.game-piece').length > 0) {
                console.log('we are checking black here');
                $(this).addClass('active-item');

                active = $(this);
            }

            if (!moved && $(this).find('.game-piece').length) {
                availableMove($(this));
            }
    });

    function availableMove(pos) {
        var current_int = pos.children(':first').attr('id').replace( /^\D+/g, '');
        active_entity = pos;
        checkMoves(pos);
    }

    function checkMoves(pos) {
        var rightId;
        var leftId;
        var kingRightId;
        var kingLeftId;
        var posId = pos.find('.item').attr('id').replace(/^\D+/g, '');
        var right = 9;
        var left = 7;
        var kingRight = (-9);
        var kingLeft = (-7);

        if (player === 'player_1' && pos.find('.game-piece.red-piece').length > 0 || player === 'player_2' && pos.find('.game-piece.black-piece').length > 0)
            return;

        if (player === 'player_1') {
            right = (-9);
            left = (-7);
            kingRight = 9;
            kingLeft = 7;
        }

        rightId = parseInt(right) + parseInt(posId);
        leftId = parseInt(left) + parseInt(posId);
        kingRightId = parseInt(kingRight) + parseInt(posId);
        kingLeftId = parseInt(kingLeft) + parseInt(posId);

        var rightOpp = getOpponentPosition(rightId);
        var leftOpp = getOpponentPosition(leftId);
        var kingRightPos = getOpponentPosition(kingRightId);
        var kingLeftPos = getOpponentPosition(kingLeftId);

        // try right
        if (rightOpp.parent().hasClass('black')) {
            if (rightOpp.find('.game-piece').length > 0) {
                rightOpp.parent().addClass('testing-box');
                if (getOpponentPosition(rightId + right).find('.game-piece').length > 0) {
                    console.log('cant jump this piece!!!!RIGHT');
                } else if ((player === 'player_1' && rightOpp.find('.game-piece').hasClass('red-piece') ||
                    player === 'player_2' && rightOpp.find('.game-piece').hasClass('black-piece')) &&
                        getOpponentPosition(rightId + right).parent().hasClass('black')) {

                    console.log('we can jump the RIGHT pos');
                    getOpponentPosition(rightId + right).parent()
                        .addClass('available-space-test')
                        .attr('data-jumped', getOpponentPosition(rightId).attr('id'));
                    position.id = getOpponentPosition(rightId + right);
                    position.jumped = rightOpp;
                    jumped = true;
                }
            } else { // if a space is available to move to
                rightOpp.parent().addClass('available-space-test');
            }
        }
        // try right KING
        if (pos.find('.game-piece').data('king') && kingRightPos.parent().hasClass('black')) {
            console.log('passed First Step')
            if (kingRightPos.find('.game-piece').length > 0) {
                console.log('we have a KING!!!!!');
                kingRightPos.parent().addClass('testing-box');
                if (getOpponentPosition(kingRightId + kingRight).find('.game-piece').length > 0) {
                    console.log('cant jump this piece!!!!RIGHT');
                } else if ((player === 'player_1' && kingRightPos.find('.game-piece').hasClass('red-piece') ||
                    player === 'player_2' && kingRightPos.find('.game-piece').hasClass('black-piece')) &&
                    getOpponentPosition(kingRightId + kingRight).parent().hasClass('black')) {

                    console.log('we can jump the RIGHT pos');
                    getOpponentPosition(kingRightId + kingRight).parent()
                        .addClass('available-space-test')
                        .attr('data-jumped', getOpponentPosition(kingRightId).attr('id'));
                    position.id = getOpponentPosition(kingRightId + kingRight);
                    position.jumped = kingRightPos;
                    jumped = true;
                }
            } else { // if a space is available to move to
                kingRightPos.parent().addClass('available-space-test');
            }
        }

        // try left
        if (leftOpp.parent().hasClass('black')) {
            if (leftOpp.find('.game-piece').length > 0) {
                leftOpp.parent().addClass('testing-box');
                console.log('we are testing LEFT');
                if (getOpponentPosition(leftId + left).find('.game-piece').length > 0) {
                    console.log('cant jump this piece!!!!LEFT');
                } else if ((player === 'player_1' && leftOpp.find('.game-piece').hasClass('red-piece') ||
                    player === 'player_2' && leftOpp.find('.game-piece').hasClass('black-piece')) &&
                    getOpponentPosition(parseInt(leftId) + parseInt(left)).parent().hasClass('black')) {

                    getOpponentPosition(parseInt(leftId) + parseInt(left)).parent()
                        .addClass('available-space-test')
                        .attr('data-jumped', getOpponentPosition(leftId).attr('id'));
                    console.log('we can jump the left pos');
                    position.id = getOpponentPosition(parseInt(leftId) + parseInt(left));
                    position.jumped = leftOpp;
                    jumped = true;
                }
            } else { // if a space is available to move to
                leftOpp.parent().addClass('available-space-test');
            }
        }

        // try left KING
        if (pos.find('.game-piece').data('king') && kingLeftPos.parent().hasClass('black')) {
            console.log('passed First Step')
            if (kingLeftPos.find('.game-piece').length > 0) {
                console.log('we have a KING!!!!!');
                kingLeftPos.parent().addClass('testing-box');
                if (getOpponentPosition(kingLeftId + kingLeft).find('.game-piece').length > 0) {
                    console.log('cant jump this piece!!!!LEFT');
                } else if ((player === 'player_1' && kingLeftPos.find('.game-piece').hasClass('red-piece') ||
                    player === 'player_2' && kingLeftPos.find('.game-piece').hasClass('black-piece')) &&
                    getOpponentPosition(kingLeftId + kingLeft).parent().hasClass('black')) {

                    console.log('we can jump the LEFT pos');
                    getOpponentPosition(kingLeftId + kingLeft).parent()
                        .addClass('available-space-test')
                        .attr('data-jumped', getOpponentPosition(kingLeftId).attr('id'));
                    position.id = getOpponentPosition(kingLeftId + kingLeft);
                    position.jumped = kingLeftPos;
                    jumped = true;
                }
            } else { // if a space is available to move to
                kingLeftPos.parent().addClass('available-space-test');
            }
        }
    }

    function checkKing(pos) {
        var posId = pos.find('.item').attr('id').replace(/^\D+/g, '');
        if (player === 'player_1') {
            if ($.inArray(parseInt(posId), blackKingsPos) > 0) {
                pos.find('.game-piece')
                    .attr('data-king', true)
                    .addClass('king');

            }
        } else {
            if ($.inArray(parseInt(posId), redKingsPos) > 0) {
                pos.find('.game-piece')
                    .attr('data-king', true)
                    .addClass('king');
            }
        }
        return;
    }

    function getOpponentPosition(pos) {
        return $('#position-'+ parseInt(pos));
    }

    function alternateTurn() {
        active_entity = null;
        if (player === 'player_1')
            player = 'player_2'
        else
            player = 'player_1';

        moved = false;
    }

    function moveAction(pos) {

    }

    function removeActive(active) {
        active.removeClass('hovered-space');
        $.each($('.position'), function(index) {
            var $this = $(this);
            if ($this !== active && $this.hasClass('active-item'))
                $this.removeClass('active-item');

            if ($this.hasClass('available-space-test'))
                $this.removeClass('available-space-test');

            if ($this.hasClass('testing-box'))
                $this.removeClass('testing-box');

            if ($this.data('jumped'))
                $this.removeAttr('data-jumped');
        });
    }
});