$(function() {
    var redPositions = [2,4,6,8,9,11,13,15,18,20,22,24];
    var blackPositions = [41,43,45,47,50,52,54,56,57,59,61,63];
    var blackRestrictedLeft = [25,41,57];
    var blackRestrictedRight = [40,56];
    var redRestrictedLeft = [1,9,17,33,49];
    var redRestrictedRight = [8,16,24,32,48,64];
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
                    // TODO Add code for jumping..

                    if (active !== null) {
                        console.log('we have moved, check if we should delete');
                        if (jumped) {
                            console.log('deleting..');
                            var activeId = active.find('.item').attr('id').replace(/^\D+/g, '');
                            var currentId = $(this).find('.item').attr('id').replace(/^\D+/g, '');
                            var removed_id = (parseInt(currentId) - parseInt(activeId));
                            console.log(activeId);
                            console.log(currentId);
                            console.log(removed_id);
                            removed_id = Math.abs(parseInt(removed_id / 2));

                            console.log(parseInt(removed_id) + Math.abs(parseInt(activeId)));
                            $('#position-'+ (parseInt(removed_id + parseInt(activeId)))).find('.game-piece').remove();

                        }
                    }

                    checkJumps($(this));

                    moved = true;
                    active = null;

                    alternateTurn();
                }

                $(this).removeClass('available-space');
            }

            $(this).removeClass('hovered-space');

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
        var hostLeft = $('#position-'+ (parseInt(current_int) - 7)).parent();
        var hostRight = $('#position-'+ (parseInt(current_int) - 9)).parent();
        var opponentRight = $('#position-'+ (parseInt(current_int) + 7)).parent();
        var opponentLeft = $('#position-'+ (parseInt(current_int) + 9)).parent();
        active_entity = pos;
        checkMoves(pos);

        //if (player === 'player_1') {
        //    if (pos.find('.black-piece').length) {
        //        if ($.inArray(parseInt(current_int), $.merge(blackRestrictedRight,redRestrictedRight)) !== -1) {
        //            if (hostRight.find('.game-piece').length <= 0)
        //                hostRight.addClass('available-space');
        //            else {
        //                if (hostRight.find('.game-piece').hasClass('red-piece')) {
        //                    var parentRight = $('#position-'+ (parseInt(current_int) - 9)).parent();
        //                    if (parentRight.length <= 0) {
        //                        parentRight.addClass('available-space');
        //                        checkMoves(pos);
        //                    }
        //                }
        //            }
        //
        //        } else if ($.inArray(parseInt(current_int), $.merge(blackRestrictedLeft,redRestrictedLeft)) !== -1) {
        //            if (hostLeft.find('.game-piece').length <= 0)
        //                hostLeft.addClass('available-space');
        //        } else {
        //            if (hostRight.find('.game-piece').length <= 0) {
        //                hostRight.addClass('available-space');
        //            } else {
        //                if (hostRight.find('.game-piece').hasClass('red-piece')) {
        //                    //console.log('found an opponents piece! LEFT');
        //                    //console.log(hostRight.attr('id'));
        //                    checkMoves(pos);
        //                    var parentRight = hostRight.find('.item').attr('id').replace( /^\D+/g, '');
        //                    parentRight = $('#position-'+ (parseInt(parentRight) - 9)).parent();
        //                    console.log(hostRight.find('.game-piece'));
        //
        //                    if (parentRight.length) {
        //                        parentRight.addClass('available-space');
        //                        jumped = hostRight.find('.game-piece');
        //                    }
        //                }
        //            }
        //
        //            if (hostLeft.find('.game-piece').length <= 0) {
        //                hostLeft.addClass('available-space');
        //            } else {
        //                if (hostLeft.find('.game-piece').hasClass('red-piece')) {
        //                    //console.log('found an opponents piece! RIGHT');
        //                    //console.log(hostLeft.find('.item').attr('id'));
        //                    checkMoves(pos);
        //
        //                    var parentRight = $('#position-'+ (parseInt(current_int) - 14)).parent();
        //                    if (parentRight.length) {
        //                        parentRight.addClass('available-space');
        //                        jumped = hostLeft.find('.game-piece');
        //                    }
        //                }
        //            }
        //        }
        //    }
        //} else { // if player 2
        //    if (pos.find('.red-piece').length) {
        //        if ($.inArray(parseInt(current_int), $.merge(blackRestrictedRight, redRestrictedRight)) !== -1) {
        //            if (opponentRight.find('.game-piece').length <= 0)
        //                opponentRight.addClass('available-space');
        //            else {
        //                //console.log('looking for baddy right');
        //                if (opponentRight.find('.game-piece').hasClass('black-piece')) {
        //                    //console.log('found an opponents piece! LEFT');
        //                    checkMoves(pos);
        //                    var parentRight = $('#position-' + (parseInt(current_int) + 9)).parent();
        //                    if (parentRight.length) {
        //                        parentRight.addClass('available-space');
        //                    }
        //                }
        //            }
        //        } else if ($.inArray(parseInt(current_int), $.merge(blackRestrictedLeft, redRestrictedLeft)) !== -1) {
        //            if (opponentLeft.find('.game-piece').length <= 0)
        //                opponentLeft.addClass('available-space');
        //            else {
        //                //console.log('looking for baddy left');
        //                if (opponentLeft.find('.game-piece').hasClass('black-piece')) {
        //                    //console.log('found an opponents piece! LEFT');
        //                    //console.log(opponentLeft.attr('id'));
        //                    checkMoves(pos);
        //
        //                    var parentRight = opponentLeft.find('.item').attr('id').replace( /^\D+/g, '');
        //                    //console.log('something weird');
        //                    parentRight = $('#position-'+ (parseInt(parentRight) + 7)).parent();
        //                    if (parentRight.length) {
        //                        parentRight.addClass('available-space');
        //                    }
        //                }
        //            }
        //        } else {
        //            if (opponentRight.find('.game-piece').length <= 0)
        //                opponentRight.addClass('available-space');
        //             else {
        //                if (opponentRight.find('.game-piece').hasClass('black-piece')) {
        //                    //console.log('found an opponents piece! right');
        //                    checkMoves(pos);
        //                    var parentRight = opponentRight.find('.item').attr('id').replace( /^\D+/g, '');
        //                    //console.log(parentRight);
        //                    parentRight = $('#position-'+ (parseInt(parentRight) + 7)).parent();
        //                    if (parentRight.length) {
        //                        parentRight.addClass('available-space');
        //                    }
        //                }
        //            }
        //            if (opponentLeft.find('.game-piece').length <= 0)
        //                opponentLeft.addClass('available-space');
        //            else {
        //                if (opponentLeft.find('.game-piece').hasClass('black-piece')) {
        //                    //console.log('found an opponents piece! LEFT');
        //                    //console.log(hostLeft.find('.item').attr('id'));
        //                    checkMoves(pos);
        //
        //                    var parentRight = $('#position-'+ (parseInt(current_int) + 18)).parent();
        //                    if (parentRight.length) {
        //                        parentRight.addClass('available-space');
        //                        jumped = opponentLeft.find('.game-piece');
        //                    }
        //                }
        //            }
        //        }
        //    }
        //}
    }

    function checkMoves(pos) {
        var rightId;
        var leftId;
        var posId = pos.find('.item').attr('id').replace(/^\D+/g, '');
        var right = 9;
        var left = 7;
        //position.id = null;
        //position.jumped = null;

        if (player === 'player_1' && pos.find('.game-piece.red-piece').length > 0 || player === 'player_2' && pos.find('.game-piece.black-piece').length > 0)
            return;

        if (player === 'player_1') {
            right = (-9);
            left = (-7);
        }

        rightId = parseInt(right) + parseInt(posId);
        leftId = parseInt(left) + parseInt(posId);

        var rightOpp = getOpponentPosition(rightId);
        var leftOpp = getOpponentPosition(leftId);

        if (rightOpp.find('.game-piece').length > 0) {
            rightOpp.parent().addClass('testing-box');
            if (getOpponentPosition(rightId + right).find('.game-piece').length > 0) {
                console.log('cant jump this piece!!!!RIGHT');
            } else {
                console.log('we can jump the RIGHT pos');
                getOpponentPosition(rightId + right).parent().addClass('available-space-test');
                position.id = getOpponentPosition(rightId + right);
                position.jumped = rightOpp;
                jumped = true;
            }
        } else { // if a space is available to move to
            rightOpp.parent().addClass('available-space-test');
        }

        // try left
        if (leftOpp.find('.game-piece').length > 0) {
            leftOpp.parent().addClass('testing-box');
            console.log('we are testing LEFT');
            if (getOpponentPosition(leftId + left).find('.game-piece').length > 0) {
                console.log('cant jump this piece!!!!LEFT');
            } else {
                getOpponentPosition(parseInt(leftId) + parseInt(left)).parent().addClass('available-space-test');
                console.log('we can jump the left pos');
                position.id = getOpponentPosition(parseInt(leftId) + parseInt(left));
                position.jumped = leftOpp;
                jumped = true;
            }
        } else { // if a space is available to move to
            leftOpp.parent().addClass('available-space-test');
        }
    }

    function checkJumps(pos) {
        var rightId;
        var leftId;
        var posId = pos.find('.item').attr('id').replace(/^\D+/g, '');
        var right = 9;
        var left = 7;
        //position.id = null;
        //position.jumped = null;

        if (player === 'player_1') {
            right = (-9);
            left = (-7);
        }

        rightId = parseInt(right) + parseInt(posId);
        leftId = parseInt(left) + parseInt(posId);

        var rightOpp = getOpponentPosition(rightId);
        var leftOpp = getOpponentPosition(leftId);

        if (rightOpp.find('.game-piece').length > 0) {
            if (getOpponentPosition(rightId + right).find('.game-piece').length > 0) {
            } else {
                position.id = getOpponentPosition(rightId + right);
                position.jumped = rightOpp;
            }
        } else { // if a space is available to move to
        }

        // try left
        if (leftOpp.find('.game-piece').length > 0) {
            if (getOpponentPosition(leftId + left).find('.game-piece').length > 0) {
            } else {
                position.id = getOpponentPosition(parseInt(leftId) + parseInt(left));
                position.jumped = leftOpp;
            }
        } else { // if a space is available to move to
        }
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
        //var current_int = active.children(':first').attr('id').replace( /^\D+/g, '');

        $.each($('.position'), function(index) {
            var $this = $(this);
            if ($this !== active && $this.hasClass('active-item'))
                $this.removeClass('active-item');

            if ($this.hasClass('available-space-test'))
                $this.removeClass('available-space-test');

            if ($this.hasClass('testing-box'))
                $this.removeClass('testing-box');
        });
    }
});